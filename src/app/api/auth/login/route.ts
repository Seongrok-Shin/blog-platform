import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import sql from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing email or password" },
        { status: 400 },
      );
    }
    // Fetch the user from the "users" table by email.
    const result = await sql(
      "SELECT id, name, email, password FROM users WHERE email = $1 LIMIT 1",
      [email],
    );
    const user = result[0];
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    // Verify that the provided password matches the stored hashed password.
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }
    return NextResponse.json({
      success: true,
      message: "User logged in successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
