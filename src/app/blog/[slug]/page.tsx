import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/types/blog";

// Sample posts data. In a real app, you would fetch data from a CMS or database.
const samplePosts: Post[] = [
  {
    title: "Getting Started with Next.js",
    excerpt:
      "Learn how to build modern web applications with Next.js, React, and TypeScript.",
    slug: "getting-started-with-nextjs",
    date: "2025-01-01",
    author: {
      name: "Seongrok Shin",
      image: "https://github.com/Seongrok-Shin.png",
    },
    coverImage: "https://via.placeholder.com/800x400",
  },
  {
    title: "Building a Blog Platform",
    excerpt:
      "A comprehensive guide to creating a full-featured blog platform using modern web technologies.",
    slug: "building-a-blog-platform",
    date: "2025-01-02",
    author: {
      name: "Seongrok Shin",
      image: "https://github.com/Seongrok-Shin.png",
    },
    coverImage: "https://via.placeholder.com/800x400",
  },
  {
    title: "Styling with Tailwind CSS",
    excerpt:
      "Learn how to create beautiful, responsive designs using Tailwind CSS utility classes.",
    slug: "styling-with-tailwind-css",
    date: "2025-01-03",
    author: {
      name: "Seongrok Shin",
      image: "https://github.com/Seongrok-Shin.png",
    },
    coverImage: "https://via.placeholder.com/800x400",
  },
];

// Helper function to get a post by slug
function getPostBySlug(slug: string): Post | undefined {
  return samplePosts.find((post) => post.slug === slug);
}

interface PageProps {
  params: { slug: string };
}

export default function BlogPostPage({ params }: PageProps) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900">{post.title}</h1>
      <div className="mt-4 text-gray-600">
        <time dateTime={new Date(post.date).toISOString()}>{post.date}</time>
      </div>
      {post.coverImage && (
        <div className="relative mt-6 h-64 w-full z-0">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <p className="mt-6 text-lg text-gray-700">{post.excerpt}</p>
      <div className="mt-8 flex items-center gap-4">
        <div className="relative h-10 w-10">
          <Image
            src={post.author.image}
            alt={post.author.name}
            fill
            className="rounded-full"
          />
        </div>
        <span className="text-sm font-medium">{post.author.name}</span>
      </div>
      <Link
        href="/blog"
        className="mt-8 inline-block text-primary hover:underline"
      >
        &larr; Back to Blog
      </Link>
    </article>
  );
}
