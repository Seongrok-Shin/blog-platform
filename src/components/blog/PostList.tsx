/**
 * Copyright (c) 2025 Seongrok Shin
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PostCard from "./PostCard";
import type { PostListProps } from "@/types/blog";

export default function PostList({ posts }: PostListProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard
            key={post.slug}
            id={post.id}
            title={post.title}
            excerpt={post.excerpt}
            slug={post.slug}
            createdAt={post.createdAt}
            author={post.author}
            coverImageUrl={post.coverImageUrl}
          />
        ))}
      </div>
    </div>
  );
}
