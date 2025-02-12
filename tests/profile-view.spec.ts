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
    await page.waitForURL("/");

    // Wait for successful sign in by checking the 'Profile' link appears
    await page.goto("/profile");
    await page.waitForLoadState("networkidle");

    // Verify that the user's email is displayed (assuming the email is shown on profile)
    await expect(page.getByText(process.env.TEST_USER_EMAIL!)).toBeVisible();

    // Verify that a profile image is present with alt text 'Profile Image'
    await expect(page.getByAltText("Profile Image")).toBeVisible();
  });

  test("should display default profile image when no image is set", async ({
    page,
  }) => {
    // Sign in using credentials from environment variables
    await page.goto("/login");
    await page.fill('input[name="email"]', process.env.TEST_USER_EMAIL!);
    await page.fill('input[name="password"]', process.env.TEST_USER_PASSWORD!);
    await page.click('button[type="submit"]');
    await page.waitForURL("/");

    // Wait for successful sign in by ensuring the 'Profile' link exists
    await page.goto("/profile");
    await page.waitForLoadState("networkidle");
    // Get the profile image element and verify that it uses the default image
    const profileImage = await page.getByAltText("Profile Image").first();
    const imageSrc = await profileImage.getAttribute("src");
    expect(imageSrc).toContain("/profile/profile-default.svg");
  });
});
