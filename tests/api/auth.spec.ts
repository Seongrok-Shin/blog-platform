// auth.spec.ts

import { test, expect } from "@playwright/test";

const validUser = {
  email: process.env.TEST_USER_EMAIL!,
  password: process.env.TEST_USER_PASSWORD!,
};

test.describe("Authentication", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test("should sign in successfully with valid credentials", async ({ page }) => {
    await page.goto("/login", { waitUntil: "networkidle" });

    await page.getByLabel("Email").fill(validUser.email);
    await page.getByLabel("Password").fill(validUser.password);
    
    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle" }),
      page.click('button[type="submit"]')
    ]);

    await expect(page.url()).toBe(page.url().split('/login')[0] + '/');

    await page.goto("/profile", { waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { name: "Profile" })).toBeVisible({ timeout: 10000 });
  });

  test("should display error for invalid credentials", async ({ page }) => {
    await page.goto("/login", { waitUntil: "networkidle" });

    await page.getByLabel("Email").fill(validUser.email);
    await page.getByLabel("Password").fill("wrongpassword");

    await page.click('button[type="submit"]');

    await expect(page.getByText(/incorrect password/i)).toBeVisible({ timeout: 10000 });
  });
});
