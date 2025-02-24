"use server";

import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  getCategories,
  createCategory,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
} from "@/lib/apis/category";
import { UpdateCategoryInput } from "@/types/category";

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories);
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

    const slug = json.name.toLowerCase().replace(/\s+/g, "-");
    const existingCategory = await getCategoryBySlug(slug);
    if (existingCategory) {
      return NextResponse.json(
        { error: "Category with this name already exists" },
        { status: 409 },
      );
    }

    const category = await createCategory(json.name);
    revalidatePath("/admin/categories");
    revalidatePath("/blog");

    return NextResponse.json(category, { status: 201 });
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

    const updatedCategory = await updateCategory(
      id,
      json as UpdateCategoryInput,
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

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: "Valid ID is required" },
        { status: 400 },
      );
    }

    await deleteCategory(id);

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
