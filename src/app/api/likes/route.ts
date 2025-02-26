import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { postId, userId } = await req.json();

    if (!postId || !userId) {
      return NextResponse.json(
        { message: "Missing postId or userId" },
        { status: 400 },
      );
    }

    // Check if the user has already liked the post
    const result = await sql(
      "SELECT * FROM likes WHERE post_id = $1 AND user_id = $2",
      [postId, userId],
    );

    if (result.length > 0) {
      // Remove like
      await sql("DELETE FROM likes WHERE post_id = $1 AND user_id = $2", [
        postId,
        userId,
      ]);
      return NextResponse.json({ liked: false });
    }

    // Add like
    await sql("INSERT INTO likes (post_id, user_id) VALUES ($1, $2)", [
      postId,
      userId,
    ]);
    return NextResponse.json({ liked: true });
  } catch (error) {
    console.error("Error processing like:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const postId = url.searchParams.get("postId");

  if (!postId) {
    return NextResponse.json(
      { message: "Post ID is required" },
      { status: 400 },
    );
  }

  try {
    // Fetch likes count
    const countResult = await sql(
      "SELECT COUNT(*) AS count FROM likes WHERE post_id = $1",
      [postId],
    );
    const count = countResult.length > 0 ? countResult[0]?.count : 0;

    // Fetch the likes data (user_id of users who liked this post)
    const likesResult = await sql(
      "SELECT user_id FROM likes WHERE post_id = $1",
      [postId],
    );

    return NextResponse.json({ likes: count, likesData: likesResult });
  } catch (error) {
    console.error("Error fetching likes:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
