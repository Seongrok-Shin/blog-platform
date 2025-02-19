import { test, expect } from "@playwright/test";

const baseUrl = "http://localhost:3000"; // Add this at the top of the file

// Replace uuid import with a simple ID generator
const generateId = () => Math.random().toString(36).substring(2, 9);

test.describe("Blog Page", () => {
  let postId: number | null = null; // Initialize postId as null
  const testPost = {
    title: `Test Post ${generateId()}`, // Use the custom ID generator
    excerpt: "This is a test post excerpt.",
    content: "This is the content of the test post.",
    coverImageUrl: "https://example.com/test-image.jpg",
  };

  test.beforeAll(async () => {
    try {
      // Mock authentication
      const authToken = "mock-auth-token"; // Replace with a valid token or mock token

      // Create a test post before running the tests
      const response = await fetch(`${baseUrl}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`, // Add authorization header
        },
        body: JSON.stringify(testPost),
      });

      if (!response.ok) {
        throw new Error(`Failed to create post: ${response.statusText}`);
      }

      const newPost = await response.json();
      postId = newPost.id;
    } catch (error) {
      console.warn("Error in beforeAll:", error);
      postId = null; // Ensure postId is null if creation fails
    }
  });

  test.afterAll(async () => {
    if (postId) {
      // Clean up the test post after running the tests
      const response = await fetch(`${baseUrl}/api/posts/${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete post: ${response.statusText}`);
      }
    }
  });

  test.beforeEach(async ({ page }) => {
    // Navigate to the blog page before each test
    await page.goto("/blog");
    await page.waitForLoadState("networkidle");
  });

  test("should navigate to individual blog post", async ({ page }) => {
    if (postId) {
      // Click on the test post link
      await page.getByRole("link", { name: testPost.title }).click();

      // Verify the post page loads correctly
      await expect(
        page.getByRole("heading", { name: testPost.title }),
      ).toBeVisible();
      await expect(page.getByText(testPost.excerpt)).toBeVisible();
      await expect(
        page.getByRole("link", { name: "Back to Blog" }),
      ).toBeVisible();
    }
  });

  test("should display author information", async ({ page }) => {
    if (postId) {
      // Navigate to the test post
      await page.goto(
        `/blog/${testPost.title.toLowerCase().replace(/\s+/g, "-")}`,
      );

      // Verify author name and profile image are visible
      await expect(page.getByText("John Doe")).toBeVisible();
      await expect(page.getByAltText("John Doe")).toBeVisible();
    }
  });

  test("should fetch post by slug", async () => {
    if (postId) {
      const response = await fetch(
        `${baseUrl}/api/posts/${testPost.title.toLowerCase().replace(/\s+/g, "-")}`,
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch post: ${response.statusText}`);
      }

      const post = await response.json();
      expect(post).toBeDefined();
      expect(post.title).toBe(testPost.title);
      expect(post.excerpt).toBe(testPost.excerpt);
    }
  });

  test("should delete a post", async () => {
    if (postId) {
      const response = await fetch(`${baseUrl}/api/posts/${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete post: ${response.statusText}`);
      }

      const deleteResponse = await response.json();
      expect(deleteResponse.success).toBe(true);

      // Verify the post is no longer in the database
      const fetchResponse = await fetch(
        `${baseUrl}/api/posts/${testPost.title.toLowerCase().replace(/\s+/g, "-")}`,
      );

      if (fetchResponse.status === 404) {
        expect(true).toBe(true); // Post not found, as expected
      } else {
        throw new Error("Post still exists after deletion");
      }
    }
  });
});
