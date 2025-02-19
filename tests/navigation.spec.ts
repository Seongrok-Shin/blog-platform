import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test.describe("Desktop", () => {
    test.beforeEach(async ({ page }) => {
      // Set viewport to desktop size
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto("/");
    });

    test("should display logo and navigation links", async ({ page }) => {
      // Get the main navigation
      const mainNav = page.locator("nav.border-b");

      // Check logo
      await expect(
        mainNav.getByRole("link", { name: "Blog Platform" }),
      ).toBeVisible();

      // Check navigation links in desktop menu
      const desktopNav = mainNav.locator(".sm\\:flex");
      const expectedLinks = ["Home", "Blog", "About", "Contact"];
      for (const link of expectedLinks) {
        await expect(
          desktopNav.getByRole("link", { name: link }),
        ).toBeVisible();
      }
    });

    test("should highlight active link", async ({ page }) => {
      // Get the desktop navigation
      const desktopNav = page.locator("nav.border-b .sm\\:flex");

      // Check home link is active on homepage
      const homeLink = desktopNav.getByRole("link", { name: "Home" });
      await expect(homeLink).toHaveClass(/border-primary.*text-gray-900/);

      // Navigate to blog
      const blogLink = desktopNav.getByRole("link", { name: "Blog" });
      await blogLink.click();

      // Wait for navigation to complete
      await page.waitForURL("**/blog");
      await expect(page.url()).toContain("/blog");

      // Get fresh reference to blog link and check active state
      const updatedBlogLink = desktopNav.getByRole("link", { name: "Blog" });
      await expect(updatedBlogLink).toHaveClass(
        /border-primary.*text-gray-900/,
      );
    });

    test("should display auth buttons", async ({ page }) => {
      const authSection = page.locator("nav.border-b .sm\\:items-center");
      await expect(
        authSection.getByRole("link", { name: "Log in" }),
      ).toBeVisible();
      await expect(
        authSection.getByRole("link", { name: "Sign up" }),
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
        page.getByRole("button", { name: "Open main menu" }),
      ).toBeVisible();

      // Desktop navigation should be hidden
      const desktopNav = page.locator("nav.border-b .sm\\:ml-10.sm\\:flex");
      await expect(desktopNav).toBeHidden();
    });

    test("should toggle mobile menu on button click", async ({ page }) => {
      // Initially sidebar should be hidden
      const sidebar = page.locator(".fixed.inset-y-0.left-0");
      await expect(sidebar).toBeHidden();

      // Click menu button
      const menuButton = page.getByRole("button", {
        name: "Open main menu",
      });
      await menuButton.click();
      await page.waitForTimeout(100); // Wait for animation

      // Sidebar and backdrop should be visible
      await expect(sidebar).toBeVisible();
      await expect(page.locator(".fixed.inset-0.bg-black\\/20")).toBeVisible();

      // Check mobile menu links
      const mobileNav = sidebar.locator("nav");
      const expectedLinks = [
        "Home",
        "Blog",
        "About",
        "Contact",
        "Log in",
        "Sign up",
      ];
      for (const link of expectedLinks) {
        await expect(mobileNav.getByRole("link", { name: link })).toBeVisible();
      }

      // Click close button to close
      const closeButton = page.getByRole("button", {
        name: "Close menu",
      });
      await closeButton.click();
      await page.waitForTimeout(100); // Wait for animation
      await expect(sidebar).toBeHidden();
    });

    test("should navigate and close menu on link click", async ({ page }) => {
      // Open menu and click a link
      const menuButton = page.getByRole("button", {
        name: "Open main menu",
      });
      await menuButton.click();
      await page.waitForTimeout(100); // Wait for animation

      // Get the mobile navigation
      const mobileNav = page.locator(".fixed.inset-y-0.left-0 nav");

      // Click blog link and wait for navigation
      const blogLink = mobileNav.getByRole("link", { name: "Blog" });
      await Promise.all([page.waitForNavigation(), blogLink.click()]);

      // Should navigate to blog page
      await expect(page.url()).toContain("/blog");
      // Sidebar should be closed
      await expect(page.locator(".fixed.inset-y-0.left-0")).toBeHidden();
    });
  });
});
