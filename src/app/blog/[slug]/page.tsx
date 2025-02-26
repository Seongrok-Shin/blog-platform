import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import sql from "@/lib/db";
import type { PostCardProps } from "@/types/blog";
import DeleteButton from "@/components/blog/DeleteButton";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/authOptions";
import CommentsSection from "@/components/Comment";
import LikeButton from "@/components/LikeButton";

async function getPostBySlug(slug: string): Promise<PostCardProps | null> {
  try {
    const query = `
    SELECT p.*, u.id as author_id, u.name as author_name, u.email as author_email, u.image as author_image
    FROM posts p
    JOIN users u ON p.author_id = u.id
    WHERE p.slug = $1
    `;
    const result = await sql(query, [slug]);

    if (result.length === 0) {
      return null;
    }

    const post = result[0];
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      slug: post.slug,
      createdAt: post.created_at.toISOString(),
      coverImageUrl: post.cover_image_url,
      author: {
        name: post.author_name,
        email: post.author_email,
        profileImageUrl: post.author_image || "/profile/profile-default.svg",
      },
    };
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const session = await getServerSession(authOptions);

  if (!post) {
    notFound();
  }

  const isAuthor = session?.user?.email === post.author.email;
  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex justify-between items-start">
        <h1 className="text-4xl font-bold text-gray-900">{post.title}</h1>
        {isAuthor && <DeleteButton postId={post.id} />}
      </div>
      <div className="mt-4 text-gray-600">
        <time dateTime={new Date(post.createdAt).toISOString()}>
          {new Date(post.createdAt).toLocaleDateString()}
        </time>
      </div>
      {post.coverImageUrl && (
        <div className="relative mt-6 h-64 w-full z-0">
          <Image
            src={post.coverImageUrl}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}
      <p className="mt-6 text-lg text-gray-700">{post.content}</p>
      <div className="mt-8 flex items-center gap-4">
        <div className="relative h-10 w-10">
          <Image
            src={post.author.profileImageUrl}
            alt={post.author.name}
            fill
            className="rounded-full"
            sizes="40px"
          />
        </div>
        <span className="text-sm font-medium">{post.author.name}</span>
        <LikeButton postId={post.id} userId={session?.user?.id} />
      </div>
      <CommentsSection postId={post.id} />
      <Link
        href="/blog"
        className="mt-8 inline-block text-primary hover:underline"
      >
        &larr; Back to Blog
      </Link>
    </article>
  );
}
