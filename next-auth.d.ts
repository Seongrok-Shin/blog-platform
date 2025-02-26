// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string | number | undefined; // Ensure 'id' exists in User
  }

  interface Session {
    user: {
      id: string | number | undefined; // Ensure 'id' exists in Session user
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
