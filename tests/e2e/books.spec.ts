import { test, expect, type Page } from "@playwright/test";
import { seedMaryamDone } from "./helpers/ui";

function seedBookProgress(page: Page, pageNumber: number): void {
  page.context().addInitScript((pageNumber) => {
    try {
      window.localStorage.setItem(
        "etm-progress-v2",
        JSON.stringify({
          version: 2,
          events: [
            {
              id: "e2e-book-progress",
              v: 2,
              track: "books",
              type: "book_progress",
              itemId: "dopamine-nation",
              payload: { page: pageNumber, total: 309 },
              at: "2026-01-01T12:00:00.000Z",
            },
          ],
          settings: { dailyGoalMinutes: 15 },
        })
      );
    } catch {
      /* storage may be blocked */
    }
  }, pageNumber);
}

test.describe("Free Books page", () => {
  test("loads with the Free Books content and links", async ({ page }) => {
    seedMaryamDone(page);
    await page.goto("/books", { waitUntil: "domcontentloaded" });
    await expect(page.locator("text=Operating Systems: Three Easy Pieces").first()).toBeVisible();

    const link = page.getByRole("link", { name: "Operating Systems: Three Easy Pieces (OSTEP)" }).first();
    expect(await link.getAttribute("href")).toContain("cs.wisc.edu");
  });

  test("no references to removed commercial books appear", async ({ page }) => {
    seedMaryamDone(page);
    await page.goto("/books", { waitUntil: "domcontentloaded" });
    // Spot-check known commercial-only titles that must NOT be in a legally-free library.
    for (const removed of [
      "C++ Primer (5th Edition)",
      "Effective Modern C++",
      "The Pragmatic Programmer",
    ]) {
      await expect(page.locator(`text=${removed}`)).toHaveCount(0);
    }
  });
});

test.describe("Self-development books", () => {
  test("books page lists the section and both summaries", async ({ page }) => {
    seedMaryamDone(page);
    await page.goto("/books", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { name: "تنمية ذاتية" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "أمة الدوبامين" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "قوانين القوة الـ48" })).toBeVisible();

    const summaryLink = page.getByRole("link", { name: /اقرأ الملخص/ }).first();
    expect(await summaryLink.getAttribute("href")).toBe("/books/self-development/dopamine-nation");
  });

  test("summary page renders original content and the reader link", async ({ page }) => {
    seedMaryamDone(page);
    await page.goto("/books/self-development/48-laws-of-power", {
      waitUntil: "domcontentloaded",
    });

    await expect(page.getByRole("heading", { name: "قوانين القوة الـ48" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "ملخص الكتاب" })).toBeVisible();
    await expect(page.getByText("القوة لعبة بلا نهاية")).toBeVisible();

    const readerLink = page.getByRole("link", { name: /ابدأ القراءة/ }).first();
    expect(await readerLink.getAttribute("href")).toBe(
      "/books/self-development/48-laws-of-power/read"
    );
  });

  test("saved page turns the CTA into a resume link", async ({ page }) => {
    seedMaryamDone(page);
    seedBookProgress(page, 12);
    await page.goto("/books", { waitUntil: "domcontentloaded" });

    const resume = page.getByRole("link", { name: /متابعة من صفحة 12/ }).first();
    await expect(resume).toBeVisible();
    expect(await resume.getAttribute("href")).toBe(
      "/books/self-development/dopamine-nation/read"
    );
  });

  test("reader restores and announces the saved page", async ({ page, browserName }) => {
    test.skip(browserName !== "chromium", "Canvas PDF rendering is covered on Chromium only.");
    test.setTimeout(60_000);
    seedMaryamDone(page);
    seedBookProgress(page, 12);
    await page.goto("/books/self-development/dopamine-nation/read", {
      waitUntil: "domcontentloaded",
    });

    await expect(page.getByText("تم استئناف القراءة من صفحة 12")).toBeVisible({
      timeout: 45_000,
    });
    await expect(page.locator("canvas")).toBeVisible();
  });
});
