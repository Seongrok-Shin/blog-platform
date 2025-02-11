import { test, expect } from "@playwright/test";

test.describe("Profile Page", () => {
  test("should prompt for sign in when not authenticated", async ({ page }) => {
    await page.goto("/profile");
    await expect(page.getByText("You are not logged in.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Log In" })).toBeVisible();
  });

  // New test case: Verify sign out redirects to home page
  test("should sign out and navigate to home when authenticated", async ({
    page,
  }) => {
    // Navigate to login page and sign in
    await page.goto("/login");
    await page.fill('input[name="email"]', process.env.TEST_USER_EMAIL!);
    await page.fill('input[name="password"]', process.env.TEST_USER_PASSWORD!);
    await Promise.all([
      page.waitForURL("/"),
      page.click('button[type="submit"]'),
    ]);

    // Navigate to profile page
    await page.goto("/profile");
    // Verify profile page is displayed by checking the heading with text 'Profile'
    await expect(page.getByRole("heading", { name: "Profile" })).toBeVisible();

    // Click the 'Sign Out' button
    await page.locator("button", { hasText: "Sign Out" }).click();
    // Wait for redirection to home page
    await page.waitForURL("/");

    // Verify that the home page is displayed (for example, check welcome heading)
    await expect(
      page.getByRole("heading", { name: /Welcome to Blog Platform/ }),
    ).toBeVisible();
  });
});
