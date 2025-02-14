/**
 * Copyright (c) 2025 Seongrok Shin
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import PostList from "@/components/blog/PostList";
import { useRouter } from "next/navigation";
import type { PostCardProps } from "@/types/blog";

export default function BlogPage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<PostCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (isLoading) {
    return <div className="text-center py-8">Loading posts...</div>;
  }

  return (
    <div className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Latest Posts
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Discover the latest insights, tutorials, and thoughts on web
            development, design, and technology.
          </p>
        </div>
      </div>
      <div className="mt-12">
        {posts.length > 0 ? (
          <PostList posts={posts} />
        ) : (
          <div className="text-center text-gray-500">No posts available</div>
        )}
      </div>
      {session && (
        <button
          onClick={() => router.push("/blog/create")}
          className="fixed bottom-8 right-8 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          +
        </button>
      )}
    </div>
  );
}
