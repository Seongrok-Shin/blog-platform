// /app/api/likes/[id]/route.ts
import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET({ params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { message: "Post ID is required" },
      { status: 400 },
    );
  }

  try {
    const result = await sql(
      "SELECT COUNT(*) AS count FROM likes WHERE post_id = $1",
      [id],
    );

    if (result.length === 0) {
      return NextResponse.json({ count: 0 }); // No likes for this post
    }

    const count = result[0]?.count || 0;
    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error fetching likes:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
