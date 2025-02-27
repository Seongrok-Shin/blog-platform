"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import type { PostCardProps } from "@/types/blog";
import { useSearchParams } from "next/navigation";
import Pagination from "@/components/Pagination";
import PostList from "@/components/blog/PostList";
import BottomSearchBar from "@/components/BottomSearchBar";
import Loading from "@/components/Loading";

const BookmarksPage = () => {
  const { data: session } = useSession();
  const [bookmarks, setBookmarks] = useState<PostCardProps[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
  });
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const isMobile = window.innerWidth < 768;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const limit = isMobile ? 3 : 6;
        const url = `/api/bookmarks?page=${page}&limit=${limit}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setBookmarks(data.posts);
        setPagination(data.pagination);
      } catch (err) {
        console.error(err);
        setError("Error fetching bookmarks");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookmarks();
  }, [page, isMobile]);

  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>
          Please <Link href="/login">login</Link> to view your bookmarks.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );
  }

  if (bookmarks?.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>You have not bookmarked any posts yet.</p>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">
          {session.user.name} bookmarks
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Explore your saved posts.
        </p>
      </div>
      {bookmarks && <PostList posts={bookmarks} />}
      <div className={`flex ${isMobile ? "flex-col" : "justify-between"}`}>
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
        />
        <BottomSearchBar />
      </div>
    </div>
  );
};

export default BookmarksPage;
