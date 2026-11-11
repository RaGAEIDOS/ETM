// Baseline recon screenshots (Phase 0). Not part of the QA gate.
// Usage: node scripts/recon-screenshots.mjs [baseURL]
// Requires the production server running (next start -p 3100) and Playwright browsers installed.
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const BASE = process.argv[2] || "http://localhost:3100";
const OUT = "docs/recon/screenshots";

const PAGES = [
  ["home", "/"],
  ["curriculum", "/curriculum"],
  ["elzero", "/elzero"],
  ["elzero-001", "/elzero/001"],
  ["stage-1", "/learn/stage-1"],
  ["course-cpp-basics", "/learn/stage-1/cpp-basics"],
  ["lesson-hello-world", "/learn/stage-1/cpp-basics/hello-world"],
  ["playground", "/playground"],
  ["projects", "/projects"],
  ["glossary", "/glossary"],
  ["books", "/books"],
  ["dashboard", "/dashboard"],
  ["progress", "/progress"],
  ["login", "/login"],
  ["landing", "/landing"],
  ["guide", "/guide"],
  ["sources", "/sources"],
  ["profile", "/profile"],
  ["404", "/definitely-not-a-page"],
];

const VIEWPORTS = [
  ["desktop", { width: 1280, height: 800 }],
  ["mobile", { width: 390, height: 844 }],
];

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();

// Capture the first-visit experience once (Miku onboarding overlay).
{
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/desktop-home-onboarding.jpg`, type: "jpeg", quality: 75 });
  await context.close();
}

for (const [vpName, viewport] of VIEWPORTS) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  // One-time Miku tour — seed it so screenshots show the actual pages.
  await context.addInitScript(() => {
    try {
      window.localStorage.setItem("etm-miku-onboarding-done", "1");
    } catch {}
  });
  const page = await context.newPage();
  for (const [name, path] of PAGES) {
    try {
      await page.goto(BASE + path, { waitUntil: "domcontentloaded", timeout: 30000 });
      await page.waitForTimeout(900);
      await page.screenshot({
        path: `${OUT}/${vpName}-${name}.jpg`,
        type: "jpeg",
        quality: 75,
        fullPage: false,
      });
      console.log(`ok ${vpName} ${path}`);
    } catch (err) {
      console.error(`FAIL ${vpName} ${path}: ${err.message}`);
    }
  }
  await context.close();
}
await browser.close();
