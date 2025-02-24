import sql from "@/lib/db";
import slugify from "slugify";
import { Post } from "@/types/blog";
import { Tag, UpdateTagInput } from "@/types/tag";
import { revalidatePath } from "next/cache";

export async function createSlug(name: string) {
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

export async function createTag(name: string) {
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
