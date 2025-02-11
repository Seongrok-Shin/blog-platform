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
    await page.waitForURL("/");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("link", { name: "Profile" })).toBeVisible({
      timeout: 15000,
    });
    // Navigate to profile page
    try {
      await page.goto("/profile");
    } catch (error) {
      if (
        !(
          error instanceof Error && error.message.includes("NS_BINDING_ABORTED")
        )
      ) {
        throw error;
      }
    }
    // Verify profile page displays user info: check heading and user details
    await expect(page.getByRole("heading", { name: "Profile" })).toBeVisible();
    await expect(page.getByText(testUser.name)).toBeVisible();
    await expect(page.getByText(testUser.email)).toBeVisible();
    // Sign out using locator for button with hasText
    await page.locator("button", { hasText: "Sign Out" }).click();
    await expect(page.getByRole("link", { name: /log in/i })).toBeVisible({
      timeout: 15000,
    });
  });
});
