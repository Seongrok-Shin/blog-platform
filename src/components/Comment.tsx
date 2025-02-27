"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import type { CommentProps, SessionType } from "@/types/comment";

export default function CommentsSection({ postId }: { postId: number }) {
  const [newComment, setNewComment] = useState("");
  const [session, setSession] = useState<SessionType | null>(null);
  const [comments, setComments] = useState<CommentProps[]>([]);

  const fetchSession = useCallback(async () => {
    try {
      const response = await fetch("/api/session");
      const data = await response.json();
      setSession(data.session);
    } catch (error) {
      console.error("Error fetching session:", error);
    }
  }, []);

  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/comments?postId=${postId}`);

      if (!response.ok) {
        if (response.status === 404) {
          setComments([]);
          return;
        }
        throw new Error("Failed to fetch comments");
      }

      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]);
    }
  }, [postId]); // Include postId as dependency

  useEffect(() => {
    fetchSession();
    fetchComments();
  }, [fetchSession, fetchComments]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!newComment.trim()) return;

    try {
      const response = await fetch(`/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newComment,
          postId,
          userId: session?.user?.id,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit comment");

      setNewComment("");
      await fetchComments(); // Refresh comments
    } catch (error) {
      console.error("Comment submission error:", error);
    }
  }

  return (
    <div className="mt-12 space-y-6">
      {/* Comment Form */}
      {session && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            rows={3}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Post Comment
          </button>
        </form>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <div className="relative h-10 w-10">
              <Image
                src={comment.user.image || "/profile/profile-default.svg"}
                alt={comment.user.name}
                fill
                className="rounded-full"
                sizes="40px"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/profile/${comment.user.id}`}
                  className="font-medium hover:text-blue-500 dark:text-gray-50 dark:hover:text-blue-400"
                >
                  {comment.user.name}
                </Link>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                {comment.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
