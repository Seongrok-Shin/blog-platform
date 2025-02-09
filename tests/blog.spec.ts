import { test, expect } from "@playwright/test";

// Test suite for the Blog Page
test.describe("Blog Page", () => {
  test.beforeEach(async ({ page }) => {
    // navigate to the blog page
    await page.goto("/blog");
  });

  test("should display blog header and sample posts", async ({ page }) => {
    // Check the main blog header
    await expect(
      page.getByRole("heading", { name: "Latest Posts" }),
    ).toBeVisible();

    // Check for the blog description text
    await expect(page.getByText(/Discover the latest insights/)).toBeVisible();

    // Verify that the sample posts are rendered
    const posts = [
      "Getting Started with Next.js",
      "Building a Blog Platform",
      "Styling with Tailwind CSS",
    ];

    for (const postTitle of posts) {
      // Each post's title should be rendered as a link
      await expect(page.getByRole("link", { name: postTitle })).toBeVisible();
    }
  });
});
