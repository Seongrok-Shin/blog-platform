"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export default function ProfilePage() {
  const { data: session, status } = useSession({ required: false });
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const defaultProfile = "/profile/profile-default.svg";

  if (status === "loading") return <p>Loading...</p>;
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full">
          <p className="text-center text-lg text-gray-700 mb-4">
            You are not logged in.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="w-full px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  const user = session.user;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-2xl p-6">
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="w-32 h-32 relative mb-4">
            <Image
              src={
                preview ||
                (user?.image === "/default-profile.png"
                  ? defaultProfile
                  : user?.image) ||
                defaultProfile
              }
              unoptimized
              alt="Profile Image"
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Profile</h1>
            <p className="text-xl font-semibold text-gray-700">
              {user?.name || "No Name"}
            </p>
            <p className="text-gray-500">{user?.email || "No Email"}</p>
          </div>
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!selectedImage) return;
            setLoading(true);
            setError("");

            const formData = new FormData();
            formData.append("file", selectedImage);

            try {
              const res = await fetch("/api/profile/updateImage", {
                method: "POST",
                body: formData,
              });
              if (!res.ok) {
                const data = await res.json();
                setError(data.error || "Failed to update image");
              } else {
                router.refresh();
              }
            } catch (err) {
              console.error(err);
              setError("An unexpected error occurred");
            }
            setLoading(false);
          }}
          className="mb-6"
        >
          <label className="block mb-2 font-semibold text-gray-700">
            Change Profile Image:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const files = e.target.files;
              if (files && files[0]) {
                setSelectedImage(files[0]);
                setPreview(URL.createObjectURL(files[0]));
              }
            }}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:text-sm file:font-semibold file:bg-gray-50 hover:file:bg-gray-100 mb-2"
          />
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="block w-full mx-auto px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {loading ? "Updating..." : "Update Profile Image"}
          </button>
        </form>
        <button
          onClick={() => router.push("/profile/change-password")}
          className="block w-full mx-auto mb-6 px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          Change Password
        </button>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="block w-full mx-auto px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
