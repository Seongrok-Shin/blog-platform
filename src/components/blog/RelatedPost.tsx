import Link from "next/link";
import type { PostCardProps } from "@/types/blog";

interface RelatedPostsProps {
  posts: PostCardProps[];
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ posts }) => {
  if (!posts || posts.length === 0) {
    return <p>No related posts found.</p>;
  }

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold mb-4">Related Posts</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-lg shadow-md p-4 dark:bg-gray-800 dark:text-gray-100"
          >
            <Link href={`/blog/${post.slug}`} className="hover:underline">
              <h4 className="text-lg font-semibold">{post.title}</h4>
            </Link>
            <p className="text-gray-600">{post.excerpt}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedPosts;
