import { test, expect } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";
import { waitHydrated } from "./helpers/ui";

const PAGES = [
  ["home", "/"],
  ["curriculum", "/curriculum"],
  ["lesson", "/learn/stage-1/cpp-basics/hello-world"],
  ["elzero-index", "/elzero"],
  ["elzero-video", "/elzero/001"],
  ["english-index", "/english"],
  ["english-course", "/english/course/en-zero"],
  ["english-review", "/english/review"],
  ["cs50x-index", "/cs50x"],
  ["cs50x-lecture", "/cs50x/intro"],
  ["cs50x-review", "/cs50x/review"],
  ["leaderboard", "/leaderboard"],
  ["playground", "/playground"],
  ["books", "/books"],
  ["dashboard", "/dashboard"],
  ["glossary", "/glossary"],
] as const;

for (const [name, route] of PAGES) {
  test(`axe: ${name} has no critical violations`, async ({ page }) => {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await waitHydrated(page);
    const results = await new AxeBuilder({ page }).analyze();
    const critical = results.violations.filter((v) => v.impact === "critical" || v.impact === "serious");
    const criticalList = critical.map((v) => `${v.id} (${v.impact}): ${v.nodes.length} node(s)`);
    expect(criticalList, `critical axe violations on ${route}`).toEqual([]);
  });
}
