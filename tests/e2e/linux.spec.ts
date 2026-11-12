import { test, expect } from "@playwright/test";
import { seedMikuDone } from "./helpers/ui";

test.describe("Linux section (Pilot)", () => {
  test("nav Groups the tracks under Courses dropdown (ar + en)", async ({ page }) => {
    seedMikuDone(page);
    // NB: assert on /curriculum — `/` client-redirects guests to /landing (bare header)
    await page.goto("/curriculum", { waitUntil: "domcontentloaded" });
    await page.locator("header button", { hasText: "الدورات" }).first().click();
    await expect(
      page.locator('header a[href="/linux"]').first(),
      "Arabic header Courses menu must link to /linux with the label لينكس"
    ).toContainText("لينكس");

    await page.goto("/en/curriculum", { waitUntil: "domcontentloaded" });
    await page.locator("header button", { hasText: "Courses" }).first().click();
    await expect(
      page.locator('header a[href="/en/linux"]').first(),
      "English header Courses menu must link to /en/linux with the label Linux"
    ).toContainText("Linux");
  });

  test("/linux hub renders the course card, credit and section index", async ({ page }) => {
    seedMikuDone(page);
    await page.goto("/linux", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toContainText("لينكس");
    // Catalogue line: 1 course · 53 videos
    await expect(page.getByText(/53 فيديو/).first()).toBeVisible();
    // Course card links to the course page
    await expect(page.locator('a[href="/linux/course/linux-2021"]').first()).toBeVisible();
    // Credit line on the hub (every track page)
    await expect(page.getByText(/Content by Linuxtopia/).first()).toBeVisible();
    // Sections are listed and link into the course page anchors
    await expect(page.locator('a[href*="/linux/course/linux-2021#section-"]').first()).toBeVisible();
  });

  test("/en/linux hub renders English labels and credit", async ({ page }) => {
    seedMikuDone(page);
    await page.goto("/en/linux", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Linux");
    await expect(page.getByText(/53 videos/).first()).toBeVisible();
    await expect(page.getByText(/Content by Linuxtopia/).first()).toBeVisible();
  });

  test("/linux/course/linux-2021 lists all 53 lessons grouped by section", async ({ page }) => {
    seedMikuDone(page);
    await page.goto("/linux/course/linux-2021", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText(/53 فيديو|53 videos/).first()).toBeVisible();
    // All 53 lessons render, each linking to its own page
    await expect(page.locator('a[href="/linux/lnx-01"]').first()).toBeVisible();
    await expect(page.locator('a[href="/linux/lnx-53"]').first()).toBeVisible();
    expect(await page.locator('ol li a[href^="/linux/lnx-"]').count()).toBe(53);
    // Credit links back to the playlist
    await expect(page.locator('a[href*="list=PLAZ__zcDB1IaNaVNOckNpgEpjghSHr8Gg"]').first()).toBeVisible();
    await expect(page.getByText(/Content by Linuxtopia/).first()).toBeVisible();
  });

  test("lesson page renders the facade, lesson panel tabs and credit", async ({ page }) => {
    seedMikuDone(page);
    await page.goto("/en/linux/lnx-01", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    // Click-to-load facade button (no autoplay, no iframe yet)
    await expect(page.getByRole("button", { name: /play|شغّل/i }).first()).toBeVisible();
    // Lesson panel tabs (interactiveness entry points)
    for (const tab of ["Summary", "Key terms", "Practice", "Terminal Lab", "My notes"]) {
      await expect(page.getByRole("tab", { name: tab })).toBeVisible();
    }
    // Credit card links back to the original video and the playlist
    await expect(page.locator('a[href*="youtu.be/"], a[href*="youtube.com/watch"]').first()).toBeVisible();
    await expect(page.getByText(/Content by Linuxtopia/).first()).toBeVisible();
  });

  test("lesson page Terminal Lab tab boots the simulated shell", async ({ page }) => {
    seedMikuDone(page);
    await page.goto("/en/linux/lnx-05", { waitUntil: "domcontentloaded" });
    await page.getByRole("tab", { name: "Terminal Lab" }).click();
    // Simulated — the safety notice must be visible
    await expect(page.getByText(/Fully simulated in your browser/i)).toBeVisible();
    // A fresh challenge boots with a Check my work button (not free-play) — lnx-05 is in "commands"
    await expect(page.getByRole("button", { name: /Check my work/i })).toBeVisible();
    // Typing a command prints output into the transcript
    const input = page.getByRole("textbox");
    await input.fill("pwd");
    await input.press("Enter");
    await expect(page.getByText("/home/learner").first()).toBeVisible();
  });

  test("/en/linux/review renders the empty state when nothing is due", async ({ page }) => {
    seedMikuDone(page);
    await page.goto("/en/linux/review", { waitUntil: "domcontentloaded" });
    await expect(page.getByText(/No terms due today/i)).toBeVisible();
  });

  test("Arabic lesson page shows the interactive tabs in Arabic", async ({ page }) => {
    seedMikuDone(page);
    await page.goto("/linux/lnx-01", { waitUntil: "domcontentloaded" });
    for (const tab of ["الملخص", "مصطلحات", "تدرّب", "معمل الطرفية", "ملاحظاتي"]) {
      await expect(page.getByRole("tab", { name: tab })).toBeVisible();
    }
  });
});
