import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/authOptions";
import sql from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Parse JSON body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      console.error("Error parsing JSON body:", error);
      return NextResponse.json(
        { error: "Invalid JSON body" },
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const { title, excerpt, content, coverImage, categoryId, tagIds } = body;
    if (!title || !excerpt) {
      return NextResponse.json(
        { error: "Missing title or excerpt" },
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const slug = title.toLowerCase().replace(/\s+/g, "-");

    // Get user ID from database
    const [user] = await sql("SELECT id FROM users WHERE email = $1", [
      session.user.email,
    ]);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const query = `
      INSERT INTO posts (title, excerpt, content, slug, cover_image_url, author_id, category_id, tag_ids)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8::uuid[])
      RETURNING *
    `;
    const values = [
      title,
      excerpt,
      content,
      slug,
      coverImage,
      user.id,
      categoryId,
      tagIds,
    ];

    const [newPost] = await sql(query, values);

    return NextResponse.json(
      { post: newPost },
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "6");

    const offset = (page - 1) * limit;

    const query = `
      SELECT p.*, u.name as author_name, u.image as author_image
      FROM posts p
      JOIN users u ON p.author_id = u.id
      ORDER BY p.created_at DESC
      LIMIT $1 OFFSET $2
    `;

    const result = await sql(query, [limit, offset]);

    // Get total count for pagination
    const countQuery = `SELECT COUNT(*) FROM posts`;
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
