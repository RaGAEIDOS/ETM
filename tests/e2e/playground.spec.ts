import { test, expect } from "@playwright/test";
import { seedMikuDone } from "./helpers/ui";

test.describe("Playground page", () => {
  test("renders the editor and Run control without crashing", async ({ page }) => {
    seedMikuDone(page);
    await page.goto("/en/playground", { waitUntil: "domcontentloaded" });
    // The C++ editor (react-simple-code-editor) mounts as a textarea.
    await expect(page.locator("textarea").first()).toBeVisible();
    const run = page.getByRole("button", { name: /Run/i }).first();
    await expect(run).toBeVisible();
    await expect(run).not.toBeDisabled();
  });

  test("running C++ reaches either compiled output or a friendly error (Wandbox-dependent)", async ({ page }) => {
    seedMikuDone(page);
    test.setTimeout(90_000);
    await page.goto("/en/playground", { waitUntil: "domcontentloaded" });
    const run = page.getByRole("button", { name: /Run/i }).first();

    // The default source in the editor is a hello world program.
    await run.click();

    // Wandbox is an external service ("saves" are disabled); it may be slow or down.
    // Accept either a full success or the friendly error message, and fail only if the UI hangs.
    const successOrError = page.locator("text=/Could not reach|error|Output|Ran successfully|compiler/i").first();
    await expect(successOrError).toBeVisible({ timeout: 85_000 });
  });
});
