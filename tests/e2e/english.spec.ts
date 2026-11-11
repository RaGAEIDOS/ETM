import { test, expect } from "@playwright/test";
import { seedMikuDone } from "./helpers/ui";

const COURSE_EN = ["English from Zero", "Grammar", "Phonetics", "Listening", "Conversation"];

test.describe("English section (Phase 4)", () => {
  test("nav shows الإنجليزية on the Arabic locale and English on /en", async ({ page }) => {
    seedMikuDone(page);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(
      page.locator('header a[href="/english"]').first(),
      "Arabic header must link to /english with the label الإنجليزية"
    ).toContainText("الإنجليزية");

    await page.goto("/en", { waitUntil: "domcontentloaded" });
    await expect(
      page.locator('header a[href="/en/english"]').first(),
      "English header must link to /en/english with the label English"
    ).toContainText("English");
  });

  test("/en/english hub renders courses, suggested path, sync notice and credit", async ({ page }) => {
    seedMikuDone(page);
    await page.goto("/en/english", { waitUntil: "domcontentloaded" });

    for (const course of COURSE_EN) {
      await expect(page.getByText(course, { exact: true }).first()).toBeVisible();
    }

    // Suggested path section (channel's own ordering)
    await expect(page.getByRole("heading", { name: /Suggested path/i })).toBeVisible();

    // Videos have not been imported yet in this environment — the sync notice shows.
    await expect(page.getByText(/syncing the videos/i)).toBeVisible();

    // Course cards link to the known channel playlists.
    await expect(
      page.locator('a[href*="PLp22-4PivYmIFAnru_L7fnMhSV5YffLTZ"]').first()
    ).toBeVisible();

    // 4.7 credit, present on every English page
    await expect(page.getByText(/zAmericanEnglish on YouTube/).first()).toBeVisible();

    // Footer links to the section as well
    await expect(page.locator('footer a[href="/en/english"]').first()).toBeVisible();
  });

  test("/english hub (Arabic locale) renders Arabic labels and credit", async ({ page }) => {
    seedMikuDone(page);
    await page.goto("/english", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /قسم الإنجليزية/ })).toBeVisible();
    await expect(page.getByText(/يتم الآن مزامنة/)).toBeVisible();
    await expect(page.getByText(/zAmericanEnglish on YouTube/).first()).toBeVisible();
  });

  test("/en/english/review renders the empty state when nothing is due", async ({ page }) => {
    seedMikuDone(page);
    await page.goto("/en/english/review", { waitUntil: "domcontentloaded" });
    await expect(page.getByText(/No terms due today/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /Back to the English section/i })).toBeVisible();
  });
});
