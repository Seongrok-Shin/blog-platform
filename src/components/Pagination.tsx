"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({
  currentPage,
  totalPages,
}: PaginationProps) {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  return (
    <div className="flex justify-center gap-2 mt-8">
      {currentPage > 1 && (
        <Link
          href={`/blog?page=${currentPage - 1}&query=${query}`}
          className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
        >
          Previous
        </Link>
      )}

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Link
          key={page}
          href={`/blog?page=${page}&query=${query}`}
          className={`px-4 py-2 rounded-md ${
            page === currentPage
              ? "bg-primary text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages && (
        <Link
          href={`/blog?page=${currentPage + 1}&query=${query}`}
          className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
        >
          Next
        </Link>
      )}
    </div>
  );
}
