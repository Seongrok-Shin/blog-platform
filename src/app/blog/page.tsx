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
import BottomSearchBar from "@/components/blog/BottomSearchBar";

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
        console.log(data);
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
    <div className="py-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Blog</h1>
        <p className="text-gray-600 mb-8">
          Explore our latest posts and insights.
        </p>
      </div>
      <PostList posts={posts} />
      {session && (
        <button
          onClick={() => router.push("/blog/create")}
          className="fixed bottom-8 right-8 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          +
        </button>
      )}
      <BottomSearchBar />
    </div>
  );
}
