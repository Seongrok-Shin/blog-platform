"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import PostList from "@/components/blog/PostList";
import { useRouter, useSearchParams } from "next/navigation";
import type { PostCardProps } from "@/types/blog";
import BottomSearchBar from "@/components/BottomSearchBar";
import Pagination from "@/components/Pagination";
import CategoryFilter from "@/components/CategoryFilter";
import TagFilter from "@/components/TagFilter"; // Import your TagFilter component
import type { Tag } from "@/types/tag";
import type { Category } from "@/types/category";
import Loading from "@/components/Loading";

export default function BlogPage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<PostCardProps[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]); // Assuming tags are strings
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
  });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const isMobile = window.innerWidth < 768;

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/category");

        if (!response.ok) {
          throw new Error(`Error fetching categories: ${response.statusText}`);
        }

        const data: Category[] = await response.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Error fetching categories:", e);
      }
    };

    fetchCategories();
  }, []);

  // Fetch Posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const limit = isMobile ? 3 : 6;
        let url = `/api/posts?page=${page}&limit=${limit}`;

        if (selectedCategory) {
          url += `&category=${selectedCategory}`;
        }

        if (selectedTags.length) {
          url += `&tags=${selectedTags.join(",")}`;
        }

        const response = await fetch(url);

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
  }, [page, isMobile, selectedCategory, selectedTags]);

  // Fetch Tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("/api/tags");

        if (!response.ok) {
          throw new Error(`Error fetching tags: ${response.statusText}`);
        }

        const data: Tag[] = await response.json();
        setTags(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Error fetching tags:", e);
      }
    };

    fetchTags();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="py-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">
          Blog
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Explore our latest posts and insights.
        </p>
      </div>
      <CategoryFilter
        categories={categories}
        onCategorySelect={setSelectedCategory}
      />
      <TagFilter
        tags={tags} // Pass tags as an array
        onTagSelect={(tagName) => {
          // Toggle tag selection
          setSelectedTags((prevSelectedTags) =>
            prevSelectedTags.includes(tagName)
              ? prevSelectedTags.filter((tag) => tag !== tagName)
              : [...prevSelectedTags, tagName],
          );
        }}
      />
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
