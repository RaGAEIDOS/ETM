import { test, expect } from "@playwright/test";

test.describe("SEO and sharing", () => {
  const PAGES = [
    ["/en", "ETM"],
    ["/en/books", "Free Books"],
    ["/en/elzero", "ElZero"],
    ["/en/glossary", "Glossary"],
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

  test("logo metadata, favicon and manifest resolve", async ({ page, request }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const ogImage = await page
      .locator('meta[property="og:image"]')
      .getAttribute("content");
    expect(ogImage, "og:image").toContain("/mascot/logo_full.png");
    expect(ogImage, "og:image is absolute").toMatch(/^https?:\/\//);
    const twitterImage = await page
      .locator('meta[name="twitter:image"]')
      .getAttribute("content");
    expect(twitterImage, "twitter:image").toBe(ogImage);

    const iconHrefs = await page
      .locator('link[rel="icon"]')
      .evaluateAll((links) => links.map((link) => link.getAttribute("href") ?? ""));
    expect(iconHrefs.length, "icon links").toBeGreaterThan(0);
    expect(iconHrefs.some((href) => href.startsWith("/icons/"))).toBe(true);
    expect(iconHrefs.some((href) => href === "/favicon.ico")).toBe(true);

    const iconUrl = new URL(iconHrefs[0], page.url()).toString();
    const iconResponse = await request.get(iconUrl);
    expect(iconResponse.status(), iconUrl).toBe(200);
    expect(iconResponse.headers()["content-type"]).toMatch(/svg|png|icon/);

    const appleHref = await page
      .locator('link[rel="apple-touch-icon"]')
      .getAttribute("href");
    expect(appleHref, "apple-touch-icon").toBe("/icons/apple-touch-icon.png");
    expect((await request.get(appleHref!)).status()).toBe(200);

    const icoResponse = await request.get("/favicon.ico");
    expect(icoResponse.status(), "/favicon.ico").toBe(200);
    expect(icoResponse.headers()["content-type"]).toBe("image/x-icon");

    const manifestHref = await page
      .locator('link[rel="manifest"]')
      .getAttribute("href");
    expect(manifestHref, "manifest href").toBe("/manifest.webmanifest");
    const manifestResponse = await request.get("/manifest.webmanifest");
    expect(manifestResponse.status()).toBe(200);
    const manifest = await manifestResponse.json();
    expect(manifest.name).toBe("ETM");
    expect(manifest.short_name).toBe("ETM");
    expect(manifest.icons?.length).toBeGreaterThan(0);
    const manifestSizes = manifest.icons.map((icon: { sizes: string }) => icon.sizes);
    expect(manifestSizes).toEqual(
      expect.arrayContaining(["192x192", "512x512"])
    );
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
