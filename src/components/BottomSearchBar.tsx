"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BottomSearchBar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState("all");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(
        `/search?query=${encodeURIComponent(searchQuery)}&filter=${searchFilter}`,
      );
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-8 gap-4">
      {/* Pagination (Add your pagination component here) */}
      <div>{/* Pagination goes here */}</div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="w-full sm:w-auto">
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
          <select
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full sm:w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
          >
            <option value="all">All</option>
            <option value="title">Title</option>
            <option value="title_content">Title/Content</option>
            <option value="writer">Writer</option>
          </select>
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
          />
          <button
            type="submit"
            className="w-full sm:w-auto rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
}
