import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    //TODO: Implement contact form submission logic
    console.log("Received contact form submission:", { name, email, message });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process request", details: error },
      { status: 500 },
    );
  }
}
