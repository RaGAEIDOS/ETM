import type { Page } from "@playwright/test";

// Seed localStorage so the Miku onboarding tour does not open (it intercepts clicks).
export function seedMikuDone(page: Page): void {
  page.context().addInitScript(() => {
    try { window.localStorage.setItem("etm-miku-onboarding-done", "1"); } catch { /* storage may be blocked */ }
  });
}

// Instrument a page BEFORE navigating: collect console errors and failed/4xx/5xx requests,
// and seed localStorage so the Miku onboarding tour does not open (it is a full-screen
// modal and intercepts pointer events).
export function instrument(page: Page) {
  seedMikuDone(page);

  const consoleErrors: string[] = [];
  const badResponses: string[] = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("requestfailed", (req) => {
    badResponses.push(`requestfailed: ${req.url()} :: ${req.failure()?.errorText ?? "unknown"}`);
  });
  page.on("response", (res) => {
    // Ignore 404s for /_next/* chunks that were hash-rebuilt after an edit; treat real pages honestly.
    if (res.status() >= 400) badResponses.push(`${res.status()} ${res.url()}`);
  });

  return { consoleErrors, badResponses };
}

// Wait until the persistent "Loading..." skeleton is gone (client-side hydration complete).
export async function waitHydrated(page: Page, timeout = 15_000): Promise<void> {
  try {
    await page.waitForFunction(() => document.body.textContent?.includes("Loading...") === false, { timeout });
  } catch {
    /* caller decides how to assert */
  }
  // Fonts load over a <link> with display=swap; wait for the swap before any
  // layout measurement (scrollWidth) so results are stable with and without
  // network access to Google Fonts. Cap the wait: WebKit can leave
  // document.fonts.ready pending forever when the font host times out.
  try {
    await page.evaluate(() =>
      Promise.race([
        (document.fonts?.ready ?? Promise.resolve()).then(() => undefined),
        new Promise<void>((resolve) => window.setTimeout(resolve, 4_000)),
      ])
    );
  } catch {
    /* document.fonts unavailable — measurement happens anyway */
  }
}

export function horizontallyScrollable(page: Page) {
  return page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
}
