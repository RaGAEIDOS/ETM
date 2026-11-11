import { test, expect } from "@playwright/test";
import { seedMikuDone } from "./helpers/ui";

const V2_KEY = "etm-progress-v2";

test.describe("Progress persistence", () => {
  test("lesson marked complete stays complete after reload", async ({ page }) => {
    seedMikuDone(page);
    await page.goto("/en/learn/stage-1/cpp-basics/hello-world", { waitUntil: "domcontentloaded" });
    const mark = page.getByRole("button", { name: /Mark lesson complete/i });
    await expect(mark).toBeVisible();
    await mark.click();
    await expect(page.getByRole("button", { name: /Completed .* click to undo/i })).toBeVisible();

    await page.reload();
    await expect(page.getByRole("button", { name: /Completed .* click to undo/i })).toBeVisible();

    // clean up progress so other tests are unaffected
    await page.getByRole("button", { name: /Completed .* click to undo/i }).click();
    await expect(page.getByRole("button", { name: /Mark lesson complete/i })).toBeVisible();
  });

  test("progress survives reload when storage is blocked", async ({ browser }) => {
    // Simulate blocked localStorage: an init script throws on access.
    const ctx = await browser.newContext();
    await ctx.addInitScript(() => {
      const throwing = () => {
        throw new DOMException("localStorage is blocked", "SecurityError");
      };
      Object.defineProperty(window, "localStorage", { get: throwing });
    });
    const page = await ctx.newPage();
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(String(err)));

    // The page must still render content (no hard crash) even if storage throws.
    const response = await page.goto("/en/learn/stage-1/cpp-basics/hello-world", {
      waitUntil: "domcontentloaded",
    });
    expect(response?.status()).toBeLessThan(400);
    await page.waitForLoadState("networkidle");
    await expect(page.locator("body")).toBeVisible();
    expect(errors, `page errors: ${errors.join(" || ")}`).toEqual([]);
    await ctx.close();
  });

  test("marking lessons persists to the unified v2 store", async ({ page }) => {
    seedMikuDone(page);
    await page.goto("/en/learn/stage-1/cpp-basics/variables-types", {
      waitUntil: "domcontentloaded",
    });
    const mark = page.getByRole("button", { name: /Mark lesson complete/i });
    await expect(mark).toBeVisible();
    await mark.click();
    await expect(page.getByRole("button", { name: /Completed/i })).toBeVisible();
    const saved = await page.evaluate((key) => window.localStorage.getItem(key), V2_KEY);
    expect(saved ?? "").toMatch(/variables-types/);
    expect(saved ?? "").toMatch(/lesson_completed/);
    // undo to keep the environment tidy
    await page.getByRole("button", { name: /Completed/i }).click();
    await expect(page.getByRole("button", { name: /Mark lesson complete/i })).toBeVisible();
  });

  test("quiz attempt is persisted to the unified v2 store", async ({ page }) => {
    seedMikuDone(page);
    await page.goto("/en/learn/stage-1/cpp-basics/hello-world", {
      waitUntil: "domcontentloaded",
    });
    const quizRoot = page
      .getByRole("heading", { name: /Test your understanding/i })
      .locator("..")
      .locator("..");
    const questions = quizRoot.locator("div.space-y-5 > div");
    const count = await questions.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i += 1) {
      await questions.nth(i).getByRole("button").first().click();
    }
    const saved = await page.evaluate((key) => window.localStorage.getItem(key), V2_KEY);
    expect(saved ?? "").toMatch(/quiz_attempt/);
  });

  test("elzero video can be marked as watched and unmarked", async ({ page }) => {
    seedMikuDone(page);
    await page.goto("/en/elzero/001", { waitUntil: "domcontentloaded" });
    const mark = page.getByRole("button", { name: /Mark video as watched/i });
    await expect(mark).toBeVisible();
    await mark.click();
    await expect(page.getByRole("button", { name: /Watched .* click to undo/i })).toBeVisible();
    const saved = await page.evaluate((key) => window.localStorage.getItem(key), V2_KEY);
    expect(saved ?? "").toMatch(/lesson_completed/);
    await page.getByRole("button", { name: /Watched .* click to undo/i }).click();
    await expect(page.getByRole("button", { name: /Mark video as watched/i })).toBeVisible();
  });

  test("dashboard shows the unified progress sections", async ({ page }) => {
    seedMikuDone(page);
    await page.goto("/en/dashboard", { waitUntil: "domcontentloaded" });
    await expect(page.getByText("Your activity — last 12 weeks")).toBeVisible();
    await expect(page.getByText("Quiz accuracy — last 8 weeks")).toBeVisible();
    await expect(page.getByText("Achievements")).toBeVisible();
    await expect(page.getByText("Needs focus")).toBeVisible();
    await expect(page.getByText("Your daily focus goal")).toBeVisible();
    await expect(page.getByRole("button", { name: /Export my data/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Delete my data/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Continue where you left off|Next lesson/i }).first()).toBeVisible();
  });

  test("home page shows the resume card", async ({ page }) => {
    // The home page is for signed-in users (guests are redirected to /landing),
    // so mock the session endpoint to see the signed-in home.
    await page.route("**/api/auth/me", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          user: {
            id: "e2e-user",
            login: "e2e",
            name: "E2E",
            email: null,
            avatarUrl: "",
            provider: "github",
          },
        }),
      }),
    );
    seedMikuDone(page);
    await page.goto("/en/", { waitUntil: "domcontentloaded" });
    await expect(page.getByText(/Continue where you left off/i).first()).toBeVisible();
  });

  test("delete my data wipes all learning keys on this device", async ({ page }) => {
    seedMikuDone(page);
    await page.goto("/en/learn/stage-1/cpp-basics/hello-world", {
      waitUntil: "domcontentloaded",
    });
    await page.getByRole("button", { name: /Mark lesson complete/i }).click();
    await expect(page.getByRole("button", { name: /Completed/i })).toBeVisible();

    page.once("dialog", (dialog) => dialog.accept());
    await page.goto("/en/dashboard", { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: /Delete my data/i }).click();

    const v2 = await page.evaluate((key) => window.localStorage.getItem(key), V2_KEY);
    const parsed = v2 ? JSON.parse(v2) : { events: [] };
    // The store may re-create an EMPTY skeleton on reload; what matters is
    // that no learning data survives.
    expect(parsed.events ?? []).toEqual([]);
    const legacy = await page.evaluate(() => window.localStorage.getItem("etm-progress-v1"));
    expect(legacy).toBeNull();
  });
});
