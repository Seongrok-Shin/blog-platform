"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  if (status === "loading") return <p>Loading...</p>;
  if (!session || !session.user) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <p>You are not logged in.</p>
        <button
          onClick={() => signIn("credentials")}
          className="px-4 py-2 bg-primary text-white rounded mt-4"
        >
          Sign In
        </button>
      </div>
    );
  }

  const user = session.user;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      <div className="flex items-center space-x-4 mb-4">
        <Image
          src={user.image ?? "/default-profile.png"}
          alt="Profile Image"
          width={80}
          height={80}
          className="rounded-full"
        />
        <div>
          <p className="text-xl font-semibold">{user.name ?? "No Name"}</p>
          <p>{user.email ?? "No Email"}</p>
        </div>
      </div>
      <button
        onClick={() => signOut()}
        className="px-4 py-2 bg-red-500 text-white rounded"
      >
        Sign Out
      </button>
    </div>
  );
}
