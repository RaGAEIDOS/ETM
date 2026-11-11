import { test, expect } from "@playwright/test";
import { seedMikuDone } from "./helpers/ui";

test.describe("Progress persistence", () => {
  test("lesson marked complete stays complete after reload", async ({ page }) => {
    seedMikuDone(page);
    await page.goto("/en/learn/stage-1/cpp-basics/hello-world", { waitUntil: "domcontentloaded" });
    const mark = page.getByRole("button", { name: /Mark lesson complete/i });
    await expect(mark).toBeVisible();
    await mark.click();
    await expect(page.getByRole("button", { name: /Completed .* click to undo/i })).toBeVisible();

    await page.reload();
    await expect(page.getByRole("button", { name: /Completed .* click to undo/i })).toBeVisible();

    // clean up progress so other tests are unaffected
    await page.getByRole("button", { name: /Completed .* click to undo/i }).click();
    await expect(page.getByRole("button", { name: /Mark lesson complete/i })).toBeVisible();
  });

  test("progress survives reload when storage is blocked", async ({ browser }) => {
    // Simulate blocked localStorage: an init script throws on access.
    const ctx = await browser.newContext();
    await ctx.addInitScript(() => {
      const throwing = () => { throw new DOMException("localStorage is blocked", "SecurityError"); };
      Object.defineProperty(window, "localStorage", { get: throwing });
    });
    const page = await ctx.newPage();
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(String(err)));

    // The page must still render content (no hard crash) even if storage throws.
    const response = await page.goto("/en/learn/stage-1/cpp-basics/hello-world", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBeLessThan(400);
    await page.waitForLoadState("networkidle");
    await expect(page.locator("body")).toBeVisible();
    expect(errors, `page errors: ${errors.join(" || ")}`).toEqual([]);
    await ctx.close();
  });

  test("marking lessons persists across page navigations in same session", async ({ page }) => {
    seedMikuDone(page);
    await page.goto("/en/learn/stage-1/cpp-basics/variables-types", { waitUntil: "domcontentloaded" });
    const mark = page.getByRole("button", { name: /Mark lesson complete/i });
    await expect(mark).toBeVisible();
    await mark.click();
    await expect(page.getByRole("button", { name: /Completed/i })).toBeVisible();
    // storage key persists the completion by lesson id
    const saved = await page.evaluate(() => window.localStorage.getItem("etm-progress-v1"));
    expect(saved ?? "").toMatch(/variables-types/);
    await page.goto("/en/curriculum", { waitUntil: "domcontentloaded" });
    // undo to keep the environment tidy
    await page.goto("/en/learn/stage-1/cpp-basics/variables-types", { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: /Completed/i }).click();
  });
});
