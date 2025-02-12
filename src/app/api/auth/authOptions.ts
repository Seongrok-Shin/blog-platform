import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import sql from "@/lib/db";
import type { NextAuthOptions, DefaultSession } from "next-auth";
interface AuthUser {
  id: string;
  name: string;
  email: string;
  image?: string;
}
interface ExtendedSession extends DefaultSession {
  user: {
    id: string;
    name: string;
    email: string;
    image: string;
  };
}
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "test@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: Record<"email" | "password", string> | undefined,
      ): Promise<AuthUser | null> {
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error("Missing email or password");
        }
        // Query the user from the database
        const result = await sql(
          "SELECT id, name, email, password, image FROM users WHERE email = $1 LIMIT 1",
          [credentials.email],
        );
        const user = result[0];
        if (!user) {
          throw new Error("User not found");
        }
        // Compare the provided password with the hashed password
        const isValid = await compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Incorrect password");
        }
        // Return user object (with image) but we will not store the image in the token
        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          image: user.image || "/profile/profile-default.svg",
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // JWT callback: only store id, name, and email to keep the token compact.
    async jwt({ token, user }) {
      if (user) {
        const authUser = user as AuthUser;
        token = {
          id: String(authUser.id),
          name: authUser.name || "",
          email: authUser.email,
        };
      }
      return token;
    },
    // Session callback: fetch the latest image URL from the database.
    async session({ session, token }): Promise<ExtendedSession> {
      let fetchedImage = "";
      try {
        const result = await sql(
          "SELECT image FROM users WHERE email = $1 LIMIT 1",
          [token.email],
        );
        if (result && result[0] && result[0].image) {
          fetchedImage = result[0].image;
        }
      } catch (error) {
        console.error("Error fetching user image from DB:", error);
      }
      // Use the fetchedImage only if it does not appear to be a data URI (i.e. a large string)
      // and its length is less than 300 characters; otherwise, use the default profile image.
      const userImage =
        fetchedImage &&
        !fetchedImage.startsWith("data:") &&
        fetchedImage.length < 300
          ? fetchedImage
          : "/profile/profile-default.svg";
      const user = {
        id: token.id ? String(token.id) : "",
        name: token.name || "",
        email: token.email || "",
        image: userImage,
      };
      return { expires: session.expires, user };
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
