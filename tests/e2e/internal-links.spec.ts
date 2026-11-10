import { test, expect } from "@playwright/test";
import { seedMikuDone } from "./helpers/ui";

const EXTERNAL_URLS = [
  "https://github.com/RaGAEIDOS/ETM",
  "https://ossu.github.io/computer-science/",
  "https://github.com/ossu/computer-science",
  "https://cs50.harvard.edu/x/",
  "https://www.learncpp.com/",
  "https://www.nand2tetris.org/",
  "https://missing.csail.mit.edu/",
  "https://git-scm.com/doc",
  "https://git-scm.com/book/en/v2",
  "https://mindviewinc.github.io/ThinkCpp-Volume1/",
];

test.describe("Link integrity", () => {
  test("every internal link extracted from the main pages resolves", async ({ page, request }) => {
    seedMikuDone(page);
    const sources = ["/", "/curriculum", "/books", "/projects", "/glossary", "/guide"];
    const internal = new Set<string>();
    for (const route of sources) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      const hrefs = await page.locator("a[href^='/']").evaluateAll((els) => els.map((el) => el.getAttribute("href") ?? ""));
      for (const href of hrefs) {
        if (!href || href.startsWith("//")) continue;
        internal.add(href.split("#")[0]);
      }
    }

    expect(internal.size, "internal links collected").toBeGreaterThan(10);

    const failures: string[] = [];
    // Only the site's top-level load-bearing pages on first paint.
    for (const href of internal) {
      if (href.startsWith("/#")) continue;
      const res = await request.get(href, { timeout: 30_000, maxRedirects: 10 });
      const status = res.status();
      if (status >= 400) failures.push(`${href} -> ${status}`);
    }
    expect(failures, `broken internal links: ${failures.join(", ")}`).toEqual([]);
  });

  test("external links are reachable (best-effort, network-dependent)", async ({ request }) => {
    const bad: string[] = [];
    for (const url of EXTERNAL_URLS) {
      try {
        const res = await request.get(url, { timeout: 15_000, maxRedirects: 5 });
        if (res.status() >= 500) bad.push(`${url} -> ${res.status()}`);
      } catch {
        bad.push(`${url} -> unreachable (network)`);
      }
    }
    expect(bad, `external link failures: ${bad.join(", ")}`).toEqual([]);
  });

  test("404 page link to curriculum exists", async ({ page }) => {
    seedMikuDone(page);
    await page.goto("/definitely-not-a-page", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("link", { name: /curriculum|Curriculum/i }).first()).toBeVisible();
  });
});
