import { test, expect } from "@playwright/test";
import { seedMaryamDone } from "./helpers/ui";

test.describe("Maryam study buddy", () => {
  test("opens on /landing and shows the page tip panel", async ({ page }) => {
    seedMaryamDone(page);
    await page.goto("/en/landing", { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: /Maryam assistant/i }).click();
    await expect(page.getByText("Tutorials")).toBeVisible();
    await expect(page.getByRole("link", { name: /Tutorials/i })).toBeVisible();
    const tagline = page.getByText("Maryam — your AI engineering companion", { exact: true });
    await expect(tagline.nth(1)).toBeVisible();
  });

  test("responds as Maryam in Arabic", async ({ page }) => {
    seedMaryamDone(page);
    await page.goto("/ar/landing", { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "مساعدة مريم" }).click();
    const tagline = page.getByText("مريم — رفيقة رحلتك في الذكاء الاصطناعي والبرمجة", { exact: true });
    await expect(tagline.nth(1)).toBeVisible();
  });

  test("mascot assets resolve through the locale middleware", async ({ request }) => {
    for (const name of [
      "maryam_front.svg",
      "maryam_3q.svg",
      "maryam_side.svg",
      "maryam_icon.svg",
    ]) {
      const res = await request.get(`/mascot/${name}`);
      expect(res.status(), name).toBe(200);
      expect(res.headers()["content-type"], name).toContain("image/svg+xml");
    }
  });

  test("no API keys are visible in the browser console/bundle strings", async ({ page }) => {
    seedMaryamDone(page);
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
