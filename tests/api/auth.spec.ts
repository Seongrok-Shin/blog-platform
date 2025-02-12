import { test, expect } from "@playwright/test";
const validUser = {
  email: process.env.TEST_USER_EMAIL!,
  password: process.env.TEST_USER_PASSWORD!,
};
test.describe("Authentication", () => {
  test.beforeEach(async ({ page }) => {
    // Set viewport to a desktop resolution for consistency
    await page.setViewportSize({ width: 1280, height: 720 });
  });
  test("should sign in successfully with valid credentials", async ({
    page,
  }) => {
    // Navigate to the login page
    await page.goto("/login");
    // Fill in login credentials
    await page.fill('input[name="email"]', validUser.email);
    await page.fill('input[name="password"]', validUser.password);
    // Submit the login form
    await page.click('button[type="submit"]');
    await page.waitForURL("/");
    // Navigate to the profile page
    await page.goto("/profile");
    await page.waitForLoadState("networkidle");
  });
  test("should display error for invalid credentials", async ({ page }) => {
    // Navigate to the login page
    await page.goto("/login");
    // Fill in login credentials with an incorrect password
    await page.fill('input[name="email"]', validUser.email);
    await page.fill('input[name="password"]', "wrongpassword");
    // Submit the login form
    await page.click('button[type="submit"]');
    // Expect that an error message is displayed.
    // The login page renders an error message in a div with red text if authentication fails.
    await expect(page.getByText("Incorrect password")).toBeVisible({
      timeout: 15000,
    });
  });
});
