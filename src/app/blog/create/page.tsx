"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function CreatePostPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>You need to be signed in to create a post.</div>;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title || !excerpt) return;
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, excerpt }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.error || "Failed to create post");
        return;
      }

      router.push("/blog");
    } catch {
      alert("An error occurred while creating the post.");
    }
  };

  return (
    <div className="py-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Create a New Post</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-4">
        <div>
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Excerpt</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="mt-1 w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          Create Post
        </button>
      </form>
    </div>
  );
}
