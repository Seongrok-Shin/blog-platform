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
    await page.goto("/login", { waitUntil: "domcontentloaded" });

    // Fill in login credentials
    await page.getByLabel("Email").fill(validUser.email);
    await page.getByLabel("Password").fill(validUser.password);

    // Submit the login form and wait for navigation
    await Promise.all([
      page.waitForURL("/", { timeout: 60000 }), // Wait for navigation to the home page
      page.click('button[type="submit"]'), // Click the submit button
    ]);

    // Navigate to the profile page
    await page.goto("/profile", { waitUntil: "load" });
  });

  test("should display error for invalid credentials", async ({ page }) => {
    // Navigate to the login page
    await page.goto("/login", { waitUntil: "domcontentloaded" });

    // Fill in login credentials with an incorrect password
    await page.getByLabel("Email").fill(validUser.email);
    await page.getByLabel("Password").fill("wrongpassword");

    // Submit the login form
    await page.click('button[type="submit"]');

    // Expect that an error message is displayed
    await expect(page.getByText("Incorrect password")).toBeVisible({
      timeout: 60000,
    });
  });
});
