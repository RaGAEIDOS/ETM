import { test } from "node:test";
import assert from "node:assert/strict";
import { latestBookProgress, type ProgressEvent } from "../../lib/progress/core.ts";

function event(overrides: Partial<ProgressEvent>): ProgressEvent {
  return {
    id: Math.random().toString(36).slice(2),
    v: 2,
    track: "books",
    type: "book_progress",
    at: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

test("latestBookProgress returns null when the book has no bookmark", () => {
  assert.equal(latestBookProgress([], "dopamine-nation"), null);
  assert.equal(
    latestBookProgress(
      [event({ itemId: "other-book", payload: { page: 4, total: 10 } })],
      "dopamine-nation"
    ),
    null
  );
});

test("latestBookProgress returns the newest valid page for the book", () => {
  const events = [
    event({ itemId: "dopamine-nation", payload: { page: 12, total: 309 }, at: "2026-01-02T00:00:00.000Z" }),
    event({ itemId: "48-laws", payload: { page: 99, total: 454 } }),
    event({ itemId: "dopamine-nation", payload: { page: 3, total: 309 }, at: "2026-01-01T00:00:00.000Z" }),
  ];
  assert.deepEqual(latestBookProgress(events, "dopamine-nation"), {
    page: 12,
    total: 309,
    at: "2026-01-02T00:00:00.000Z",
  });
});

test("latestBookProgress skips invalid payloads and other event types", () => {
  const events = [
    event({ itemId: "dopamine-nation", payload: { page: 20, total: 309 }, at: "2026-01-01T00:00:00.000Z" }),
    event({ itemId: "dopamine-nation", payload: { page: 0, total: 309 }, at: "2026-01-02T00:00:00.000Z" }),
    event({ itemId: "dopamine-nation", type: "book_status", payload: { status: "reading" }, at: "2026-01-03T00:00:00.000Z" }),
    event({ itemId: "dopamine-nation", track: "cpp", payload: { page: 99, total: 309 }, at: "2026-01-04T00:00:00.000Z" }),
  ];
  assert.equal(latestBookProgress(events, "dopamine-nation")?.page, 20);
});
