import { test, expect } from "@playwright/test";
import { seedMikuDone } from "./helpers/ui";

test("unknown route renders 404 page", async ({ page }) => {
    seedMikuDone(page);
  const response = await page.goto("/definitely-not-a-page-" + Date.now(), { waitUntil: "domcontentloaded" });
  expect(response?.status()).toBe(404);
  await expect(page.locator("text=Page not found")).toBeVisible();
});

test("404 page shows a way back home", async ({ page }) => {
    seedMikuDone(page);
  await page.goto("/definitely-not-a-page", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("main").getByRole("link", { name: /Home/ })).toBeVisible();
});
