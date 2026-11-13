import { test, expect, type Page, type TestInfo } from "@playwright/test";
import { seedMikuDone, waitHydrated } from "./helpers/ui";

const V2_KEY = "etm-progress-v2";
const PA_NOTES_KEY = "etm-programmingadvices-notes-v1";
const CREDIT =
  "Content by Dr. Mohammed Abu-Hadhoud / Programming Advices on YouTube. This platform is not affiliated with Programming Advices.";

type SeedEvent = {
  id: string;
  v: 2;
  track: "programmingadvices";
  type: "video_progress" | "term_review" | "lesson_completed";
  itemId?: string;
  topic?: string;
  payload?: Record<string, unknown>;
  at: string;
};

function seedProgress(page: Page, events: SeedEvent[]): void {
  page.addInitScript(
    ([key, payload]) => {
      try {
        window.localStorage.setItem(key, payload);
      } catch {
        /* storage may be blocked */
      }
    },
    [
      V2_KEY,
      JSON.stringify({
        version: 2,
        events,
        settings: { dailyGoalMinutes: 15 },
      }),
    ] as [string, string]
  );
}

/** Open the mobile sheet or the desktop "Courses" dropdown. */
async function openNavIfNeeded(page: Page, testInfo: TestInfo): Promise<void> {
  if (testInfo.project.name.startsWith("mobile")) {
    const menu = page.getByRole("button", { name: /Menu|القائمة/ }).first();
    if (await menu.isVisible().catch(() => false)) await menu.click();
    return;
  }
  const courses = page.locator("header button", { hasText: "الدورات" }).first();
  if (await courses.isVisible().catch(() => false)) await courses.click();
}

const daysAgo = (days: number) => new Date(Date.now() - days * 86_400_000).toISOString();

