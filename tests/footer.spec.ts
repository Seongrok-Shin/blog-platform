import { test, expect } from "@playwright/test";

test.describe("Footer", () => {
  test.describe("Desktop", () => {
    test.beforeEach(async ({ page }) => {
      // Set viewport to desktop size
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto("/");
    });

    test("should display navigation links", async ({ page }) => {
      const footerNav = page.getByRole("navigation", { name: "Footer" });
      await expect(footerNav).toBeVisible();

      // Check navigation links
      const expectedLinks = ["Home", "Blog", "About", "Contact"];
      for (const link of expectedLinks) {
        const navLink = page.getByRole("link", { name: link }).last();
        await expect(navLink).toBeVisible();
        await expect(navLink).toHaveClass(/text-gray-600/);
      }
    });

    test("should have working social links with correct attributes", async ({
      page,
    }) => {
      // Check social links
      const socialLinks = [
        { name: "Browser", href: "https://markshin.me/" },
        {
          name: "GitHub",
          href: "https://github.com/Seongrok-Shin/blog-platform/",
        },
      ];

      for (const { name, href } of socialLinks) {
        const link = page.getByRole("link", { name });
        await expect(link).toBeVisible();
        await expect(link).toHaveAttribute("href", href);
        await expect(link).toHaveAttribute("target", "_blank");
        await expect(link).toHaveAttribute("rel", "noopener noreferrer");
      }
    });

    test("should display current year in copyright", async ({ page }) => {
      const currentYear = new Date().getFullYear().toString();
      const copyright = page.getByText(
        new RegExp(`©.*${currentYear}.*Blog Platform.*All rights reserved`),
      );
      await expect(copyright).toBeVisible();
    });

    test("should have proper styling classes", async ({ page }) => {
      const footer = page.locator("footer");
      await expect(footer).toHaveClass(/bg-white/);
      await expect(footer).toHaveClass(/bottom-0/);
      await expect(footer).toHaveClass(/w-full/);
    });
  });

  test.describe("Mobile", () => {
    test.beforeEach(async ({ page }) => {
      // Set viewport to mobile size
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/");
    });

    test("should display footer content in mobile view", async ({ page }) => {
      // Check if footer is visible
      const footer = page.locator("footer");
      await expect(footer).toBeVisible();

      // Check if navigation links are stacked vertically
      const footerNav = page.getByRole("navigation", { name: "Footer" });
      await expect(footerNav).toBeVisible();

      // Check social links visibility and spacing
      const socialLinks = page.locator(".mt-4.flex.space-x-6");
      await expect(socialLinks).toBeVisible();

      // Check copyright text alignment
      const copyright = page
        .locator("p")
        .filter({ hasText: /©.*Blog Platform/ });
      await expect(copyright).toHaveClass(/text-center/);
    });
  });
});
