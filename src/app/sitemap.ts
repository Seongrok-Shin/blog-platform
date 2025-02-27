import sql from "@/lib/db";
import { PostParams } from "@/types/blog";
import { MetadataRoute } from "next";

export default async function sitemap({
  id,
}: {
  id: number;
  params: PostParams;
}): Promise<MetadataRoute.Sitemap> {
  const pageSize = 50000;
  const start = (id - 1) * pageSize;
  const posts =
    await sql`SELECT id, date,slug FROM posts ORDER BY created_at DESC LIMIT ${pageSize} OFFSET ${start}`;

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
        url: process.env.NEXT_PUBLIC_API_URL || "https://localhost:3000/",
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      },
      ...posts.map((post): MetadataRoute.Sitemap[number] => {
        return {
          url:
            `${process.env.NEXT_PUBLIC_API_URL}blog/${post.slug}/` ||
            `https://localhost:3000/blog/${post.slug}/`,
          lastModified: new Date(
            post.updated_at || post.created_at || post.date,
          ).toISOString(),
          changeFrequency: "daily",
          priority: 0.7,
        };
      }),
    ];
  }
}
