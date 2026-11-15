import { test, expect } from "@playwright/test";
import { seedMaryamDone } from "./helpers/ui";

const THEMES = ["light", "dark", "terminal", "cozy"] as const;

test.describe("Maryam hero banner", () => {
  test.beforeEach(async ({ page }) => {
    seedMaryamDone(page);
  });

  test("landing hero shows both taglines and the required CTAs", async ({ page }) => {
    await page.goto("/landing", { waitUntil: "domcontentloaded" });
    const hero = page.locator('section[role="banner"]');

    await expect(hero).toBeVisible();
    await expect(hero.getByRole("heading", { level: 1 })).toContainText("ETM");
    await expect(
      hero.getByText("منصتك لتعلّم البرمجة والذكاء الاصطناعي", { exact: true })
    ).toBeVisible();
    await expect(
      hero.getByText("Your platform for coding & AI", { exact: true })
    ).toBeVisible();
    await expect(
      hero.getByRole("link", { name: /ابدأ الآن|Start Now/i })
    ).toHaveAttribute("href", "/curriculum");
    await expect(
      hero.getByRole("link", { name: /تعرّف على مريم|Meet Maryam/i })
    ).toHaveAttribute("href", "/about");
    await expect(hero.getByText(/مريم تقول:|Maryam says:/)).toBeVisible();
  });

  test("ETM takes its colour from each theme accent token", async ({ page }) => {
    for (const theme of THEMES) {
      await page.goto("/landing", { waitUntil: "domcontentloaded" });
      await page.evaluate(
        (next) => window.localStorage.setItem("etm-theme-v2", next),
        theme
      );
      await page.reload({ waitUntil: "domcontentloaded" });
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);

      const colors = await page.evaluate(() => {
        const heading = document.querySelector('section[role="banner"] h1');
        const accent = getComputedStyle(document.documentElement)
          .getPropertyValue("--color-accent")
          .trim()
          .split(/\s+/)
          .join(", ");
        return {
          heading: heading ? getComputedStyle(heading).color : "",
          accent: `rgb(${accent})`,
        };
      });

      expect(colors.heading, theme).toBe(colors.accent);
    }
  });
});

test.describe("hero responsive layout", () => {
  test("uses the real banner, cutout and quote avatar assets", async ({
    page,
  }) => {
    seedMaryamDone(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/landing", { waitUntil: "domcontentloaded" });

    const hero = page.locator('section[role="banner"]');
    const quoteAvatar = hero.getByTestId("hero-quote-avatar");
    await expect(quoteAvatar).toBeVisible();
    expect(await quoteAvatar.getAttribute("src")).toContain(
      "/mascot/maryam_icon.svg"
    );

    const banner = hero.getByTestId("hero-banner");
    await expect(banner).toBeVisible();
    const bannerSources = await banner
      .locator('source[type="image/webp"]')
      .getAttribute("srcset");
    expect(bannerSources, "banner srcset").toContain(
      "/mascot/maryam_banner-480.webp 480w"
    );
    expect(bannerSources, "banner srcset").toContain(
      "/mascot/maryam_banner-1920.webp 1920w"
    );
    expect(await banner.locator("img").getAttribute("src")).toContain(
      "/mascot/maryam_banner.png"
    );

    const cutout = hero.getByTestId("hero-cutout");
    await expect(cutout).toBeVisible();
    expect(await cutout.locator("img").getAttribute("src")).toContain(
      "/mascot/maryam_cutout.png"
    );
    expect(await cutout.locator("source").getAttribute("srcset")).toContain(
      "/mascot/maryam_cutout.webp"
    );
  });

  test("desktop uses the exact 55/45 hero columns", async ({ page }) => {
    seedMaryamDone(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/landing", { waitUntil: "domcontentloaded" });

    const columns = await page
      .getByTestId("hero-grid")
      .evaluate((grid) => getComputedStyle(grid).gridTemplateColumns);
    const widths = columns.split(/\s+/).map(Number.parseFloat);
    expect(widths, `grid-template-columns: ${columns}`).toHaveLength(2);
    const ratio = widths[0] / (widths[0] + widths[1]);
    expect(ratio, `first column ratio ${ratio}`).toBeGreaterThan(0.54);
    expect(ratio, `first column ratio ${ratio}`).toBeLessThan(0.56);
  });

  test("mobile shows the 120px avatar and hides the full banner", async ({
    page,
  }) => {
    seedMaryamDone(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/landing", { waitUntil: "domcontentloaded" });

    const hero = page.locator('section[role="banner"]');
    const avatar = hero.getByTestId("hero-mobile-avatar");
    const banner = hero.getByTestId("hero-banner");

    await expect(avatar).toBeVisible();
    await expect(banner).toBeHidden();
    const box = await avatar.boundingBox();
    expect(box, "mobile avatar box").not.toBeNull();
    expect(Math.round(box!.width), "mobile avatar width").toBe(120);
    expect(Math.round(box!.height), "mobile avatar height").toBe(120);
  });

  test("desktop shows the banner frame and hides the mobile avatar", async ({
    page,
  }) => {
    seedMaryamDone(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/landing", { waitUntil: "domcontentloaded" });

    const hero = page.locator('section[role="banner"]');
    await expect(hero.getByTestId("hero-banner")).toBeVisible();
    await expect(hero.getByTestId("hero-cutout")).toBeVisible();
    await expect(hero.getByTestId("hero-mobile-avatar")).toBeHidden();
  });
});

test.describe("About Maryam", () => {
  test("introduces Maryam in Arabic and English and links to the curriculum", async ({
    page,
  }) => {
    seedMaryamDone(page);
    await page.goto("/about", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { level: 1 })).toContainText("مريم");
    await expect(page.getByAltText("مريم — رفيقة رحلتك")).toBeVisible();
    await expect(page.getByText("تلميحات سقراطية", { exact: true })).toBeVisible();
    await expect(page.getByText(/gives Socratic hints/)).toBeVisible();
    await expect(
      page.getByRole("link", { name: /ابدأ التعلم مع مريم|Start learning with Maryam/ })
    ).toHaveAttribute("href", "/curriculum");
  });
});
