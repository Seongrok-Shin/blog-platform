import { test, expect } from "@playwright/test";

test.describe("Search Functionality", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/blog");
    await page.waitForSelector('[placeholder="Search posts..."]'); // Wait for search bar to load
  });

  test("should search for posts by title", async ({ page }) => {
    // Enter a search query in the search bar
    const searchInput = page.getByPlaceholder("Search posts...");
    await searchInput.waitFor(); // Ensure the input is visible
    await searchInput.fill("aws");

    // Click the search button
    const searchButton = page.getByRole("button", { name: "Search" });
    await searchButton.click();

    // Verify the search results page
    await expect(page).toHaveURL(/\/search\?query=aws/);
    await expect(
      page.getByRole("heading", { name: "Search Results for `aws`" }),
    ).toBeVisible();
  });

  test("should display no results for invalid query", async ({ page }) => {
    // Enter an invalid search query
    const searchInput = page.getByPlaceholder("Search posts...");
    await searchInput.fill("invalidquery123");

    // Click the search button
    const searchButton = page.getByRole("button", { name: "Search" });
    await searchButton.click();

    // Verify the search results page
    await expect(page).toHaveURL(/\/search\?query=invalidquery123/);
    await expect(
      page.getByText("No posts found matching your search."),
    ).toBeVisible();
  });

  test("should filter search results by title", async ({ page }) => {
    // Enter a search query
    const searchInput = page.getByPlaceholder("Search posts...");
    await searchInput.fill("aws");

    // Select the "Title" filter
    const filterSelect = page.getByRole("combobox");
    await filterSelect.selectOption("title");

    // Click the search button
    const searchButton = page.getByRole("button", { name: "Search" });
    await searchButton.click();

    // Verify the search results page
    await expect(page).toHaveURL(/\/search\?query=aws&filter=title/);
    await expect(
      page.getByRole("heading", { name: "Search Results for `aws`" }),
    ).toBeVisible();
  });

  test("should filter search results by writer", async ({ page }) => {
    // Enter a search query
    const searchInput = page.getByPlaceholder("Search posts...");
    await searchInput.fill("test3");

    // Select the "Writer" filter
    const filterSelect = page.getByRole("combobox");
    await filterSelect.selectOption("writer");

    // Click the search button
    const searchButton = page.getByRole("button", { name: "Search" });
    await searchButton.click();

    // Verify the search results page
    await expect(page).toHaveURL(/\/search\?query=test3&filter=writer/);
    await expect(
      page.getByRole("heading", { name: "Search Results for `test3`" }),
    ).toBeVisible();
  });
});
