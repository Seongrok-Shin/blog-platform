import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test.describe("Desktop", () => {
    test.beforeEach(async ({ page }) => {
      // Set viewport to desktop size
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto("/");
    });

    test("should display logo and navigation links", async ({ page }) => {
      // Check logo
      await expect(
        page.getByRole("link", { name: "Blog Platform", exact: true }),
      ).toBeVisible();

      // Check navigation links
      const expectedLinks = ["Home", "Blog", "About", "Contact"];
      for (const link of expectedLinks) {
        await expect(
          page.getByRole("link", { name: link, exact: true }),
        ).toBeVisible();
      }
    });

    test("should highlight active link", async ({ page }) => {
      // Check home link is active on homepage
      const homeLink = page.getByRole("link", { name: "Home", exact: true });
      await expect(homeLink).toHaveClass(/border-primary.*text-gray-900/);

      // Navigate to blog
      const blogLink = page.getByRole("link", { name: "Blog", exact: true });
      await blogLink.click();

      // Wait for navigation to complete
      await page.waitForURL("**/blog");
      await expect(page.url()).toContain("/blog");

      // Get fresh reference to blog link and check active state
      const updatedBlogLink = page.getByRole("link", {
        name: "Blog",
        exact: true,
      });
      await expect(updatedBlogLink).toHaveClass(
        /border-primary.*text-gray-900/,
      );
    });

    test("should display auth buttons", async ({ page }) => {
      await expect(
        page.getByRole("link", { name: "Log in", exact: true }),
      ).toBeVisible();
      await expect(
        page.getByRole("link", { name: "Sign up", exact: true }),
      ).toBeVisible();
    });
  });

  test.describe("Mobile", () => {
    test.beforeEach(async ({ page }) => {
      // Set viewport to mobile size
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/");
    });

    test("should show mobile menu button and hide desktop navigation", async ({
      page,
    }) => {
      // Mobile menu button should be visible
      await expect(
        page.getByRole("button", { name: "Open main menu", exact: true }),
      ).toBeVisible();

      // Desktop navigation should be hidden
      const desktopNav = page.locator(".sm\\:flex").first();
      await expect(desktopNav).toBeHidden();
    });

    test("should toggle mobile menu on button click", async ({ page }) => {
      // Initially sidebar should be hidden
      await expect(page.locator(".fixed.inset-y-0.left-0")).toBeHidden();

      // Click menu button
      const menuButton = page.getByRole("button", {
        name: "Open main menu",
        exact: true,
      });
      await menuButton.click();
      await page.waitForTimeout(100); // Wait for animation

      // Sidebar and backdrop should be visible
      await expect(page.locator(".fixed.inset-y-0.left-0")).toBeVisible();
      await expect(page.locator(".fixed.inset-0.bg-black\\/20")).toBeVisible();

      const expectedLinks = [
        "Home",
        "Blog",
        "About",
        "Contact",
        "Log in",
        "Sign up",
      ];
      for (const link of expectedLinks) {
        await expect(
          page.getByRole("link", { name: link, exact: true }),
        ).toBeVisible();
      }

      // Click close button to close
      const closeButton = page.getByRole("button", {
        name: "Close menu",
        exact: true,
      });
      await closeButton.click();
      await page.waitForTimeout(100); // Wait for animation
      await expect(page.locator(".fixed.inset-y-0.left-0")).toBeHidden();
    });

    test("should navigate and close menu on link click", async ({ page }) => {
      // Open menu and click a link
      const menuButton = page.getByRole("button", {
        name: "Open main menu",
        exact: true,
      });
      await menuButton.click();
      await page.waitForTimeout(100); // Wait for animation

      // Click blog link and wait for navigation
      const blogLink = page.getByRole("link", { name: "Blog", exact: true });
      await Promise.all([page.waitForNavigation(), blogLink.click()]);

      // Should navigate to blog page
      await expect(page.url()).toContain("/blog");
      // Sidebar should be closed
      await expect(page.locator(".fixed.inset-y-0.left-0")).toBeHidden();
    });
  });
});
