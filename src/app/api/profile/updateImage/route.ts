import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/authOptions";
import { NextResponse } from "next/server";
import sql from "@/lib/db";
export async function POST(request: Request) {
  // Parse form-data from the request
  let formData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ message: "Invalid form data" }, { status: 400 });
  }
  // Get the file (assumed field name is "file")
  const file = formData.get("file");
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ message: "File not provided" }, { status: 400 });
  }
  // Check if file is JPEG
  if (file.type !== "image/jpeg") {
    return NextResponse.json(
      { message: "Only JPEG files are allowed" },
      { status: 400 },
    );
  }
  // Convert the file (Blob) to a Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  // Authenticate the user using session
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    // Update the user's record in the database with the binary image data and its MIME type.
    await sql(
      "UPDATE users SET image_data = $1, image_mimetype = $2, image = $3 WHERE email = $4",
      [
        buffer,
        file.type,
        `/api/profile/image?email=${session.user.email}&v=${Date.now()}`,
        session.user.email,
      ],
    );
    return NextResponse.json(
      { message: "Profile image updated" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { message: "Profile update error" },
      { status: 500 },
    );
  }
}
