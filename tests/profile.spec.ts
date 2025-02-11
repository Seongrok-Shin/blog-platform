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
    await page.click('button[type="submit"]');
    // Wait for sign in to complete by checking presence of the Profile link in navbar
    await expect(page.getByRole("link", { name: "Profile" })).toBeVisible({
      timeout: 15000,
    });

    // Navigate to profile page
    await page.goto("/profile");
    // Verify profile page is displayed by checking the heading with text 'Profile'
    await expect(page.getByRole("heading", { name: "Profile" })).toBeVisible();

    // Click the 'Sign Out' button
    await page.locator("button", { hasText: "Sign Out" }).click();
    // Wait for sign out to complete by waiting for the Log In button to appear
    await expect(page.getByRole("link", { name: /log in/i })).toBeVisible({
      timeout: 15000,
    });

    // Optionally, verify that the home page is displayed by checking for a welcome heading
    await expect(
      page.getByRole("heading", { name: /Welcome to Blog Platform/ }),
    ).toBeVisible({ timeout: 15000 });
  });
});
