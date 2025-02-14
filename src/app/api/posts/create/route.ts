import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, excerpt, content, coverImage, authorId } = body;

    const [newPost] = await sql(
      `INSERT INTO posts (title, excerpt, content, cover_image_url, author_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [title, excerpt, content, coverImage, authorId],
    );

    return NextResponse.json({ post: newPost }, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
