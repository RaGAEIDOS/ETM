import { test, expect } from "@playwright/test";
import { seedMikuDone } from "./helpers/ui";

const COURSE_EN = ["English from Zero", "Grammar", "Phonetics", "Listening", "Conversation"];

test.describe("English section (Phase 4)", () => {
  test("nav shows Courses dropdown with الإنجليزية (ar) and English (en)", async ({ page }) => {
    seedMikuDone(page);
    // NB: assert on /curriculum — `/` client-redirects guests to /landing (bare header)
    await page.goto("/curriculum", { waitUntil: "domcontentloaded" });
    // Courses live behind the "الدورات / Courses" dropdown — open it first.
    await page.locator("header button", { hasText: "الدورات" }).first().click();
    await expect(
      page.locator('header a[href="/english"]').first(),
      "Arabic header must link to /english with the label الإنجليزية"
    ).toContainText("الإنجليزية");

    await page.goto("/en/curriculum", { waitUntil: "domcontentloaded" });
    await page.locator("header button", { hasText: "Courses" }).first().click();
    await expect(
      page.locator('header a[href="/en/english"]').first(),
      "English header must link to /en/english with the label English"
    ).toContainText("English");
  });

  test("/en/english hub groups every course by level and links to course pages", async ({ page }) => {
    seedMikuDone(page);
    await page.goto("/en/english", { waitUntil: "domcontentloaded" });

    for (const course of COURSE_EN) {
      await expect(page.getByText(course, { exact: true }).first()).toBeVisible();
    }

    // Full catalogue is grouped by curriculum level.
    await expect(page.getByRole("heading", { name: /Level 1/i }).first()).toBeVisible();
    await expect(page.getByRole("heading", { name: /Specialised courses/i })).toBeVisible();
    await expect(page.getByText(/\d+ courses · \d+ videos/).first()).toBeVisible();

    // Suggested path section (channel's own ordering)
    await expect(page.getByRole("heading", { name: /Suggested path/i })).toBeVisible();

    // Course cards open the dedicated course page instead of a 458-item list.
    await expect(page.locator('a[href="/en/english/course/en-zero"]').first()).toBeVisible();

    // Course cards link to the known channel playlists.
    await expect(
      page.locator('a[href*="PLp22-4PivYmIFAnru_L7fnMhSV5YffLTZ"]').first()
    ).toBeVisible();

    // 4.7 credit, present on every English page
    await expect(page.getByText(/zAmericanEnglish on YouTube/).first()).toBeVisible();

    // Footer links to the section as well
    await expect(page.locator('footer a[href="/en/english"]').first()).toBeVisible();
  });

  test("/en/english/course/en-zero lists the course lessons", async ({ page }) => {
    seedMikuDone(page);
    await page.goto("/en/english/course/en-zero", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Course lessons/i })).toBeVisible();
    await expect(page.getByText(/\d+ lessons/).first()).toBeVisible();
    await expect(page.locator('a[href="/en/english/001"]').first()).toBeVisible();
    // Credit card and a link back to the hub.
    await expect(page.getByText(/zAmericanEnglish on YouTube/).first()).toBeVisible();
    await expect(page.locator('a[href="/en/english"]').first()).toBeVisible();
  });

  test("/english hub (Arabic locale) renders Arabic labels, groups and credit", async ({ page }) => {
    seedMikuDone(page);
    await page.goto("/english", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /قسم الإنجليزية/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: /المستوى الأول/ }).first()).toBeVisible();
    await expect(page.locator('a[href="/english/course/en-zero"]').first()).toBeVisible();
    await expect(page.getByText(/zAmericanEnglish on YouTube/).first()).toBeVisible();
  });

  test("lesson page renders the player facade, lesson panel and credit", async ({ page }) => {
    seedMikuDone(page);
    await page.goto("/en/english/001", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    // Tabs come from EnglishLessonPanel
    for (const tab of ["Summary", "Key terms", "Practice", "Speaking", "My notes"]) {
      await expect(page.getByRole("tab", { name: tab })).toBeVisible();
    }
    // 4.7 credit card links back to the original video/playlist
    await expect(page.locator('a[href*="youtu.be/77IK9T45kiU"]').first()).toBeVisible();
  });

  test("/en/english/review renders the empty state when nothing is due", async ({ page }) => {
    seedMikuDone(page);
    await page.goto("/en/english/review", { waitUntil: "domcontentloaded" });
    await expect(page.getByText(/No terms due today/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /Back to the English section/i })).toBeVisible();
  });
});
