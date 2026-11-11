import { test, expect } from "@playwright/test";
import { seedMikuDone } from "./helpers/ui";

test.describe("Free Books page", () => {
  test("loads with the Free Books content and links", async ({ page }) => {
    seedMikuDone(page);
    await page.goto("/books", { waitUntil: "domcontentloaded" });
    await expect(page.locator("text=Operating Systems: Three Easy Pieces").first()).toBeVisible();

    const link = page.getByRole("link", { name: "Operating Systems: Three Easy Pieces (OSTEP)" }).first();
    expect(await link.getAttribute("href")).toContain("cs.wisc.edu");
  });

  test("no references to removed commercial books appear", async ({ page }) => {
    seedMikuDone(page);
    await page.goto("/books", { waitUntil: "domcontentloaded" });
    // Spot-check known commercial-only titles that must NOT be in a legally-free library.
    for (const removed of [
      "C++ Primer (5th Edition)",
      "Effective Modern C++",
      "The Pragmatic Programmer",
    ]) {
      await expect(page.locator(`text=${removed}`)).toHaveCount(0);
    }
  });
});
