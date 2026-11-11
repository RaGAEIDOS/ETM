import { test, expect } from "@playwright/test";

const SIZES: Array<{ width: number; height: number }> = [
  { width: 360, height: 800 },
  { width: 768, height: 1024 },
  { width: 1280, height: 900 },
];
const SAFE_ROUTES = ["/", "/curriculum", "/learn/stage-1/cpp-basics/hello-world", "/books", "/elzero", "/glossary", "/playground"];

for (const { width, height } of SIZES) {
  test.describe(`viewport ${width}x${height}`, () => {
    test.use({ viewport: { width, height } });

    for (const route of SAFE_ROUTES) {
      test(`${route} renders without horizontal scroll`, async ({ page }) => {
        await page.goto(route, { waitUntil: "domcontentloaded" });
        await page.waitForLoadState("networkidle");
        expect(await page.evaluate(() => document.documentElement.scrollWidth))
          .toBeLessThanOrEqual(width + 2);
      });
    }
  });
}

test("menu/mikusu buttons satisfy the 44px minimum on touch screens", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.setViewportSize({ width: 360, height: 800 });
  await page.waitForLoadState("networkidle");
  const ok = await page.evaluate(() => {
    const menus = Array.from(document.querySelectorAll('button[aria-label="Menu"], button[aria-label="Miku assistant"], button[aria-label="القائمة"], button[aria-label="مساعدة Miku"]'));
    return menus.every(
      (b) => b.getBoundingClientRect().width >= 44 && b.getBoundingClientRect().height >= 44
    );
  });
  expect(ok, "header buttons are ≥44×44").toBe(true);
});
