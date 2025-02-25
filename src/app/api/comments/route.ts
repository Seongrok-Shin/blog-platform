// app/api/comments/route.ts
import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const postId = parseInt(url.searchParams.get("postId") || "");

    if (!postId) {
      return NextResponse.json(
        { error: "Missing postId parameter" },
        { status: 400 },
      );
    }

    const query = `
        SELECT c.*, u.id AS user_id, u.name, u.image
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.post_id = $1
        ORDER BY c.created_at DESC
      `;
    const result = await sql(query, [postId]);

    // Transform raw data to include user object
    const transformedComments = result.map((comment) => ({
      ...comment,
      user: {
        id: comment.user_id,
        name: comment.name,
        image: comment.image || null,
      },
    }));

    if (transformedComments.length === 0) {
      return NextResponse.json({ error: "No comments found" }, { status: 404 });
    }

    return NextResponse.json(transformedComments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { content, postId, userId } = await request.json();

    const query = `
      INSERT INTO comments (post_id, user_id, content)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    const result = await sql(query, [postId, userId, content]);
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Comment submission error:", error);
    return NextResponse.json(
      { error: "Invalid request format" },
      { status: 400 },
    );
  }
}
