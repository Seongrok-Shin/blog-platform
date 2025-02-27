import sql from "@/lib/db";

export async function GET() {
  try {
    const posts = await sql`
      SELECT slug, updated_at FROM posts
    `;

    // Explicitly define the type for posts
    interface Post {
      slug: string;
      updated_at: Date;
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>https://blog-platform-rose-nu.vercel.app/</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>1.0</priority>
      </url>
      <url>
        <loc>https://blog-platform-rose-nu.vercel.app/blog</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>
      ${(posts as Post[]) // Explicitly cast to the Post[] type
        .map((post) => {
          return `
            <url>
              <loc>https://blog-platform-rose-nu.vercel.app/blog/${post.slug}</loc>
              <lastmod>${new Date(post.updated_at).toISOString()}</lastmod>
              <changefreq>daily</changefreq>
              <priority>0.7</priority>
            </url>
          `;
        })
        .join("")}
    </urlset>`;

    return new Response(sitemap, {
      headers: {
        "Content-Type": "application/xml",
      },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate sitemap" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}
