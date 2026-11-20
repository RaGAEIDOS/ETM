import { test, expect, type Page } from "@playwright/test";
import { seedMaryamDone, waitHydrated } from "./helpers/ui";

const WIDGET_ID = "etm-pomodoro-lofi";
const PRIMARY_ID = "rFZHOHl-L8A";
const FALLBACK_ID = "JD-kMIpDfnY";
const EMBED_ROUTE = "https://www.youtube-nocookie.com/embed/**";

/**
 * Minimal stand-in for the youtube-nocookie.com embed. It speaks the public
 * postMessage widget protocol: answer `listening` with `onReady`, then report
 * `infoDelivery` after every command. The tests can inspect `window.__state`
 * inside the frame to verify the commands the component actually sent.
 */
function stubEmbed({ fail = false }: { fail?: boolean } = {}): string {
  return `<!doctype html>
<html>
  <body style="margin:0;background:#000">
    <script>
      (() => {
        const ID = ${JSON.stringify(WIDGET_ID)};
        const FAIL = ${fail ? "true" : "false"};
        let playerState = -1;
        let volume = 100;
        window.__state = { playerState, volume, commands: [] };
        const send = (event, info) => {
          parent.postMessage(
            JSON.stringify({ event, info, channel: "widget", id: ID }),
            "*"
          );
        };
        window.addEventListener("message", (event) => {
          if (typeof event.data !== "string") return;
          let data;
          try { data = JSON.parse(event.data); } catch { return; }
          if (!data || data.channel !== "widget") return;
          if (data.event === "listening") {
            if (FAIL) { send("onError", 150); return; }
            send("onReady", null);
            return;
          }
          if (data.event !== "command" || FAIL) return;
          window.__state.commands.push(data.func);
          if (data.func === "playVideo") playerState = 1;
          else if (data.func === "pauseVideo") playerState = 2;
          else if (data.func === "setVolume") volume = data.args[0];
          window.__state.playerState = playerState;
          window.__state.volume = volume;
          send("infoDelivery", {
            playerState,
            volume,
            muted: false,
            videoData: {
              video_id: location.pathname.split("/").pop(),
              isPlayable: true,
              errorCode: null,
            },
          });
        });
      })();
    </script>
  </body>
</html>`;
}

async function openPomodoro(page: Page): Promise<void> {
  await page.goto("/en/landing", { waitUntil: "domcontentloaded" });
  await waitHydrated(page);
  await page.locator('button[aria-label*="Pomodoro"]').click();
  await expect(page.getByText("Focus music", { exact: true })).toBeVisible();
}

async function chooseLofi(page: Page): Promise<void> {
  await page.getByRole("button", { name: "Lofi Girl", exact: true }).click();
}

async function embedFrame(page: Page) {
  await expect
    .poll(
      () =>
        page
          .frames()
          .filter((candidate) =>
            candidate.url().includes("youtube-nocookie.com/embed/")
          ).length,
      { message: "embed frame is present" }
    )
    .toBeGreaterThan(0);
  const frame = page
    .frames()
    .find((candidate) => candidate.url().includes("youtube-nocookie.com/embed/"));
  expect(frame, "embed frame is present").toBeTruthy();
  return frame!;
}

test.beforeEach(async ({ page }) => {
  seedMaryamDone(page);
});

test("lofi loads nothing before the click, then embeds the official stream", async ({
  page,
}) => {
  const embedRequests: string[] = [];
  await page.route(EMBED_ROUTE, async (route) => {
    embedRequests.push(route.request().url());
    await route.fulfill({
      status: 200,
      contentType: "text/html; charset=utf-8",
      body: stubEmbed(),
    });
  });

  await openPomodoro(page);
  await chooseLofi(page);

  const iframe = page.getByTestId("lofi-iframe");
  await expect(iframe).toHaveCount(0);
  expect(embedRequests, "no YouTube request before the facade click").toHaveLength(
    0
  );

  await page.getByRole("button", { name: "Play Lofi Girl" }).click();
  await expect(iframe).toHaveCount(1);
  const src = (await iframe.getAttribute("src")) ?? "";
  expect(src).toContain(`youtube-nocookie.com/embed/${PRIMARY_ID}`);
  expect(src).toContain("enablejsapi=1");
  expect(src).toContain("autoplay=0");
  expect(src).toContain("origin=http%3A%2F%2Flocalhost%3A3100");
  expect(embedRequests).toHaveLength(1);
});

test("the embed handshake drives play, pause and volume", async ({ page }) => {
  await page.route(EMBED_ROUTE, (route) =>
    route.fulfill({
      status: 200,
      contentType: "text/html; charset=utf-8",
      body: stubEmbed(),
    })
  );

  await openPomodoro(page);
  await chooseLofi(page);
  await page.getByRole("button", { name: "Play Lofi Girl" }).click();

  const toggle = page.getByTestId("lofi-toggle");
  await expect(toggle).toBeEnabled();
  await expect(toggle).toHaveText("Pause");

  const frame = await embedFrame(page);
  await expect
    .poll(() => frame.evaluate(() => window.__state?.commands ?? []))
    .toContain("playVideo");
  await expect
    .poll(() => frame.evaluate(() => window.__state?.volume ?? null))
    .toBe(30);

  await toggle.click();
  await expect(toggle).toHaveText("Play");
  await expect
    .poll(() => frame.evaluate(() => window.__state?.commands ?? []))
    .toContain("pauseVideo");
});

