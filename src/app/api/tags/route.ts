"use server";

import { NextResponse } from "next/server";
import sql from "@/lib/db";
import slugify from "slugify";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const tag = await sql(`SELECT * FROM tags WHERE slug = $1`, [slug]);
      if (!tag) {
        return NextResponse.json({ error: "Tag not found" }, { status: 404 });
      }
      return NextResponse.json(tag);
    }

    const tags = await sql(`SELECT * FROM tags ORDER BY created_at DESC`);
    return NextResponse.json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    if (
      !json.name ||
      typeof json.name !== "string" ||
      json.name.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "Name is required and must be a non-empty string" },
        { status: 400 },
      );
    }

    const slug = slugify(json.name, { lower: true, strict: true });
    const existingTag = await sql(
      `SELECT * FROM tags WHERE name = $1 AND id != $2`,
      [json.name, json.id],
    );
    if (existingTag.length > 0) {
      return NextResponse.json(
        { error: "Tag with this name already exists" },
        { status: 409 },
      );
    }

    const tag = await sql(
      `INSERT INTO tags (name, slug) VALUES ($1, $2) RETURNING *`,
      [json.name, slug],
    );

    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    console.error("Error creating tag:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: "Valid ID is required" },
        { status: 400 },
      );
    }

    const json = await request.json();
    if (
      !json.name ||
      typeof json.name !== "string" ||
      json.name.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "Name is required and must be a non-empty string" },
        { status: 400 },
      );
    }
    const slug = slugify(json.name, { lower: true, strict: true });

    const updatedTag = await sql(
      `UPDATE tags SET name = $1, slug = $2, updated_at = NOW() WHERE id = $3 RETURNING *`,
      [json.name, slug, id],
    );
    if (!updatedTag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    return NextResponse.json(updatedTag);
  } catch (error) {
    console.error("Error updating tag:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (
      !id ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        id,
      )
    ) {
      return NextResponse.json(
        { error: "Invalid UUID format" },
        { status: 400 },
      );
    }

    await sql(`DELETE FROM tags WHERE id::uuid = $1`, [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting tag:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
