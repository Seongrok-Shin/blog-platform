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
        // Return user object (without password) for JWT token
        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          image: user.image || "/default-profile.png",
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const authUser = user as AuthUser;
        token.id = String(authUser.id);
        token.name = authUser.name || "";
        token.email = authUser.email;
        token.image = authUser.image || "/default-profile.png";
      }
      return token;
    },
    async session({ session, token }): Promise<ExtendedSession> {
      const extendedSession: ExtendedSession = {
        ...session,
        user: {
          id: token.id ? String(token.id) : "",
          name: token.name || "",
          email: token.email || "",
          image: typeof token.image === "string" ? token.image : "",
        },
      };
      return extendedSession;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
