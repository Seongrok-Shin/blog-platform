import { test, expect } from "@playwright/test";

test.describe("Search Functionality", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector('[placeholder="Search posts..."]'); // Wait for search bar to load
  });

  test("should search for posts by All", async ({ page }) => {
    // Enter a search query in the search bar
    const searchInput = page.getByPlaceholder("Search posts...");
    await searchInput.waitFor(); // Ensure the input is visible
    await searchInput.fill("aws");

    // Click the search button
    const searchButton = page.getByRole("button", { name: "Search" });
    await searchButton.click();

    // Verify the search results page
    await expect(page).toHaveURL(/\/search\?query=aws/);
    const searchResultsTitle = page
      .getByTestId("search-results-title")
      .filter({ hasText: "Search Results for `aws`" });
    await expect(searchResultsTitle).toBeVisible();
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
    const searchResultsTitle = page
      .getByTestId("search-results-title")
      .filter({ hasText: "Search Results for `invalidquery123`" });
    await expect(searchResultsTitle).toBeVisible();
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
    const searchResultsTitle = page.getByTestId("search-results-title");
    await expect(searchResultsTitle).toBeVisible();
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
    const searchResultsTitle = page
      .getByTestId("search-results-title")
      .filter({ hasText: "Search Results for `test3`" });
    await expect(searchResultsTitle).toBeVisible();
  });
});
