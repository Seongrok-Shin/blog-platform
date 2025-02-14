/**
 * Copyright (c) 2025 Seongrok Shin
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Link from "next/link";
import Image from "next/image";
import type { PostCardProps } from "@/types/blog";

export default function PostCard({
  title,
  excerpt,
  slug,
  createdAt,
  author,
  coverImageUrl,
}: PostCardProps) {
  // Add date validation
  const isValidDate = (dateString: string) => {
    return !isNaN(Date.parse(dateString));
  };

  const formattedDate = isValidDate(createdAt)
    ? new Date(createdAt).toLocaleDateString()
    : "Invalid date";

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
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>
      )}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div className="flex-1">
          <Link href={`/blog/${slug}`} className="mt-2 block">
            <h3 className="text-xl font-semibold text-gray-900 hover:text-primary">
              {title}
            </h3>
            <p className="mt-3 text-base text-gray-500 line-clamp-3">
              {excerpt}
            </p>
          </Link>
        </div>
        <div className="mt-6 flex items-center">
          <div className="relative h-10 w-10 flex-shrink-0">
            <Image
              src={profileImageSrc}
              alt={author.name}
              className="rounded-full"
              fill
              sizes="40px"
            />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{author.name}</p>
            <div className="flex space-x-1 text-sm text-gray-500">
              <time
                dateTime={
                  isValidDate(createdAt)
                    ? new Date(createdAt).toISOString()
                    : ""
                }
              >
                {formattedDate}
              </time>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
