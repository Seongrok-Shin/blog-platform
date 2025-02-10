import { test, expect } from "@playwright/test";

test.describe("Profile Page", () => {
  test("should prompt for sign in when not authenticated", async ({ page }) => {
    await page.goto("/profile");
    await expect(page.getByText("You are not logged in.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
  });
});
