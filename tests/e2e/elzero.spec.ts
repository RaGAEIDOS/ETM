import { test, expect } from "@playwright/test";
import { seedMikuDone } from "./helpers/ui";

test.describe("ElZero video player page", () => {
  test("/en/elzero/001: quiz all-correct shows completion banner", async ({ page }) => {
    seedMikuDone(page);
    await page.goto("/en/elzero/001", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /Test your understanding/ })).toBeVisible();

    await page.getByRole("button", { name: "فيديو + كود + تمرين كل يوم" }).click();
    await page.getByRole("button", { name: "للمبتدئ من الصفر" }).click();

    await expect(page.locator("text=Excellent! All answers correct")).toBeVisible();
  });

  test("/elzero index lists video entries and links to 001", async ({ page }) => {
    seedMikuDone(page);
    await page.goto("/en/elzero", { waitUntil: "domcontentloaded" });
    // 78 videos are listed — make sure at least one ElZero route is linked.
    const link = page.locator('a[href="/en/elzero/001"]').first();
    await expect(link).toBeVisible();
  });
});
