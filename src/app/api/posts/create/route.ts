import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      excerpt,
      content,
      coverImage,
      authorId,
      categoryId,
      tagIds,
    } = body;

    if (!categoryId || !tagIds || tagIds.length === 0) {
      throw new Error("Category and tags are required.");
    }

    const [newPost] = await sql(
      `INSERT INTO posts (title, excerpt, content, cover_image_url, author_id, category_id, tag_ids)
       VALUES ($1, $2, $3, $4, $5, $6, $7::uuid[])
       RETURNING *`,
      [title, excerpt, content, coverImage, authorId, categoryId, tagIds],
    );

    return NextResponse.json({ post: newPost }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error, ", details: error },
      { status: 500 },
    );
  }
}
