"use server";

import sql from "@/lib/db";
import { Category, UpdateCategoryInput } from "@/types/category";
import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { NextResponse } from "next/server";
import { Post } from "@/types/blog";

function createSlug(name: string) {
  return slugify(name, { lower: true, strict: true });
}

export async function getCategories(): Promise<Category[]> {
  try {
    const categories: Category[] = (await sql`
      SELECT * FROM categories 
      ORDER BY created_at DESC
    `) as unknown as Category[];
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  try {
    const categoryResult = (await sql`
      SELECT * FROM categories
      WHERE slug = ${slug}
    `) as unknown as Category[];
    return categoryResult[0] || null;
  } catch (error) {
    console.error("Error fetching category:", error);
    throw new Error("Failed to fetch category");
  }
}

async function createCategory(name: string) {
  try {
    const slug = createSlug(name);
    const result = await sql`
      INSERT INTO categories (name, slug)
      VALUES (${name}, ${slug})
      RETURNING id, name, slug, created_at
    `;
    return result[0];
  } catch (error) {
    console.error("Error creating category:", error);
    throw new Error("Failed to create category");
  }
}

export async function updateCategory(id: string, input: UpdateCategoryInput) {
  try {
    const slug = input.name ? slugify(input.name, { lower: true }) : undefined;

    const result = await sql`
      UPDATE categories 
      SET 
        name = COALESCE(${input.name}, name), 
        slug = COALESCE(${slug}, slug),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    revalidatePath("/admin/categories");
    revalidatePath("/blog");

    return result[0] || null;
  } catch (error) {
    console.error("Error updating category:", error);
    throw new Error("Failed to update category");
  }
}

export async function deleteCategory(id: string) {
  try {
    await sql`
      DELETE FROM categories 
      WHERE id = ${id}
    `;

    revalidatePath("/admin/categories");
    revalidatePath("/blog");
  } catch (error) {
    console.error("Error deleting category:", error);
    throw new Error("Failed to delete category");
  }
}

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

export async function getPostsByCategory(categoryId: string): Promise<Post[]> {
  try {
    const posts: Post[] = (await sql`
      SELECT * FROM posts
      WHERE category_id = ${categoryId}
      ORDER BY created_at DESC
    `) as unknown as Post[];
    return posts;
  } catch (error) {
    console.error("Error fetching posts by category:", error);
    throw new Error("Failed to fetch posts by category");
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

    const slug = createSlug(json.name);

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

    const category = await sql`
      SELECT id FROM categories WHERE id = ${id}
    `;
    if (category.length === 0) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    await deleteCategory(id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
