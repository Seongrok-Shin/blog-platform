import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");
    const filter = searchParams.get("filter") || "all";

    // Validate query
    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 },
      );
    }

    let whereClause = "";
    switch (filter) {
      case "title":
        whereClause = "p.title ILIKE $1";
        break;
      case "title_content":
        whereClause = "p.title ILIKE $1 OR p.content ILIKE $1";
        break;
      case "writer":
        whereClause = "u.name ILIKE $1";
        break;
      default:
        whereClause =
          "p.title ILIKE $1 OR p.content ILIKE $1 OR u.name ILIKE $1";
    }

    const result = await sql(
      `SELECT p.*, u.name as author_name, u.image as author_image
       FROM posts p
       JOIN users u ON p.author_id = u.id
       WHERE ${whereClause}
       ORDER BY p.created_at DESC`,
      [`%${query}%`],
    );

    return NextResponse.json(
      result.map((post) => ({
        ...post,
        author: {
          name: post.author_name,
          profileImageUrl: post.author_image || "/default-profile.png",
        },
      })),
    );
  } catch (error) {
    console.error("Error searching posts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
