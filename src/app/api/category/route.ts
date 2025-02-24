"use server";

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import sql from "@/lib/db";
import slugify from "slugify";

export async function GET() {
  try {
    const query = `
      SELECT * FROM categories
      ORDER BY created_at DESC
    `;

    const result = await sql(query);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
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
    const existingCategory = await sql(
      `SELECT * FROM categories WHERE name = $1 AND id != $2`,
      [json.name, json.id],
    );

    if (existingCategory.length > 0) {
      return NextResponse.json(
        { error: "Category with this name already exists" },
        { status: 409 },
      );
    }

    const category = await sql(
      `INSERT INTO categories (name, slug, description) VALUES ($1, $2, $3) RETURNING *`,
      [json.name, slug, json.description],
    );

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error creating category:", error);
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

    const existingCategory = await sql(
      `SELECT * FROM categories WHERE name = $1 AND id != $2`,
      [json.name, id],
    );
    if (existingCategory.length > 0) {
      return NextResponse.json(
        { error: "Category with this name already exists" },
        { status: 409 },
      );
    }
    const updatedCategory = await sql(
      `UPDATE categories SET name = $1, slug = $2, updated_at = NOW() WHERE id = $3 RETURNING *`,
      [json.name, slug, id],
    );
    if (!updatedCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    revalidatePath("/admin/categories");
    revalidatePath("/blog");

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
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

    // Cast VARCHAR column to UUID in query
    await sql(`DELETE FROM categories WHERE id::uuid = $1`, [id]);

    revalidatePath("/admin/categories");
    revalidatePath("/blog");

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
