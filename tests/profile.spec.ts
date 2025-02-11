import { test, expect } from "@playwright/test";

test.describe("Profile Page", () => {
  test("should prompt for sign in when not authenticated", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    try {
      await page.goto("/profile");
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      if (
        !(
          errMsg.includes("NS_BINDING_ABORTED") ||
          errMsg.includes("interrupted by another navigation")
        )
      ) {
        throw error;
      }
    }
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
    // Wait for successful sign in by checking that the 'Profile' link appears
    await expect(page.getByRole("link", { name: "Profile" })).toBeVisible({
      timeout: 15000,
    });

    // Navigate to profile page
    try {
      await page.goto("/profile");
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      if (
        !(
          errMsg.includes("NS_BINDING_ABORTED") ||
          errMsg.includes("interrupted by another navigation")
        )
      ) {
        throw error;
      }
    }
    await page.waitForLoadState("networkidle");

    // Click the 'Sign Out' button
    const signOutButton = page.locator("button", { hasText: "Sign Out" });
    await expect(signOutButton).toBeVisible({ timeout: 15000 });
    await signOutButton.scrollIntoViewIfNeeded();
    await signOutButton.click({ force: true });
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
