/**
 * Copyright (c) 2025 Seongrok Shin
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import PostList from "@/components/blog/PostList";
import { useRouter } from "next/navigation";

// Sample data - This would typically come from a database or API
const samplePosts = [
  {
    title: "Getting Started with Next.js",
    excerpt:
      "Learn how to build modern web applications with Next.js, React, and TypeScript.",
    slug: "getting-started-with-nextjs",
    date: "2025-01-01",
    author: {
      name: "Seongrok Shin",
      image: "https://github.com/Seongrok-Shin.png",
    },
    coverImage: "https://via.placeholder.com/800x400",
  },
  {
    title: "Building a Blog Platform",
    excerpt:
      "A comprehensive guide to creating a full-featured blog platform using modern web technologies.",
    slug: "building-a-blog-platform",
    date: "2025-01-02",
    author: {
      name: "Seongrok Shin",
      image: "https://github.com/Seongrok-Shin.png",
    },
    coverImage: "https://via.placeholder.com/800x400",
  },
  {
    title: "Styling with Tailwind CSS",
    excerpt:
      "Learn how to create beautiful, responsive designs using Tailwind CSS utility classes.",
    slug: "styling-with-tailwind-css",
    date: "2025-01-03",
    author: {
      name: "Seongrok Shin",
      image: "https://github.com/Seongrok-Shin.png",
    },
    coverImage: "https://via.placeholder.com/800x400",
  },
];

export default function BlogPage() {
  const { data: session } = useSession();
  const [posts] = useState(samplePosts);
  const router = useRouter();

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
        <PostList posts={posts} />
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
