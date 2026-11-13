import { test, expect } from "@playwright/test";
import { ALL_ROUTES, LESSON_ROUTES } from "./helpers/routes";
import { instrument, horizontallyScrollable, waitHydrated } from "./helpers/ui";

// Network noise tolerated (no live connection to fonts.googleapis / CDNs).
// YouTube thumbnails live on i.ytimg.com and may be unreachable in offline
// environments; they are decorative and fail over to mqdefault/black.
const NOISE = [/fonts\.g/i, /fonts\.gstatic/i, /font.*(load|css)/i, /gstatic/i, /ytimg\.com/i];

for (const route of [...ALL_ROUTES, ...LESSON_ROUTES]) {
  test(`route ${route} loads, hydrates, and shows no console errors`, async ({ page }) => {
    const { consoleErrors, badResponses } = instrument(page);

    const response = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(response, `${route}: no response`).toBeTruthy();
    expect(response!.status(), `${route}: HTTP status`).toBeLessThan(400);

    await waitHydrated(page);

    const title = await page.title();
    expect(title?.length ?? 0, `${route}: title`).toBeGreaterThan(5);

    const metaDesc = await page.locator('meta[name="description"]').getAttribute("content").catch(() => null);
    expect(metaDesc?.length ?? 0, `${route}: meta description`).toBeGreaterThan(10);

    expect(await horizontallyScrollable(page), `${route}: horizontal overflow`).toBe(false);

    const filteredConsoleErrors = consoleErrors.filter((e) => !NOISE.some((n) => n.test(e)));
    expect(filteredConsoleErrors, `${route}: console errors: ${filteredConsoleErrors.join(" || ")}`).toEqual([]);

    const filteredBad = badResponses.filter((e) => !NOISE.some((n) => n.test(e)) && !/_next\/static.*404/.test(e));
    expect(filteredBad, `${route}: bad responses: ${filteredBad.join(" || ")}`).toEqual([]);
  });
}
