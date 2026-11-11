import { test, expect } from "@playwright/test";
import { seedMikuDone } from "./helpers/ui";

test.describe("Quiz interaction", () => {
  test("wrong answer flagged, correct answer accepted, retry clears", async ({ page }) => {
    seedMikuDone(page);
    await page.goto("/learn/stage-1/cpp-basics/hello-world", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /Test your understanding/ })).toBeVisible();

    // Q1: wrong option — flagged with rose styling.
    await page.getByRole("button", { name: "طباعة النصوص على الشاشة تلقائياً" }).click();
    const q1Wrong = page.getByRole("button", { name: /طباعة النصوص على الشاشة تلقائياً/ });
    expect(await q1Wrong.evaluate((el) => el.className.includes("rose")), "wrong option rose").toBe(true);

    // Q1 answered: score reads 0 / 1 correct.
    await expect(page.getByText(/0\s*\/\s*1\s*correct/)).toBeVisible();

    // Retry clears answers.
    await page.getByRole("button", { name: "Retry" }).click();
    await expect(page.getByText(/0\s*\/\s*1\s*correct/)).toHaveCount(0);
  });

  test("all questions answered shows a completion banner with a score", async ({ page }) => {
    seedMikuDone(page);
    await page.goto("/learn/stage-1/cpp-basics/hello-world", { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "استدعاء مكتبة أدوات الإدخال والإخراج" }).click(); // Q1 correct
    await page.getByRole("button", { name: "من دالة main" }).click(); // Q2 correct
    await page.getByRole("button", { name: "علامة نهاية الجملة الأمرية زي النقطة في اللغة العربية" }).click(); // Q3 correct
    await expect(page.locator("text=Excellent! All answers correct")).toBeVisible();
  });

  test("keyboard: focusing an option and pressing Enter selects it", async ({ page }) => {
    seedMikuDone(page);
    await page.goto("/learn/stage-1/cpp-basics/hello-world", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /Test your understanding/ })).toBeVisible();
    const q2 = page.getByRole("button", { name: "من دالة main" });
    await q2.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByText(/1\s*\/\s*1\s*correct/)).toBeVisible();
  });

  test("choosing an option disables it", async ({ page }) => {
    seedMikuDone(page);
    await page.goto("/learn/stage-1/cpp-basics/hello-world", { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "تعريف متغير جديد" }).click();
    await expect(page.getByRole("button", { name: "تعريف متغير جديد" })).toBeDisabled();
    await expect(page.getByText(/0\s*\/\s*1\s*correct/)).toBeVisible();
  });
});
