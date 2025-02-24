import sql from "@/lib/db";
import slugify from "slugify";
import { Tag, UpdateTagInput } from "@/types/tag";
import { revalidatePath } from "next/cache";
import { Post } from "@/types/blog";

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

export async function getPostsByTags(tagName: string): Promise<Post[]> {
  try {
    // Find the tag ID based on the tag name
    const tag = (await sql`
      SELECT id FROM tags WHERE LOWER(name) = LOWER(${tagName})
    `) as unknown as { id: string }[];

    if (tag.length === 0) {
      return []; // No matching tag found
    }

    const tagId = tag[0].id;
    console.log("Tag ID fetched:", tagId); // Log the tag ID

    // Fetch posts where tag_ids array contains the selected tag ID
    const posts = (await sql`
      SELECT * FROM posts
      WHERE ${tagId} = ANY(tag_ids)
      ORDER BY created_at DESC
      LIMIT 6
    `) as unknown as Post[];

    console.log("Posts fetched:", posts); // Log the posts fetched
    return posts;
  } catch (error) {
    console.error("Error fetching posts by tag:", error);
    throw new Error("Failed to fetch posts by tag");
  }
}
