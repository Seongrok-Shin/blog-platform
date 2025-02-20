/**
 * Copyright (c) 2025 Seongrok Shin
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import PostList from "@/components/blog/PostList";
import { useRouter, useSearchParams } from "next/navigation";
import type { PostCardProps } from "@/types/blog";
import BottomSearchBar from "@/components/BottomSearchBar";
import Pagination from "@/components/Pagination";

export default function BlogPage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<PostCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const limit = isMobile ? 3 : 6;
        const response = await fetch(`/api/posts?page=${page}&limit=${limit}`);
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data.posts);
        setPagination(data.pagination);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [page, isMobile]);

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
      <div className={`flex ${isMobile ? "flex-col" : "justify-between"}`}>
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
        />
        <BottomSearchBar />
      </div>
    </div>
  );
}
