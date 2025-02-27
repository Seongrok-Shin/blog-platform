"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import UnBookmarkIcon from "./UnBookmarkIcon";
import BookmarkIcon from "./BookmarkIcon";

interface BookmarkButtonProps {
  postId: string | number | undefined;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({ postId }) => {
  const { data: session } = useSession();
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const checkBookmark = async () => {
      if (!session?.user?.id || !postId) return;

      try {
        // Ensure postId is a string
        const postIdString = String(postId);
        // Log the URL being called
        const apiUrl = `/api/bookmarks/${postIdString}`;
        console.log("Checking bookmark status at:", apiUrl);

        // Use the new API endpoint
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("API response:", data); // Log the API response
          setIsBookmarked(data.bookmarked);
        } else if (response.status === 401) {
          setIsBookmarked(false);
        } else {
          console.error("Error checking bookmark:", response.status);
        }
      } catch (error) {
        console.error("Error checking bookmark:", error);
      }
    };

    checkBookmark();
  }, [session?.user?.id, postId]);

  const handleBookmark = async () => {
    if (!session?.user?.id || !postId) return;

    try {
      const apiEndpoint = isBookmarked
        ? `/api/bookmarks/delete`
        : `/api/bookmarks/add`;
      const method = isBookmarked ? "DELETE" : "POST";
      const response = await fetch(apiEndpoint, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: postId }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("API response:", data);
        setIsBookmarked(!isBookmarked);
      }
      window.location.reload();
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  return (
    <button
      onClick={handleBookmark}
      className={`flex items-center px-2 rounded-lg`}
    >
      {isBookmarked ? <UnBookmarkIcon /> : <BookmarkIcon />}
    </button>
  );
};

export default BookmarkButton;
