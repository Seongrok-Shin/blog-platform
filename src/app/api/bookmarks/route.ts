import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/authOptions";
import sql from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "6");
    const offset = (page - 1) * limit;
    const userId = session.user.id;

    const query = `
            SELECT p.*, u.name as author_name, u.image as author_image
            FROM posts p
                                INNER JOIN bookmarks b ON p.id = b.post_id
                                INNER JOIN users u ON p.author_id = u.id
            WHERE b.user_id = ${userId}
            ORDER BY p.created_at DESC
                LIMIT ${limit}
            OFFSET ${offset}
        `;

    const result = await sql(query);

    const countQuery = `SELECT COUNT(*)
                            FROM bookmarks
                            where user_id = ${userId}`;
    const [countResult] = await sql(countQuery);
    const totalPosts = parseInt(countResult.count);

    return NextResponse.json(
      {
        posts: (result || []).map((post) => ({
          id: post.id,
          title: post.title,
          excerpt: post.excerpt,
          slug: post.slug,
          createdAt: post.created_at.toISOString(),
          coverImageUrl: post.cover_image_url,
          author: {
            name: post.author_name || "Unknown Author",
            profileImageUrl:
              post.author_image || "/profile/profile-default.svg",
          },
        })),
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalPosts / limit),
          totalPosts,
        },
      },
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
