import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET(
  request: Request,
  {
    params,
    searchParams: _searchParams, // eslint-disable-line @typescript-eslint/no-unused-vars
  }: { params: { id: string }; searchParams: URLSearchParams },
) {
  try {
    const { id } = await params;

    const [result] = await sql(
      "SELECT image_data, image_mimetype FROM cover_images WHERE id = $1",
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
    console.error("Error fetching image:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
