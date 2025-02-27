import sql from "@/lib/db";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts =
    await sql`SELECT id, updated_at, slug FROM posts ORDER BY created_at DESC LIMIT 50000 OFFSET 0`;

  if (!posts || posts.length === 0) {
    return [];
  } else {
    return [
      {
        url: process.env.NEXT_PUBLIC_API_URL || "https://localhost:3000/",
        lastModified: new Date(),
        changeFrequency: "yearly",
        priority: 1,
      },
      {
        url:
          `${process.env.NEXT_PUBLIC_API_URL}blog/` ||
          `https://localhost:3000/blog/`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      },
      ...posts.map((post): MetadataRoute.Sitemap[number] => {
        return {
          url:
            `${process.env.NEXT_PUBLIC_API_URL}blog/${post.slug}/` ||
            `https://localhost:3000/blog/${post.slug}/`,
          lastModified: new Date(post.updated_at).toISOString(),
          changeFrequency: "daily",
          priority: 0.7,
        };
      }),
    ];
  }
}
