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
    id: partial.id ?? `rel-${counter}`,
    v: 2,
    at: at.toISOString(),
    ...partial,
  };
}

const at = (y: number, m: number, d: number, h = 12) => new Date(y, m - 1, d, h);
const TODAY = "2026-11-19";

test("religious completions land in doneReligiousLessonIds, not in doneVideoIds", () => {
  const events = [
    ev({ track: "cpp", type: "lesson_completed", itemId: "cpp-01" }, at(2026, 11, 18)),
    ev(
      { track: "religious", type: "lesson_completed", itemId: "islam-essentials-01" },
      at(2026, 11, 19)
    ),
    ev(
      {
        track: "religious",
        type: "lesson_completed",
        itemId: "contemporary-awareness-01",
        topic: "contemporary-awareness",
      },
      at(2026, 11, 19)
    ),
  ];
  const d = deriveProgress(events, { todayKey: TODAY });
  assert.equal(d.map["cpp-01"], true);
  assert.deepEqual(d.doneVideoIds, []);
  assert.deepEqual(d.doneReligiousLessonIds.sort(), [
    "contemporary-awareness-01",
    "islam-essentials-01",
  ]);
  assert.equal(d.totalCompletions, 3);
  // The legacy map is namespaced for the new track.
  assert.equal(d.map["religious-islam-essentials-01"], true);
  assert.equal(d.map["islam-essentials-01"], undefined);
});

test("religious uncompletion replays over completion (last write wins)", () => {
  const events = [
    ev(
      { track: "religious", type: "lesson_completed", itemId: "islam-essentials-01" },
      at(2026, 11, 18)
    ),
    ev(
      { track: "religious", type: "lesson_uncompleted", itemId: "islam-essentials-01" },
      at(2026, 11, 19)
    ),
  ];
  const d = deriveProgress(events, { todayKey: TODAY });
  assert.deepEqual(d.doneReligiousLessonIds, []);
  assert.equal(d.map["religious-islam-essentials-01"], undefined);
  assert.equal(d.totalCompletions, 0);
});

test("the religious track reports activity and XP like every other track", () => {
  const events = [
    ev(
      { track: "religious", type: "lesson_completed", itemId: "islam-essentials-01" },
      at(2026, 11, 18)
    ),
    ev(
      {
        track: "religious",
        type: "quiz_attempt",
        itemId: "islam-essentials-01",
        topic: "islam-essentials",
        payload: { score: 3, total: 4 },
      },
      at(2026, 11, 19)
    ),
  ];
  const d = deriveProgress(events, { todayKey: TODAY });
  assert.ok(d.lastActivityByTrack.religious?.startsWith("2026-11-19"));
  assert.equal(d.lastActivityByTrack.linux, null);
  assert.ok(d.xp > 0);
  assert.equal(d.quiz.perTopic["islam-essentials"].accuracy, 75);
});
