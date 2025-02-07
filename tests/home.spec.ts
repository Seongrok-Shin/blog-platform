import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display welcome message and getting started section", async ({
    page,
  }) => {
    // Check main heading
    await expect(
      page.getByRole("heading", { name: "Welcome to Blog Platform" })
    ).toBeVisible();

    // Check description text
    await expect(
      page.getByText("A modern platform for sharing your thoughts")
    ).toBeVisible();

    // Check Getting Started section
    await expect(
      page.getByRole("heading", { name: "Getting Started" })
    ).toBeVisible();
  });

  test("should have correct metadata", async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle("Blog Platform");
  });
});
