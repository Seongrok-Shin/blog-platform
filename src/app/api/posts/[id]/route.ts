import { NextResponse } from "next/server";
import sql from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/authOptions";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify the user is the author of the post
    const [post] = await sql("SELECT author_id FROM posts WHERE id = $1", [id]);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const [user] = await sql("SELECT id FROM users WHERE email = $1", [
      session.user.email,
    ]);

    if (post.author_id !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized to delete this post" },
        { status: 403 },
      );
    }

    await sql("DELETE FROM posts WHERE id = $1", [id]);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