test("music follows the timer: focus plays and a break pauses", async ({
  page,
}) => {
  await page.route(EMBED_ROUTE, (route) =>
    route.fulfill({
      status: 200,
      contentType: "text/html; charset=utf-8",
      body: stubEmbed(),
    })
  );

  await openPomodoro(page);
  await chooseLofi(page);
  await page.getByRole("button", { name: "Play Lofi Girl" }).click();

  const toggle = page.getByTestId("lofi-toggle");
  await expect(toggle).toBeEnabled();
  const frame = await embedFrame(page);
  await expect
    .poll(() => frame.evaluate(() => window.__state?.commands ?? []))
    .toContain("playVideo");

  await frame.evaluate(() => {
    window.__state!.commands = [];
  });
  await page.getByRole("button", { name: "Short Break", exact: true }).click();
  await expect(toggle).toHaveText("Play");
  await expect
    .poll(() => frame.evaluate(() => window.__state?.commands ?? []))
    .toContain("pauseVideo");

  await frame.evaluate(() => {
    window.__state!.commands = [];
  });
  await page.getByRole("button", { name: "Focus", exact: true }).click();
  await expect(toggle).toHaveText("Pause");
  await expect
    .poll(() => frame.evaluate(() => window.__state?.commands ?? []))
    .toContain("playVideo");
});

test("quiz mute pauses playback while a quiz is visible", async ({ page }) => {
  await page.route(EMBED_ROUTE, (route) =>
    route.fulfill({
      status: 200,
      contentType: "text/html; charset=utf-8",
      body: stubEmbed(),
    })
  );

  await openPomodoro(page);
  await chooseLofi(page);
  await page.getByRole("button", { name: "Play Lofi Girl" }).click();

  const frame = await embedFrame(page);
  await expect
    .poll(() => frame.evaluate(() => window.__state?.commands ?? []))
    .toContain("playVideo");

  await frame.evaluate(() => {
    window.__state!.commands = [];
  });
  await page.evaluate(() => {
    const quiz = document.createElement("div");
    quiz.id = "e2e-quiz";
    quiz.setAttribute("data-quiz", "");
    quiz.style.cssText =
      "position:fixed;top:0;left:0;width:120px;height:120px;z-index:9999";
    document.body.appendChild(quiz);
    window.dispatchEvent(new Event("scroll"));
  });
  await expect(
    page.getByText("Paused for the quiz", { exact: true })
  ).toBeVisible();
  await expect
    .poll(() => frame.evaluate(() => window.__state?.commands ?? []))
    .toContain("pauseVideo");

  await frame.evaluate(() => {
    window.__state!.commands = [];
  });
  await page.evaluate(() => {
    document.getElementById("e2e-quiz")?.remove();
    window.dispatchEvent(new Event("scroll"));
  });
  await expect
    .poll(() => frame.evaluate(() => window.__state?.commands ?? []))
    .toContain("playVideo");
});

test("a blocked embed host retries the same stream on www.youtube.com", async ({
  page,
}) => {
  await page.route("https://www.youtube-nocookie.com/embed/**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "text/html; charset=utf-8",
      body: "<!doctype html><html><body>blocked</body></html>",
    })
  );
  await page.route("https://www.youtube.com/embed/**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "text/html; charset=utf-8",
      body: stubEmbed(),
    })
  );

  await openPomodoro(page);
  await chooseLofi(page);
  await page.getByRole("button", { name: "Play Lofi Girl" }).click();

  const iframe = page.getByTestId("lofi-iframe");
  await expect
    .poll(async () => (await iframe.getAttribute("src")) ?? "", {
      timeout: 25_000,
    })
    .toContain(`https://www.youtube.com/embed/${PRIMARY_ID}`);

  const toggle = page.getByTestId("lofi-toggle");
  await expect(toggle).toBeEnabled();
  await expect(toggle).toHaveText("Pause");
});

test("a dead primary stream falls back to the next official stream", async ({
  page,
}) => {
  await page.route(EMBED_ROUTE, (route) => {
    const id = new URL(route.request().url()).pathname.split("/").pop();
    return route.fulfill({
      status: 200,
      contentType: "text/html; charset=utf-8",
      body: stubEmbed({ fail: id === PRIMARY_ID }),
    });
  });

  await openPomodoro(page);
  await chooseLofi(page);
  await page.getByRole("button", { name: "Play Lofi Girl" }).click();

  const iframe = page.getByTestId("lofi-iframe");
  await expect
    .poll(async () => {
      const count = await iframe.count();
      return count ? ((await iframe.getAttribute("src")) ?? "") : "";
    })
    .toContain(`/embed/${FALLBACK_ID}`);

  const toggle = page.getByTestId("lofi-toggle");
  await expect(toggle).toBeEnabled();
  await expect(toggle).toHaveText("Pause");
});

declare global {
  interface Window {
    __state?: {
      playerState: number;
      volume: number;
      commands: string[];
    };
  }
}
