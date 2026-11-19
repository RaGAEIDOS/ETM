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
    lessons: 17,
  },
  {
    id: "contemporary-awareness",
    title: "سلسلة تأسيس وعي المسلم المعاصر",
    instructor: "د. أيمن عبد الرحيم",
    category: "الوعي المعاصر",
    cover: "/courses/contemporary-awareness.svg",
    lessons: 17,
  },
] as const;

test.describe("Islamic Studies hub", () => {
  test("Arabic hub lists both complete courses with instructor and cover", async ({ page }) => {
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

    // The track is complete now: 34 lectures and 4 attached PDFs.
    await expect(page.getByText("34 محاضرة كاملة").first()).toBeVisible();
    await expect(page.getByText("4 ملفات PDF").first()).toBeVisible();
    await expect(page.getByText("قيد الإعداد")).toHaveCount(0);

    // Still no YouTube iframe before a learner clicks a lesson.
    await expect(page.locator("main iframe")).toHaveCount(0);

    const firstLesson = page.locator(`a[href="/islamic-studies/islam-essentials-01"]`).first();
    await expect(firstLesson).toBeVisible();
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
    await expect(page.getByText("34 complete lectures").first()).toBeVisible();
  });
});

test.describe("Islamic Studies course pages", () => {
  test("islam-essentials lists all 17 lectures and the official book link", async ({ page }) => {
    await page.goto("/islamic-studies/course/islam-essentials", { waitUntil: "domcontentloaded" });
    await waitHydrated(page);

    await expect(
      page.getByRole("heading", { level: 1, name: "ما لا يسع المسلم جهله" })
    ).toBeVisible();
    await expect(page.getByText("د. سامح الجنداوي").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "المحاضرات" })).toBeVisible();
    await expect(page.getByText("17 دروس").first()).toBeVisible();
    await expect(page.getByText("مصادر الدورة")).toBeVisible();
    await expect(page.getByText("مصادر موثّقة")).toBeVisible();

    for (let i = 1; i <= 17; i += 1) {
      const href = `/islamic-studies/islam-essentials-${String(i).padStart(2, "0")}`;
      await expect(page.locator(`a[href="${href}"]`).first()).toBeVisible();
    }

    const book = page.locator('a[href="https://t.me/samehelgendawey/1196"]');
    await expect(book).toBeVisible();
    await expect(
      page
        .locator(
          'a[href="https://www.youtube.com/playlist?list=PLiICC_-DcP0QZ1hBiSqtW_u9OnKyD6w7i"]'
        )
        .first()
    ).toBeVisible();

    const image = page.locator('img[src="/courses/islam-essentials.svg"]');
    await expect(image).toBeVisible();
    const loaded = await image.evaluate(
      (img) => (img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth > 0
    );
    expect(loaded, "course cover decoded").toBe(true);

    await expect(page.locator("main iframe")).toHaveCount(0);
  });

  test("contemporary-awareness lists both levels and the three attached PDFs", async ({ page }) => {
    await page.goto("/islamic-studies/course/contemporary-awareness", {
      waitUntil: "domcontentloaded",
    });
    await waitHydrated(page);

    await expect(
      page.getByRole("heading", { level: 1, name: "سلسلة تأسيس وعي المسلم المعاصر" })
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "المستوى الأول" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "المستوى الثاني" })).toBeVisible();
    await expect(page.getByText("17 دروس").first()).toBeVisible();

    await expect(
      page.locator('a[href="/religious/contemporary-awareness-level1-summary.pdf"]')
    ).toBeVisible();
    await expect(
      page.locator('a[href="/religious/contemporary-awareness-terms.pdf"]')
    ).toBeVisible();
    await expect(
      page.locator('a[href="/religious/contemporary-awareness-level2-summary.pdf"]')
    ).toBeVisible();

    for (let i = 1; i <= 17; i += 1) {
      const href = `/islamic-studies/contemporary-awareness-${String(i).padStart(2, "0")}`;
      await expect(page.locator(`a[href="${href}"]`).first()).toBeVisible();
    }

    await expect(page.locator("main iframe")).toHaveCount(0);
  });

  test("the English course page works and keeps the section link locale-aware", async ({ page }) => {
    await page.goto("/en/islamic-studies/course/islam-essentials", {
      waitUntil: "domcontentloaded",
    });
    await waitHydrated(page);

    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "What a Muslim Cannot Afford to Ignore"
    );
    await expect(page.getByText("Verified sources")).toBeVisible();

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

  test("attached PDFs are served as application/pdf", async ({ request }) => {
    const pdfs = [
      "/religious/contemporary-awareness-level1-summary.pdf",
      "/religious/contemporary-awareness-terms.pdf",
      "/religious/contemporary-awareness-level2-summary.pdf",
    ];
    for (const pdf of pdfs) {
      const response = await request.head(pdf);
      expect(response.status(), pdf).toBe(200);
      expect(response.headers()["content-type"], pdf).toContain("application/pdf");
    }
  });
});

