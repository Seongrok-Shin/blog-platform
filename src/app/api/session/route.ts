// app/api/session/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/authOptions";

export async function GET() {
  const session = await getServerSession(authOptions);
  return NextResponse.json({ session });
}
