import { test, expect } from "@playwright/test";

const THEMES = ["dark", "light", "terminal", "cozy"] as const;

test.describe("site logo", () => {
  for (const theme of THEMES) {
    test(`header logo is visible and loaded in the ${theme} theme`, async ({ page }) => {
      await page.addInitScript((value) => {
        window.localStorage.setItem("etm-theme-v2", value);
      }, theme);

      await page.goto("/", { waitUntil: "domcontentloaded" });
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);

      const logo = page.locator("header .site-logo img:visible").first();
      await expect(logo).toBeVisible();
      await expect
        .poll(() => logo.evaluate((img) => (img as HTMLImageElement).naturalWidth))
        .toBeGreaterThan(0);

      // A visible logo must be within the header, not overflow the viewport.
      const headerBox = await page.locator("header").first().boundingBox();
      const logoBox = await logo.boundingBox();
      expect(headerBox).not.toBeNull();
      expect(logoBox).not.toBeNull();
      expect(logoBox!.width).toBeGreaterThan(40);
      expect(logoBox!.height).toBeGreaterThan(24);
      expect(logoBox!.x).toBeGreaterThanOrEqual(headerBox!.x - 1);
      expect(logoBox!.x + logoBox!.width).toBeLessThanOrEqual(
        headerBox!.x + headerBox!.width + 1
      );
    });
  }
});
