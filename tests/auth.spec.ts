import { test, expect } from "@playwright/test";

const testUser = {
  name: "Test1",
  email: process.env.TEST_USER_EMAIL!,
  password: process.env.TEST_USER_PASSWORD!,
};

// Auth UI tests
test.describe("Authentication UI Flow", () => {
  test("should sign in and sign out successfully", async ({ page }) => {
    // Assuming the test user already exists, proceed directly with login
    // Navigate to login page and sign in
    await page.goto("/login");
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.click('button[type="submit"]');
    await expect(
      page.getByRole("heading", { name: /Welcome to Blog Platform/ }),
    ).toBeVisible({ timeout: 10000 });
    // Navigate to profile page
    await page.goto("/profile");
    // Verify profile page displays user info: check heading and user details
    await expect(page.getByRole("heading", { name: "Profile" })).toBeVisible();
    await expect(page.getByText(testUser.name)).toBeVisible();
    await expect(page.getByText(testUser.email)).toBeVisible();
    // Sign out using locator for button with hasText
    await page.locator("button", { hasText: "Sign Out" }).click();
    // Wait for navigation and reload the page to update session state
    await page.waitForLoadState("load");
    await page.reload();
  });
});
