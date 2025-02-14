import { NextResponse } from "next/server";
import sql from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/authOptions";

export async function POST(request: Request) {
  // Parse form-data from the request
  let formData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  // Get the file
  const file = formData.get("file");
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: "File not provided" }, { status: 400 });
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "Only image files are allowed" },
      { status: 400 },
    );
  }

  // Validate file size
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return NextResponse.json(
      { error: "File size must be less than 5MB" },
      { status: 400 },
    );
  }

  // Authenticate user
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Convert the file to a Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    // Store image in posts table
    const [result] = await sql(
      `INSERT INTO posts 
       (image_data, image_mimetype, author_id) 
       VALUES ($1, $2, $3) 
       RETURNING id`,
      [buffer, file.type, session.user.email],
    );

    return NextResponse.json({
      success: true,
      imageUrl: `/api/coverImage/${result.id}`,
    });
  } catch (error) {
    console.error("Error saving cover image:", error);
    return NextResponse.json(
      { error: "Failed to save cover image" },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Image ID required" }, { status: 400 });
  }

  try {
    const [result] = await sql(
      "SELECT image_data, image_mimetype FROM posts WHERE id = $1",
      [id],
    );

    if (!result || !result.image_data) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    return new NextResponse(result.image_data, {
      status: 200,
      headers: {
        "Content-Type": result.image_mimetype,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error fetching cover image:", error);
    return NextResponse.json(
      { error: "Failed to fetch cover image" },
      { status: 500 },
    );
  }
}
