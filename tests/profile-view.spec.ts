import { test, expect } from "@playwright/test";

// This test suite covers the profile page view for both authenticated and non-authenticated users.

test.describe("Profile Page View", () => {
  test.beforeEach(async ({ page }) => {
    // Set viewport to a desktop resolution
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test("should prompt for login when not authenticated", async ({ page }) => {
    await page.goto("/profile");
    // Verify that the page prompts for login
    await expect(page.getByText("You are not logged in.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Log In" })).toBeVisible();
  });

  test("should display profile information when authenticated", async ({
    page,
  }) => {
    // Sign in using credentials from environment variables
    await page.goto("/login");
    await page.fill('input[name="email"]', process.env.TEST_USER_EMAIL!);
    await page.fill('input[name="password"]', process.env.TEST_USER_PASSWORD!);
    await page.click('button[type="submit"]');

    // Wait for successful sign in by checking the 'Profile' link appears
    await expect(page.getByRole("link", { name: "Profile" })).toBeVisible({
      timeout: 30000,
    });

    // Navigate to the profile page
    await page.goto("/profile");
    await page.waitForLoadState("networkidle");

    // Verify that the profile page displays the heading 'Profile'
    await expect(page.getByRole("heading", { name: "Profile" })).toBeVisible({
      timeout: 30000,
    });

    // Verify that the user's email is displayed (assuming the email is shown on profile)
    await expect(page.getByText(process.env.TEST_USER_EMAIL!)).toBeVisible();

    // Verify that a profile image is present with alt text 'Profile Image'
    await expect(page.getByAltText("Profile Image")).toBeVisible();
  });
});
