import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import sql from "@/lib/db";

export async function DELETE(req: Request) {
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

    const result = await sql(
      "DELETE FROM bookmarks WHERE post_id = $1 AND user_id = $2",
      [postId, userId],
    );

    if (result.length === 0) {
      return NextResponse.json(
        { message: "Bookmark not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Bookmark deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
