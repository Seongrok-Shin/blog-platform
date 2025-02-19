import { PostCardProps } from "@/types/blog";
import PostList from "@/components/blog/PostList";

async function getSearchResults(
  query: string,
  filter: string,
): Promise<PostCardProps[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const response = await fetch(
    `${baseUrl}/api/posts/search?query=${encodeURIComponent(query)}&filter=${filter}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch search results");
  }

  return response.json();
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { query: string; filter?: string };
}) {
  // Ensure searchParams is awaited
  const { query, filter = "all" } = await searchParams;

  if (!query) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Search</h1>
        <p>Please enter a search query.</p>
      </div>
    );
  }

  const posts = await getSearchResults(query, filter);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Search Results for `{query}`</h1>
      {posts.length > 0 ? (
        <PostList posts={posts} />
      ) : (
        <p>No posts found matching your search.</p>
      )}
    </div>
  );
}
