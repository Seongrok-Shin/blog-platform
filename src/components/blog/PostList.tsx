/**
 * Copyright (c) 2025 Seongrok Shin
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PostCard from "./PostCard";
import type { PostCardProps } from "@/types/blog";

export default function PostList({ posts }: { posts: PostCardProps[] }) {
  if (!posts || posts.length === 0) {
    return <div>No posts found.</div>; // Fallback UI
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
