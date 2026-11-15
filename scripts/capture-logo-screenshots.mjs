#!/usr/bin/env node
/**
 * Captures the header logo at 390 px and 1280 px in the dark, light and
 * terminal themes for docs/screenshots/logo_*.png.
 *
 * The captures show the top of the page (header + hero heading) at 2x so the
 * wordmark is legible in review. The Maryam onboarding overlay is seeded as
 * "done"; otherwise its full-screen blurred backdrop covers the page.
 *
 * Usage:
 *   npm run build
 *   npx next start -p 3200
 *   node scripts/capture-logo-screenshots.mjs
 *
 * Override the server with BASE_URL=http://localhost:3200.
 */

import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "@playwright/test";

const baseURL = process.env.BASE_URL ?? "http://localhost:3200";
const outputDir = join(process.cwd(), "docs", "screenshots");
const themes = ["dark", "light", "terminal"];
const widths = [390, 1280];
const clipHeight = 260;

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch();
try {
  for (const width of widths) {
    const context = await browser.newContext({
      viewport: { width, height: width === 390 ? 900 : 960 },
      deviceScaleFactor: 2,
    });

    // Theme and the "onboarding done" flag must exist before the first paint.
    await context.addInitScript(() => {
      try {
        window.localStorage.setItem("etm-maryam-onboarding-done", "1");
      } catch {
        /* storage may be blocked */
      }
    });

    const page = await context.newPage();

    for (const theme of themes) {
      await page.addInitScript((value) => {
        window.localStorage.setItem("etm-theme-v2", value);
      }, theme);
      await page.goto(`${baseURL}/`, { waitUntil: "networkidle" });
      await page.waitForFunction(
        (value) => document.documentElement.dataset.theme === value,
        theme
      );
      await page.evaluate(() => document.fonts.ready);

      const header = page.locator("header").first();
      await header.waitFor({ state: "visible" });
      const logo = page.locator("header .site-logo img:visible").first();
      await logo.waitFor({ state: "visible" });
      await page.waitForFunction(() => {
        const image = document.querySelector("header .site-logo img");
        return image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0;
      });

      // Fail loudly if the onboarding backdrop ever covers the capture again.
      const overlay = await page.locator("div.fixed.inset-0.z-\\[70\\]").count();
      if (overlay) throw new Error("Maryam onboarding overlay is open; capture would be blurred");

      const path = join(outputDir, `logo_${width}_${theme}.png`);
      await page.screenshot({
        path,
        clip: { x: 0, y: 0, width, height: clipHeight },
      });
      console.log(`[logo-shots] ${path}`);
    }

    await context.close();
  }
} finally {
  await browser.close();
}
