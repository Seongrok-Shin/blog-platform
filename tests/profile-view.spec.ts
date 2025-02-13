// profile-view.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Profile Page View", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test("should prompt for login when not authenticated", async ({ page }) => {
    await page.goto("/profile", { waitUntil: "networkidle" });
    await expect(page.getByText("You are not logged in.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Log In" })).toBeVisible();
  });

  test("should display profile information when authenticated", async ({ page }) => {
    await page.goto("/login", { waitUntil: "networkidle" });
    await page.fill('input[name="email"]', process.env.TEST_USER_EMAIL!);
    await page.fill('input[name="password"]', process.env.TEST_USER_PASSWORD!);
    
    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle" }),
      page.click('button[type="submit"]')
    ]);

    await page.goto("/profile", { waitUntil: "networkidle" });

    await expect(page.getByRole("heading", { name: "Profile" })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(process.env.TEST_USER_EMAIL!)).toBeVisible();
  });

  test("should display default profile image when no image is set", async ({ page }) => {
    await page.goto("/login", { waitUntil: "networkidle" });
    await page.fill('input[name="email"]', process.env.TEST_USER_EMAIL!);
    await page.fill('input[name="password"]', process.env.TEST_USER_PASSWORD!);
    
    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle" }),
      page.click('button[type="submit"]')
    ]);

    await page.goto("/profile", { waitUntil: "networkidle" });

    const profileImage = page.getByAltText("Profile Image").first();
    await expect(profileImage).toBeVisible();
    const imageSrc = await profileImage.getAttribute("src");
    expect(imageSrc).toContain("/profile/profile-default.svg");
  });
});
