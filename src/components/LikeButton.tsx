"use client";

import { useState, useEffect } from "react";
import { LikeButtonProps, LikeData } from "@/types/blog";

const LikeButton: React.FC<LikeButtonProps> = ({ postId, userId }) => {
  const [likes, setLikes] = useState<number>(0);
  const [liked, setLiked] = useState<boolean>(false);

  useEffect(() => {
    const fetchLikes = async () => {
      const res = await fetch(`/api/likes?postId=${postId}`);
      if (res.ok) {
        const data = await res.json();
        setLikes(data.likes);

        // Ensure likesData exists before checking the userId
        if (data.likesData && Array.isArray(data.likesData)) {
          const userLiked = data.likesData.some(
            (like: LikeData) => like.user_id === userId,
          );
          setLiked(userLiked);
        } else {
          console.error("Invalid likesData format:", data.likesData);
        }
      } else {
        console.error("Error fetching likes", res.status, await res.text());
      }
    };

    fetchLikes();
  }, [postId, userId]);

  const handleLike = async () => {
    const res = await fetch("/api/likes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, userId }),
    });

    if (res.ok) {
      const data = await res.json();
      setLiked(data.liked);
      setLikes((prev) => (data.liked ? prev + 1 : prev - 1));
    } else {
      console.error("Error liking the post", res.status, await res.text());
    }
  };

  return (
    <button
      onClick={handleLike}
      className={`flex items-center gap-2 p-2 rounded-lg ${
        liked
          ? "bg-red-500 text-white"
          : "bg-gray-200 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
      }`}
    >
      ❤️ {likes}
    </button>
  );
};

export default LikeButton;
