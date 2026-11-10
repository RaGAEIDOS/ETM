import { test, expect } from "@playwright/test";

test.describe("SEO and sharing", () => {
  const PAGES = [
    ["/", "ETM"],
    ["/books", "Free Books"],
    ["/elzero", "ElZero"],
    ["/glossary", "Glossary"],
  ] as const;

  for (const [route, needle] of PAGES) {
    test(`${route} has a descriptive title and meta description`, async ({ page }) => {
      const response = await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(response?.status()).toBeLessThan(400);
      const title = await page.title();
      expect(title).toMatch(new RegExp(needle, "i"));
      const desc = await page.locator('meta[name="description"]').getAttribute("content");
      expect(desc, "meta description").toBeTruthy();
      expect(desc!.length, "meta description length").toBeGreaterThan(30);
    });
  }

  test("Open Graph fields exist on the root layout", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const og = await page.locator('meta[property="og:title"]').getAttribute("content");
    expect(og, "og:title").toBeTruthy();
    const img = await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(img, "og:image").toBeTruthy();
  });

  test("robots.txt and sitemap.xml are served with the correct host", async ({ request }) => {
    const robots = await request.get("/robots.txt");
    expect(robots.status()).toBe(200);
    const robotsBody = await robots.text();
    expect(robotsBody).toContain("Sitemap");
    expect(robotsBody).toContain("etm-learning");

    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.status()).toBe(200);
    const body = await sitemap.text();
    expect(body).toContain("etm-learning");
    expect(body).not.toContain("etm.vercel.app");
  });
});
