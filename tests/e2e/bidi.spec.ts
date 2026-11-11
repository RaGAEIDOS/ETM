import { test, expect } from "@playwright/test";
import { instrument } from "./helpers/ui";

const NOISE = [/fonts\.g/i, /fonts\.gstatic/i, /font.*(load|css)/i, /gstatic/i];

// The /dev/bidi page exists to exercise bidirectional rendering in both
// locales; keep screenshots in docs/screenshots as a visual reference.
test.describe("BiDi rendering", () => {
  test("Arabic locale renders mixed-direction content", async ({ page }) => {
    const { consoleErrors } = instrument(page);
    const response = await page.goto("/dev/bidi", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBeLessThan(400);
    await expect(page.locator("h1")).toBeVisible();
    await page.screenshot({ path: "docs/screenshots/bidi-ar.png", fullPage: true });
    const errors = consoleErrors.filter((e) => !NOISE.some((n) => n.test(e)));
    expect(errors, `console errors: ${errors.join(" || ")}`).toEqual([]);
  });

  test("English locale renders mixed-direction content", async ({ page }) => {
    const { consoleErrors } = instrument(page);
    const response = await page.goto("/en/dev/bidi", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBeLessThan(400);
    await expect(page.locator("h1")).toBeVisible();
    await page.screenshot({ path: "docs/screenshots/bidi-en.png", fullPage: true });
    const errors = consoleErrors.filter((e) => !NOISE.some((n) => n.test(e)));
    expect(errors, `console errors: ${errors.join(" || ")}`).toEqual([]);
  });
});
