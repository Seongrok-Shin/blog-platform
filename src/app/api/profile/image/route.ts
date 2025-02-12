import { NextResponse } from "next/server";
import sql from "@/lib/db";
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  if (!email)
    return NextResponse.json({ message: "Email required" }, { status: 400 });
  try {
    const result = await sql(
      "SELECT image_data, image_mimetype FROM users WHERE email = $1",
      [email],
    );
    if (!result || !result[0] || !result[0].image_data) {
      return NextResponse.json({ message: "Image not found" }, { status: 404 });
    }
    return new NextResponse(result[0].image_data, {
      status: 200,
      headers: {
        "Content-Type": result[0].image_mimetype,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    return NextResponse.json(
      { message: "Error fetching image" },
      { status: 500 },
    );
  }
}
