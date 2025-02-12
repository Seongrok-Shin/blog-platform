import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/authOptions";

export async function POST(request: Request) {
  try {
    // Authenticate the user
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse JSON request body
    const { title, excerpt } = await request.json();
    if (!title || !excerpt) {
      return NextResponse.json(
        { error: "Missing title or excerpt" },
        { status: 400 },
      );
    }

    // Create slug and date
    const slug = title.toLowerCase().replace(/\s+/g, "-");
    const date = new Date().toISOString().split("T")[0];

    // Create new post object
    const newPost = {
      title,
      excerpt,
      slug,
      date,
      author: {
        name: session.user.name || "Anonymous",
        image: session.user.image || "https://via.placeholder.com/50",
      },
      coverImage: "https://via.placeholder.com/800x400",
    };

    // Normally, insert newPost into a database here

    return NextResponse.json({ post: newPost }, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
