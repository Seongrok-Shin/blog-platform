import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/authOptions";
import sql from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId } = await req.json();
    const userId = session.user.id;

    if (!postId || !userId) {
      return NextResponse.json(
        { message: "Missing postId or userId" },
        { status: 400 },
      );
    }

    const existingBookmark = await sql(
      "SELECT * FROM bookmarks WHERE post_id = $1 AND user_id = $2",
      [postId, userId],
    );

    if (existingBookmark.length > 0) {
      return NextResponse.json(
        { message: "Bookmark already exists" },
        { status: 409 },
      );
    }

    await sql("INSERT INTO bookmarks (post_id, user_id) VALUES ($1, $2)", [
      postId,
      userId,
    ]);
    return NextResponse.json({ message: "Bookmark added" }, { status: 201 });
  } catch (error) {
    console.error("Error adding bookmark:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