test.describe("Programming Advices track (pilot)", () => {
  test("hub: two courses, progress counts, one roadmap link, credit in both locales", async ({
    page,
  }, testInfo) => {
    seedMikuDone(page);
    await page.goto("/programmingadvices", { waitUntil: "domcontentloaded" });
    await waitHydrated(page);

    await expect(page.getByRole("heading", { name: "Programming Advices", level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "الدورتان" })).toBeVisible();
    await expect(page.getByText("20 فيديو في القائمة الرسمية").first()).toBeVisible();
    await expect(page.getByText("50 فيديو في القائمة الرسمية").first()).toBeVisible();
    await expect(page.getByText("10 من 20 متاح الآن").first()).toBeVisible();
    await expect(page.locator('a[href="/programmingadvices/course/pa-foundations"]').first()).toBeVisible();
    await expect(page.locator('a[href="/programmingadvices/course/pa-algorithms"]').first()).toBeVisible();

    // Required credit + non-affiliation, on the hub.
    await expect(page.getByText(CREDIT).first()).toBeVisible();
    await expect(page.getByText(/هذه المنصة غير تابعة لـ Programming Advices/).first()).toBeVisible();

    // At most one "continue the roadmap" CTA across the whole track.
    await expect(page.locator('a[href="https://programmingadvices.com/courses"]')).toHaveCount(1);
    await expect(page.locator('a[href="https://programmingadvices.com/courses"]')).toBeVisible();

    // Optional official pages are linked, never scraped.
    await expect(page.locator('a[href="https://programmingadvices.com/p/00316b"]').first()).toBeVisible();

    // Footer exposure.
    await expect(page.locator('footer a[href="/programmingadvices"]').first()).toBeVisible();

    // Nav entry (desktop dropdown or mobile sheet).
    await openNavIfNeeded(page, testInfo);
    await expect(
      page
        .locator('header a[href="/programmingadvices"]')
        .filter({ hasText: "Programming Advices" })
        .first(),
      "the Programming Advices nav entry must be present"
    ).toBeVisible();

    // English locale mirrors everything.
    await page.goto("/en/programmingadvices", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "The two courses" })).toBeVisible();
    await expect(page.getByText("20 videos in the official playlist").first()).toBeVisible();
    await expect(page.getByText("10 of 20 available now").first()).toBeVisible();
    await expect(page.getByText(CREDIT).first()).toBeVisible();
    await expect(page.locator('a[href="https://programmingadvices.com/courses"]')).toHaveCount(1);
  });

  test("course pages: course 1 lists 10 lessons, course 2 is honest about the pending batch", async ({
    page,
  }) => {
    seedMikuDone(page);
    await page.goto("/en/programmingadvices/course/pa-foundations", {
      waitUntil: "domcontentloaded",
    });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Course lessons" })).toBeVisible();
    await expect(page.getByText("10 of 20 lessons available")).toBeVisible();
    await expect(page.locator('a[href^="/en/programmingadvices/pa1-"]')).toHaveCount(10);
    await expect(page.locator('a[href="/en/programmingadvices/pa1-01"]').first()).toBeVisible();
    await expect(page.getByText(CREDIT).first()).toBeVisible();
    await expect(page.locator('a[href*="PL3X--QIIK-OHgMV2yBz3GLfM5d_5BxOSj"]').first()).toBeVisible();

    await page.goto("/en/programmingadvices/course/pa-algorithms", {
      waitUntil: "domcontentloaded",
    });
    await expect(page.getByText("0 of 50 lessons available")).toBeVisible();
    await expect(page.getByText(/lessons are added in batches after the pilot is approved/i).first()).toBeVisible();
    await expect(page.locator('a[href*="PL3X--QIIK-OEUIwbQU79V76RHelBUQKiz"]').first()).toBeVisible();
    // No fake course-2 lesson pages before the batch lands.
    await expect(page.locator('a[href^="/en/programmingadvices/pa2-"]')).toHaveCount(0);
  });

  test("lesson: facade (no iframe before click), tabs, unreviewed notice, official links", async ({
    page,
  }) => {
    seedMikuDone(page);
    await page.goto("/en/programmingadvices/pa1-05", { waitUntil: "domcontentloaded" });
    await waitHydrated(page);

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    for (const tab of ["Summary", "Key terms", "Practice", "My notes"]) {
      await expect(page.getByRole("tab", { name: tab })).toBeVisible();
    }

    // The facade must not create a YouTube iframe before the learner clicks.
    await expect(page.locator("iframe")).toHaveCount(0);
    await expect(page.getByRole("button", { name: /Load the video from YouTube/ })).toBeVisible();

    // Conservative content is labelled as such.
    await expect(
      page.getByText(/This summary is based only on the video title and description/i)
    ).toBeVisible();
    await expect(page.getByText("Original title on the channel")).toBeVisible();
    await expect(page.getByText(/النظام الثنائي وتمثيل البيانات/).first()).toBeVisible();

    // Official video + playlist + course page + channel, never a mirror.
    await expect(page.locator('a[href*="watch?v=CrA3v6AHTTo"]').first()).toBeVisible();
    await expect(page.locator('a[href*="PL3X--QIIK-OHgMV2yBz3GLfM5d_5BxOSj"]').first()).toBeVisible();
    await expect(page.locator('a[href="https://programmingadvices.com/p/00316b"]').first()).toBeVisible();
    await expect(page.locator('a[href="https://www.youtube.com/c/ProgrammingAdvices"]').first()).toBeVisible();
    await expect(page.getByText(CREDIT).first()).toBeVisible();

    // Arabic lesson mirrors labels and credit.
    await page.goto("/ar/programmingadvices/pa1-05", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("tab", { name: "الملخص" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "مصطلحات" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "تدرّب" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "ملاحظاتي" })).toBeVisible();
    await expect(page.getByText(/المحتوى من د\. محمد أبو هدهود/).first()).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  });

  test("embed: click loads a paused youtube-nocookie player (no autoplay)", async ({ page }) => {
    seedMikuDone(page);
    // Force the IFrame API to fail fast so the component mounts its plain embed.
    await page.route("https://www.youtube.com/iframe_api", (route) => route.abort());

    await page.goto("/en/programmingadvices/pa1-01", { waitUntil: "domcontentloaded" });
    await expect(page.locator("iframe")).toHaveCount(0);
    await page.getByRole("button", { name: /Load the video from YouTube/ }).click();

    const iframe = page.locator('iframe[src*="youtube-nocookie.com/embed/LWCBg5tb64I"]');
    await expect(iframe).toBeVisible({ timeout: 20_000 });
    const src = await iframe.getAttribute("src");
    expect(src, "click-to-load must stay paused").toContain("autoplay=0");
    expect(src).toContain("youtube-nocookie.com");
  });

  test("resume: saved position is surfaced before playback", async ({ page }) => {
    seedMikuDone(page);
    seedProgress(page, [
      {
        id: "e2e-pa-resume",
        v: 2,
        track: "programmingadvices",
        type: "video_progress",
        itemId: "pa1-01",
        topic: "pa-foundations",
        payload: { seconds: 130, duration: 295, percent: 44 },
        at: new Date().toISOString(),
      },
    ]);
    await page.goto("/en/programmingadvices/pa1-01", { waitUntil: "domcontentloaded" });
    await waitHydrated(page);
    await expect(page.getByText("Resume from 2:10")).toBeVisible();
  });

  test("flashcards: flip, grade a term, feed the spaced queue", async ({ page }) => {
    seedMikuDone(page);
    await page.goto("/en/programmingadvices/pa1-05", { waitUntil: "domcontentloaded" });
    await waitHydrated(page);
    await page.getByRole("tab", { name: "Key terms" }).click();

    // First card is the English term, LTR, with its Arabic meaning behind.
    await expect(page.getByRole("button", { name: /Tap the card to flip it/ })).toBeVisible();
    await expect(page.getByText("Binary", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: /Tap the card to flip it/ }).click();
    await expect(page.getByText("ثنائي", { exact: true })).toBeVisible();
    await expect(page.getByText(/Binary uses only 0 and 1/)).toBeVisible();

    await page.getByRole("button", { name: "I know it" }).click();
    await expect(page.getByText("Bit", { exact: true })).toBeVisible();

    const stored = await page.evaluate((key) => window.localStorage.getItem(key), V2_KEY);
    expect(stored ?? "").toContain("term_review");
    expect(stored ?? "").toContain("programmingadvices");
    expect(stored ?? "").toContain("Binary");
  });

  test("practice: MCQ, ordering, matching and typed answers all grade correctly", async ({ page }) => {
    seedMikuDone(page);
    await page.goto("/en/programmingadvices/pa1-03", { waitUntil: "domcontentloaded" });
    await waitHydrated(page);
    await page.getByRole("tab", { name: "Practice" }).click();

    const items = page.locator("div.space-y-5 > div");
    await expect(items).toHaveCount(4);

    // 1) Matching: one right-hand column, shuffled; click left then its match.
    const match = items.nth(0);
    const pairs: [string, string][] = [
      ["Data", "Raw numbers or symbols without context"],
      ["Information", "Data organised so that it has meaning"],
      ["Knowledge", "Understanding that links information with experience"],
      ["Wisdom", "Using knowledge to make a wise decision"],
    ];
    for (const [left, right] of pairs) {
      await match.getByRole("button", { name: left, exact: true }).click();
      await match.getByRole("button", { name: right, exact: true }).click();
    }
    await expect(match.getByRole("button", { name: "Data", exact: true })).toBeDisabled();

    // 2) Ordering: click the pool in the correct order, then Check.
    const order = items.nth(1);
    for (const step of ["Data", "Information", "Knowledge", "Wisdom"]) {
      await order.getByRole("button", { name: step, exact: true }).click();
    }
    await order.getByRole("button", { name: "Check", exact: true }).click();

    // 3) MCQ: exactly one correct option.
    const mcq = items.nth(2);
    await mcq.getByRole("button", { name: "Data", exact: true }).click();

    // 4) Typed answer (accepts the English alias).
    const fill = items.nth(3);
    await fill.getByPlaceholder("Type your answer…").fill("information");
    await fill.getByRole("button", { name: "Check", exact: true }).click();

    await expect(page.getByText(/Excellent! All answers correct/)).toBeVisible();
    await expect(page.getByText("Drill passed")).toBeVisible();

    const stored = await page.evaluate((key) => window.localStorage.getItem(key), V2_KEY);
    expect(stored ?? "").toContain("quiz_attempt");
    expect(stored ?? "").toContain("programmingadvices");
  });

  test("Miku: hint before answering, then explain my wrong answer", async ({ page }) => {
    seedMikuDone(page);
    await page.goto("/en/programmingadvices/pa1-05", { waitUntil: "domcontentloaded" });
    await waitHydrated(page);
    await page.getByRole("tab", { name: "Practice" }).click();

    const first = page.locator("div.space-y-5 > div").first();
    await first.getByRole("button", { name: "Miku hint" }).click();
    await expect(
      first.getByText("Divide by 2 repeatedly and read the remainders bottom-up.")
    ).toBeVisible();
    // The hint never gives the answer away.
    await expect(first.getByText("1101", { exact: true })).toHaveCount(0);

    await first.getByPlaceholder("Type your answer…").fill("1111");
    await first.getByRole("button", { name: "Check", exact: true }).click();
    await first.getByRole("button", { name: "Explain my wrong answer" }).click();
    await expect(first.getByText("Why was that wrong?")).toBeVisible();
    await expect(first.getByText(/13 = 8 \+ 4 \+ 1/)).toBeVisible();
  });

  test("notes: local-only, browser-persisted, exportable and deletable", async ({ page }) => {
    seedMikuDone(page);
    const secret = `private note ${Date.now()}`;
    const leaked: string[] = [];
    page.on("request", (req) => {
      const body = req.postData();
      if (body?.includes(secret)) leaked.push(req.url());
    });

    await page.goto("/en/programmingadvices/pa1-02", { waitUntil: "domcontentloaded" });
    await waitHydrated(page);
    await page.getByRole("tab", { name: "My notes" }).click();
    await page.getByPlaceholder(/Write your own notes/).fill(secret);

    // Autosave (600 ms debounce) to the dedicated private key.
    await expect(page.getByText("Saved")).toBeVisible();
    const stored = await page.evaluate((key) => window.localStorage.getItem(key), PA_NOTES_KEY);
    expect(stored ?? "").toContain(secret);
    expect(leaked, "notes must never leave the device").toEqual([]);

    // Survives reload.
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.getByRole("tab", { name: "My notes" }).click();
    await expect(page.getByPlaceholder(/Write your own notes/)).toHaveValue(secret);

    // Export produces a local JSON download.
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Export my notes" }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain("programmingadvices-notes");

    // Delete this lesson's note with confirmation.
    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "Delete this lesson's note" }).click();
    await expect(page.getByPlaceholder(/Write your own notes/)).toHaveValue("");
    const after = await page.evaluate((key) => window.localStorage.getItem(key), PA_NOTES_KEY);
    expect(after ?? "").not.toContain(secret);
  });

  test("progress: manual completion persists, hub and resume CTA update", async ({ page }) => {
    seedMikuDone(page);
    await page.goto("/en/programmingadvices/pa1-01", { waitUntil: "domcontentloaded" });
    await waitHydrated(page);
    await page.getByRole("button", { name: "I finished this lesson" }).click();
    await expect(page.getByText("Completed — well done!")).toBeVisible();

    const stored = await page.evaluate((key) => window.localStorage.getItem(key), V2_KEY);
    expect(stored ?? "").toContain("lesson_completed");
    expect(stored ?? "").toContain("programmingadvices");
    expect(stored ?? "").toContain("pa1-01");

    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.getByText("Completed — well done!")).toBeVisible();

    await page.goto("/en/programmingadvices", { waitUntil: "domcontentloaded" });
    await waitHydrated(page);
    await expect(page.getByText("1 of 10 available lessons").first()).toBeVisible();
    await expect(page.getByRole("link", { name: /Continue where you left off/ }).first()).toBeVisible();
  });

  test("review queue: due cards come from the learner's own answers", async ({ page }) => {
    seedMikuDone(page);
    seedProgress(page, [
      {
        id: "e2e-pa-review",
        v: 2,
        track: "programmingadvices",
        type: "term_review",
        itemId: "pa1-05",
        topic: "pa-foundations",
        payload: { term: "Binary", known: false },
        at: daysAgo(6),
      },
    ]);

    await page.goto("/programmingadvices", { waitUntil: "domcontentloaded" });
    await waitHydrated(page);
    await expect(page.getByText("1 مستحقة").first()).toBeVisible();

    await page.goto("/en/programmingadvices/review", { waitUntil: "domcontentloaded" });
    await expect(page.getByText(/1 cards? due today/)).toBeVisible();
    await page.getByRole("button", { name: "Start reviewing" }).click();
    await expect(page.getByText("Binary", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: /Tap the card to flip it/ }).click();
    await expect(page.getByText("ثنائي", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "I know it" }).click();
    await expect(page.getByText("Today's review is done")).toBeVisible();
  });

  test("themes: switcher only changes presentation and survives reload", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name.startsWith("mobile"), "desktop header exposes the theme menu");
    seedMikuDone(page);
    await page.goto("/en/programmingadvices", { waitUntil: "domcontentloaded" });

    await page.getByRole("button", { name: "Theme" }).click();
    await page.getByRole("menuitemradio", { name: "Codecademy" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "codecademy");
    const accent = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue("--etm-accent").trim()
    );
    expect(accent).toBe("250 204 21");

    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).toHaveAttribute("data-theme", "codecademy");
    // Content is unaffected by the theme.
    await expect(page.getByRole("heading", { name: "The two courses" })).toBeVisible();
  });
});
