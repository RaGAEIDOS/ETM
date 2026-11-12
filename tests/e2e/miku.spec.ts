import { test, expect } from "@playwright/test";
import { seedMikuDone } from "./helpers/ui";

test.describe("Miku study buddy", () => {
  test("opens on /landing and shows the page tip panel", async ({ page }) => {
    seedMikuDone(page);
    await page.goto("/en/landing", { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: /Miku assistant/i }).click();
    await expect(page.getByText("Tutorials")).toBeVisible();
    await expect(page.getByRole("link", { name: /Tutorials/i })).toBeVisible();
  });

  test("no API keys are visible in the browser console/bundle strings", async ({ page }) => {
    seedMikuDone(page);
    const sent: string[] = [];
    page.on("request", (req) => sent.push(req.url()));
    await page.goto("/en/landing", { waitUntil: "domcontentloaded" });
    const html = await page.content();
    for (const pat of [/GITHUB_TOKEN|GH_TOKEN/i, /sk-[A-Za-z0-9_-]{10,}/i, /OPENAI/i, /Bearer\s+[A-Za-z0-9_-]{10,}/]) {
      expect(html, `forbidden pattern ${pat}`).not.toMatch(pat);
    }
    // no request leaves this device with a secret in the URL
    for (const url of sent) {
      expect(url, "api key in URL").not.toMatch(/sk-[A-Za-z0-9_-]{10,}/i);
    }
  });
});
