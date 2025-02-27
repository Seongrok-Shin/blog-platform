import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import sql from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ postId: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { postId } = await params;

    console.log("API: /api/bookmarks/[postId] - postId:", postId); // Log the postId

    if (!postId || !userId) {
      return NextResponse.json(
        { message: "Missing postId or userId" },
        { status: 400 },
      );
    }

    // Check if the bookmark exists
    const existingBookmark = await sql(
      "SELECT * FROM bookmarks WHERE post_id = $1 AND user_id = $2",
      [postId, userId],
    );

    if (!existingBookmark || existingBookmark.length === 0) {
      // If no bookmark is found, return bookmarked: false
      return NextResponse.json({ bookmarked: false }, { status: 200 });
    }

    // If a bookmark is found, return bookmarked: true
    return NextResponse.json({ bookmarked: true }, { status: 200 });
  } catch (error) {
    console.error("Error checking bookmark:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
