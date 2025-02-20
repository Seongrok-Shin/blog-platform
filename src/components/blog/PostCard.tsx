/**
 * Copyright (c) 2025 Seongrok Shin
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Link from "next/link";
import Image from "next/image";
import type { PostCardProps } from "@/types/blog";

export default function PostCard({ post }: { post: PostCardProps }) {
  if (!post) {
    return <div>No post data available.</div>; // Fallback UI
  }

  const { title, excerpt, slug, createdAt, author, coverImageUrl } = post;

  // Handle default profile image
  const profileImageSrc = author.profileImageUrl || "/default-profile.png";

  return (
    <article className="flex flex-col overflow-hidden rounded-lg border shadow-sm transition-shadow hover:shadow-md">
      {coverImageUrl && (
        <div className="relative h-48 w-full">
          <Image
            src={coverImageUrl}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="flex-1 p-4">
        <h2 className="text-xl font-semibold mb-2">
          <Link href={`/blog/${slug}`} className="hover:text-primary">
            {title}
          </Link>
        </h2>
        <p className="text-gray-600 mb-4 line-clamp-2">{excerpt}</p>
        <div className="flex items-center gap-2">
          <div className="relative h-8 w-8 rounded-full overflow-hidden">
            <Image
              src={profileImageSrc}
              alt={author.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-medium">{author.name}</p>
            <p className="text-xs text-gray-500">
              {new Date(createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
