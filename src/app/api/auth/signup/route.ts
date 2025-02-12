import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import sql from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }
    // Validate password strength
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        {
          error:
            "Password does not meet complexity requirements. It should be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).",
        },
        { status: 400 },
      );
    }
    // Hash the password using bcrypt with 10 salt rounds.
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await sql(
      "INSERT INTO users (name, email, password, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id, name, email, created_at",
      [name, email, hashedPassword],
    );
    const newUser = result[0];
    return NextResponse.json({
      success: true,
      user: newUser,
      message: "User registered successfully",
    });
  } catch (err) {
    console.error("Error during sign up:", err);
    // For development, return the actual error message. (Remove this detail in production.)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 },
    );
  }
}
