import { test } from "node:test";
import assert from "node:assert/strict";
import {
  deriveProgress,
  type ProgressEvent,
} from "../../lib/progress/core.ts";

let counter = 0;
function ev(
  partial: Partial<ProgressEvent> & Pick<ProgressEvent, "track" | "type">,
  at: Date
): ProgressEvent {
  counter += 1;
  return {
    id: partial.id ?? `ew-${counter}`,
    v: 2,
    at: at.toISOString(),
    ...partial,
  };
}

const at = (y: number, m: number, d: number, h = 12) => new Date(y, m - 1, d, h);
const TODAY = "2026-11-11";

test("elzero-web completions land in doneElzeroWebVideoIds, not doneVideoIds", () => {
  const events = [
    ev({ track: "elzero", type: "lesson_completed", itemId: "001" }, at(2026, 11, 9)),
    ev({ track: "elzero-web", type: "lesson_completed", itemId: "html-001", topic: "html" }, at(2026, 11, 10)),
    ev({ track: "elzero-web", type: "lesson_completed", itemId: "js-042", topic: "javascript" }, at(2026, 11, 11)),
  ];
  const d = deriveProgress(events, { todayKey: TODAY });
  assert.deepEqual(d.doneVideoIds, ["001"]);
  assert.deepEqual(d.doneElzeroWebVideoIds.sort(), ["html-001", "js-042"]);
  assert.equal(d.totalCompletions, 3);
  // The legacy "map" must stay untouched by elzero-web completions.
  assert.equal(d.map["html-001"], undefined);
});

test("elzero-web uncompletion replays over completion (last write wins)", () => {
  const events = [
    ev({ track: "elzero-web", type: "lesson_completed", itemId: "css-010" }, at(2026, 11, 9)),
    ev({ track: "elzero-web", type: "lesson_uncompleted", itemId: "css-010" }, at(2026, 11, 11)),
  ];
  const d = deriveProgress(events, { todayKey: TODAY });
  assert.deepEqual(d.doneElzeroWebVideoIds, []);
  assert.equal(d.totalCompletions, 0);
});

test("elzero-web quiz attempts aggregate under the topic (course id) for weak-topic stats", () => {
  const events = [
    ev({ track: "elzero-web", type: "quiz_attempt", itemId: "html-001", topic: "html", payload: { score: 3, total: 4 } }, at(2026, 11, 10)),
    ev({ track: "elzero-web", type: "quiz_attempt", itemId: "html-002", topic: "html", payload: { score: 4, total: 4 } }, at(2026, 11, 11)),
  ];
  const d = deriveProgress(events, { todayKey: TODAY });
  assert.equal(d.quiz.attempts, 2);
  assert.equal(d.quiz.perTopic.html.attempts, 2);
  assert.equal(d.quiz.perTopic.html.correct, 7);
  assert.equal(d.quiz.perTopic.html.total, 8);
  assert.equal(d.quiz.perTopic.html.accuracy, 88);
});