test.describe("Islamic Studies lesson pages", () => {
  test("islam-essentials-01 shows the click-to-load player and lecture navigation", async ({ page }) => {
    await page.goto("/islamic-studies/islam-essentials-01", { waitUntil: "domcontentloaded" });
    await waitHydrated(page);

    await expect(
      page.getByRole("heading", { level: 1, name: "المحاضرة الأولى" })
    ).toBeVisible();
    await expect(page.getByText("الدرس 1 من 17")).toBeVisible();
    await expect(page.getByText("23:34").first()).toBeVisible();
    await expect(page.getByRole("button", { name: /شغّل المحاضرة/ })).toBeVisible();
    await expect(page.locator("main iframe")).toHaveCount(0);

    const watch = page.locator('a[href="https://www.youtube.com/watch?v=XT85mB1592E"]');
    await expect(watch).toBeVisible();
    await expect(
      page.locator(
        'a[href="https://www.youtube.com/playlist?list=PLiICC_-DcP0QZ1hBiSqtW_u9OnKyD6w7i"]'
      ).first()
    ).toBeVisible();
    await expect(
      page.locator('a[href="https://t.me/samehelgendawey/1196"]')
    ).toBeVisible();

    const next = page.getByRole("link", { name: "الدرس التالي" });
    await expect(next).toHaveAttribute("href", "/islamic-studies/islam-essentials-02");
  });

  test("level-2 lecture shows its own summary PDF and level playlist", async ({ page }) => {
    await page.goto("/islamic-studies/contemporary-awareness-10", {
      waitUntil: "domcontentloaded",
    });
    await waitHydrated(page);

    await expect(
      page.getByRole("heading", { level: 1, name: "المحاضرة الأولى" })
    ).toBeVisible();
    await expect(page.getByText("المستوى الثاني").first()).toBeVisible();
    await expect(
      page.locator('a[href="/religious/contemporary-awareness-level2-summary.pdf"]')
    ).toBeVisible();
    await expect(
      page.locator(
        'a[href="https://www.youtube.com/playlist?list=PL9hkk6GeaGBeMbSVTmPIKsEmrDKNU49cK"]'
      ).first()
    ).toBeVisible();
    await expect(
      page.locator('a[href="https://www.youtube.com/watch?v=f_8omvN42K4"]')
    ).toBeVisible();
  });

  test("unknown lesson ids render the 404 page", async ({ page }) => {
    const response = await page.goto("/islamic-studies/islam-essentials-99", {
      waitUntil: "domcontentloaded",
    });
    expect(response?.status()).toBe(404);
  });
});

test.describe("Islamic Studies navigation and discovery", () => {
  test("the header Courses menu links to the new section", async ({ page, isMobile }) => {
    test.skip(isMobile, "the desktop header dropdown is replaced by the mobile menu");
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
    await expect(band.getByText(/المنهجان كاملان الآن/)).toBeVisible();

    await band.getByRole("link", { name: /كل الكورسات الدينية/ }).click();
    await expect(page).toHaveURL(/\/islamic-studies$/);
  });

  test("key religious pages fit a phone width without horizontal scrolling", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const paths = [
      "/islamic-studies",
      "/islamic-studies/course/islam-essentials",
      "/islamic-studies/course/contemporary-awareness",
      "/islamic-studies/islam-essentials-01",
      "/islamic-studies/contemporary-awareness-10",
      "/en/islamic-studies/course/contemporary-awareness",
    ];

    for (const path of paths) {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      await waitHydrated(page);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(overflow, `${path} horizontal overflow`).toBeLessThanOrEqual(1);
    }
  });

  test("the sitemap lists the hub, both courses and their lectures", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
    const xml = await response.text();
    expect(xml).toContain("/islamic-studies");
    for (const course of AR_COURSES) {
      expect(xml).toContain(`/islamic-studies/course/${course.id}`);
    }
    expect(xml).toContain("/islamic-studies/islam-essentials-17");
    expect(xml).toContain("/islamic-studies/contemporary-awareness-17");
  });
});
