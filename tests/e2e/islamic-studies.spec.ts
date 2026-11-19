import { test, expect } from "@playwright/test";
import { seedMaryamDone, waitHydrated } from "./helpers/ui";

// The onboarding tour is a full-screen modal that intercepts pointer events.
test.beforeEach(async ({ page }) => {
  seedMaryamDone(page);
});

const AR_COURSES = [
  {
    id: "islam-essentials",
    title: "ما لا يسع المسلم جهله",
    instructor: "د. سامح الجنداوي",
    category: "أساسيات الدين",
    cover: "/courses/islam-essentials.svg",
  },
  {
    id: "contemporary-awareness",
    title: "سلسلة تأسيس وعي المسلم المعاصر",
    instructor: "د. أيمن عبد الرحيم",
    category: "الوعي المعاصر",
    cover: "/courses/contemporary-awareness.svg",
  },
] as const;

test.describe("Islamic Studies hub", () => {
  test("Arabic hub lists both requested courses with instructor and cover", async ({ page }) => {
    await page.goto("/islamic-studies", { waitUntil: "domcontentloaded" });
    await waitHydrated(page);

    await expect(page.getByRole("heading", { level: 1 })).toContainText("الدينية");
    const cards = page.locator("article");
    await expect(cards).toHaveCount(2);

    for (const course of AR_COURSES) {
      await expect(page.getByRole("heading", { name: course.title })).toBeVisible();
      await expect(page.getByText(course.instructor).first()).toBeVisible();
      const image = page.locator(`img[src="${course.cover}"]`).first();
      await expect(image).toBeVisible();
      const loaded = await image.evaluate(
        (img) => (img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth > 0
      );
      expect(loaded, `${course.id} cover decoded`).toBe(true);
    }

    // Honest empty state: no fake lessons or embeds inside the page content.
    const main = page.locator("main");
    await expect(main.locator("iframe")).toHaveCount(0);
    await expect(page.getByText("الدروس قيد الإعداد").first()).toBeVisible();
  });

  test("search narrows the cards by course or instructor", async ({ page }) => {
    await page.goto("/islamic-studies", { waitUntil: "domcontentloaded" });
    await waitHydrated(page);
    const input = page.locator("#religious-course-search");

    await input.fill("أيمن");
    await expect(page.locator("article")).toHaveCount(1);
    await expect(page.getByRole("heading", { name: AR_COURSES[1].title })).toBeVisible();

    await input.fill("what a muslim");
    await expect(page.locator("article")).toHaveCount(1);
    await expect(page.getByRole("heading", { name: AR_COURSES[0].title })).toBeVisible();

    await input.fill("شيء غير موجود");
    await expect(page.locator("article")).toHaveCount(0);
    await expect(page.getByText(/لا توجد دورة تطابق بحثك/)).toBeVisible();

    await page.getByRole("button", { name: "مسح البحث" }).click();
    await expect(page.locator("article")).toHaveCount(2);
  });

  test("category chips filter the catalogue", async ({ page }) => {
    await page.goto("/islamic-studies", { waitUntil: "domcontentloaded" });
    await waitHydrated(page);

    await page.getByRole("button", { name: AR_COURSES[0].category, exact: true }).click();
    await expect(page.locator("article")).toHaveCount(1);
    await expect(page.getByRole("heading", { name: AR_COURSES[0].title })).toBeVisible();

    await page.getByRole("button", { name: "الكل", exact: true }).click();
    await expect(page.locator("article")).toHaveCount(2);
  });

  test("English hub is fully localized", async ({ page }) => {
    await page.goto("/en/islamic-studies", { waitUntil: "domcontentloaded" });
    await waitHydrated(page);

    await expect(page.getByRole("heading", { level: 1 })).toContainText("Religious");
    await expect(page.getByRole("heading", { name: "What a Muslim Cannot Afford to Ignore" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Building the Contemporary Muslim's Awareness" })).toBeVisible();
    await expect(page.getByText("Dr. Sameh El-Gendawy").first()).toBeVisible();
    await expect(page.getByText("Dr. Ayman Abdel-Rahman").first()).toBeVisible();
  });
});

test.describe("Islamic Studies course pages", () => {
  for (const course of AR_COURSES) {
    test(`${course.id} has a standalone page with instructor and honest lesson state`, async ({ page }) => {
      await page.goto(`/islamic-studies/course/${course.id}`, { waitUntil: "domcontentloaded" });
      await waitHydrated(page);

      await expect(page.getByRole("heading", { level: 1, name: course.title })).toBeVisible();
      await expect(page.getByText(course.instructor).first()).toBeVisible();
      await expect(page.getByText("المنهج قيد الإعداد").first()).toBeVisible();
      await expect(page.getByText("المصدر الرسمي فقط")).toBeVisible();
      const main = page.locator("main");
      await expect(main.locator("iframe")).toHaveCount(0);
      await expect(
        main.locator('a[href*="youtube.com"], a[href*="youtu.be"]')
      ).toHaveCount(0);

      const image = page.locator(`img[src="${course.cover}"]`);
      await expect(image).toBeVisible();
      const loaded = await image.evaluate(
        (img) => (img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth > 0
      );
      expect(loaded, `${course.id} cover decoded`).toBe(true);
    });
  }

  test("the English course page works and keeps the section link locale-aware", async ({ page }) => {
    await page.goto("/en/islamic-studies/course/islam-essentials", {
      waitUntil: "domcontentloaded",
    });
    await waitHydrated(page);

    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "What a Muslim Cannot Afford to Ignore"
    );
    await expect(page.getByText("Official source only")).toBeVisible();

    const back = page.getByRole("link", { name: /Back to religious courses/i });
    await expect(back).toHaveAttribute("href", "/en/islamic-studies");
    await back.click();
    await expect(page).toHaveURL(/\/en\/islamic-studies$/);
    // Regression guard for the double-prefix bug: never /en/en/...
    await expect(page).not.toHaveURL(/\/en\/en\//);
  });

  test("course card links stay inside the active locale", async ({ page }) => {
    await page.goto("/en/islamic-studies", { waitUntil: "domcontentloaded" });
    await waitHydrated(page);

    const hrefs = await page
      .locator('a[href*="/islamic-studies/course/"]')
      .evaluateAll((links) => links.map((link) => link.getAttribute("href") ?? ""));
    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) {
      expect(href, "no duplicated locale prefix").not.toContain("/en/en/");
      expect(href.startsWith("/en/islamic-studies/course/")).toBe(true);
    }
  });

  test("unknown course ids render the 404 page", async ({ page }) => {
    const response = await page.goto("/islamic-studies/course/not-a-course", {
      waitUntil: "domcontentloaded",
    });
    expect(response?.status()).toBe(404);
  });
});

test.describe("Islamic Studies navigation and discovery", () => {
  test("the header Courses menu links to the new section", async ({ page }) => {
    // NB: `/` redirects guests to `/landing`, whose header is deliberately bare.
    await page.goto("/curriculum", { waitUntil: "domcontentloaded" });
    await waitHydrated(page);

    await page.getByRole("button", { name: "الدورات", exact: true }).first().click();
    const item = page.getByRole("menuitem", { name: "الدورات الدينية" });
    await expect(item).toBeVisible();
    await item.click();
    await expect(page).toHaveURL(/\/islamic-studies$/);
  });

  test("the home/landing band shows both courses and leads to the hub", async ({ page }) => {
    await page.goto("/landing", { waitUntil: "domcontentloaded" });
    await waitHydrated(page);

    const band = page.locator('section[aria-labelledby="religious-courses-title"]');
    await expect(band).toBeVisible();
    await expect(band.getByRole("heading", { name: "كورسات دينية" })).toBeVisible();
    await expect(band.getByRole("heading", { name: AR_COURSES[0].title })).toBeVisible();
    await expect(band.getByRole("heading", { name: AR_COURSES[1].title })).toBeVisible();

    await band.getByRole("link", { name: /كل الكورسات الدينية/ }).click();
    await expect(page).toHaveURL(/\/islamic-studies$/);
  });

  test("the sitemap lists the hub and both course pages", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
    const xml = await response.text();
    expect(xml).toContain("/islamic-studies");
    for (const course of AR_COURSES) {
      expect(xml).toContain(`/islamic-studies/course/${course.id}`);
    }
  });
});
