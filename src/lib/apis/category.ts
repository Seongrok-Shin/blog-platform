import sql from "@/lib/db";
import { Category, UpdateCategoryInput } from "@/types/category";
import slugify from "slugify";
import { Post } from "@/types/blog";

export async function createSlug(name: string) {
  return slugify(name, { lower: true, strict: true });
}

export async function getCategories(): Promise<Category[]> {
  return (await sql`
    SELECT * FROM categories 
    ORDER BY created_at DESC
  `) as unknown as Category[];
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  const categoryResult = (await sql`
    SELECT * FROM categories
    WHERE slug = ${slug}
  `) as unknown as Category[];
  return categoryResult[0] || null;
}

export async function createCategory(name: string) {
  const slug = createSlug(name);
  const result = await sql`
    INSERT INTO categories (name, slug)
    VALUES (${name}, ${slug})
    RETURNING id, name, slug, created_at
  `;
  return result[0];
}

export async function updateCategory(id: string, input: UpdateCategoryInput) {
  const slug = input.name ? createSlug(input.name) : undefined;
  const result = await sql`
    UPDATE categories 
    SET 
      name = COALESCE(${input.name}, name), 
      slug = COALESCE(${slug}, slug),
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return result[0] || null;
}

export async function deleteCategory(id: string) {
  await sql`
    DELETE FROM categories 
    WHERE id = ${id}
  `;
}

export async function getPostsByCategory(categoryId: string): Promise<Post[]> {
  return (await sql`
    SELECT * FROM posts
    WHERE category_id = ${categoryId}
    ORDER BY created_at DESC
  `) as unknown as Post[];
}
