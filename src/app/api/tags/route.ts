"use server";

import sql from "@/lib/db";
import { Tag, UpdateTagInput } from "@/types/tag";
import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { NextResponse } from "next/server";
import { Post } from "@/types/blog";

function createSlug(name: string) {
  return slugify(name, { lower: true, strict: true });
}

export async function getTags(): Promise<Tag[]> {
  try {
    const tags: Tag[] = (await sql`
      SELECT * FROM tags 
      ORDER BY created_at DESC
    `) as unknown as Tag[];
    return tags;
  } catch (error) {
    console.error("Error fetching tags:", error);
    throw new Error("Failed to fetch tags");
  }
}

export async function getTagBySlug(slug: string): Promise<Tag | null> {
  try {
    const tagResult = (await sql`
      SELECT * FROM tags
      WHERE slug = ${slug}
    `) as unknown as Tag[];

    return tagResult[0] || null;
  } catch (error) {
    console.error("Error fetching tag:", error);
    throw new Error("Failed to fetch tag");
  }
}

async function createTag(name: string) {
  try {
    const slug = createSlug(name);
    const result = (await sql`
      INSERT INTO tags (name, slug)
      VALUES (${name}, ${slug})
      RETURNING id, name, slug, created_at`) as unknown as Tag[];

    return result[0];
  } catch (error) {
    console.error("Error creating tag:", error);
    throw new Error("Failed to create tag");
  }
}

export async function updateTag(id: string, input: UpdateTagInput) {
  try {
    const slug = input.name ? slugify(input.name, { lower: true }) : undefined;

    const result = (await sql`
      UPDATE tags 
      SET 
        name = COALESCE(${input.name}, name), 
        slug = COALESCE(${slug}, slug),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `) as unknown as Tag[];

    revalidatePath("/admin/tags");
    revalidatePath("/blog");

    return result[0] || null;
  } catch (error) {
    console.error("Error updating tag:", error);
    throw new Error("Failed to update tag");
  }
}

export async function deleteTag(id: string) {
  try {
    await sql`
      DELETE FROM tags 
      WHERE id = ${id}
    `;

    revalidatePath("/admin/tags");
    revalidatePath("/blog");
  } catch (error) {
    console.error("Error deleting tag:", error);
    throw new Error("Failed to delete tag");
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const tag = await getTagBySlug(slug);
      if (!tag) {
        return NextResponse.json({ error: "Tag not found" }, { status: 404 });
      }
      return NextResponse.json(tag);
    }

    const tags = await getTags();
    return NextResponse.json(tags);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function getPostsByTags(tagIds: string[]): Promise<Post[]> {
  try {
    // SQL query to fetch posts based on the tag_ids
    const posts: Post[] = (await sql`
      SELECT * FROM posts
      WHERE tag_ids @> ARRAY[${tagIds}]::uuid[]  -- Ensure tag_ids is an array of UUIDs
      ORDER BY created_at DESC
    `) as unknown as Post[];
    return posts;
  } catch (error) {
    console.error("Error fetching posts by tags:", error);
    throw new Error("Failed to fetch posts by tags");
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

    // Check if the tag already exists
    const existingTag = await getTagBySlug(slug);
    if (existingTag) {
      return NextResponse.json(
        { error: "Tag with this name already exists" },
        { status: 409 }, // 409 Conflict
      );
    }

    const tag = await createTag(json.name);
    revalidatePath("/admin/tags");
    revalidatePath("/blog");

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
      // Ensure id is a valid number
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

    const updatedTag = await updateTag(id, json as UpdateTagInput);
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

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: "Valid ID is required" },
        { status: 400 },
      );
    }

    // Check if tag exists before deleting
    const tag = (await sql`
      SELECT id FROM tags WHERE id = ${id}
    `) as unknown as Tag[];

    if (tag.length === 0) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    await deleteTag(id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting tag:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
