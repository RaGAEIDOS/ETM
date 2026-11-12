import { test } from "node:test";
import assert from "node:assert/strict";
import {
  activityGrid,
  accuracyTrend,
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
    id: partial.id ?? `d-${counter}`,
    v: 2,
    at: at.toISOString(),
    ...partial,
  };
}

const at = (y: number, m: number, d: number, h = 12) => new Date(y, m - 1, d, h);
const TODAY = "2026-11-11";

test("completions fill the legacy map (cpp + elzero- prefixed)", () => {
  const events = [
    ev({ track: "cpp", type: "lesson_completed", itemId: "l1" }, at(2026, 11, 9)),
    ev({ track: "elzero", type: "lesson_completed", itemId: "001" }, at(2026, 11, 10)),
  ];
  const d = deriveProgress(events, { todayKey: TODAY });
  assert.equal(d.map["l1"], true);
  assert.equal(d.map["elzero-001"], true);
  assert.deepEqual(d.doneLessonIds, ["l1"]);
  assert.deepEqual(d.doneVideoIds, ["001"]);
  assert.equal(d.totalCompletions, 2);
});

test("lesson_uncompleted replays over lesson_completed (last write wins)", () => {
  const events = [
    ev({ track: "cpp", type: "lesson_completed", itemId: "l1" }, at(2026, 11, 9, 10)),
    ev({ track: "cpp", type: "lesson_uncompleted", itemId: "l1" }, at(2026, 11, 9, 11)),
  ];
  const d = deriveProgress(events, { todayKey: TODAY });
  assert.equal(d.map["l1"], undefined);
  assert.equal(d.totalCompletions, 0);
});

test("every event-bearing local day counts toward activity, streak and grid", () => {
  const events = [
    ev({ track: "cpp", type: "activity" }, at(2026, 11, 9)),
    ev({ track: "cpp", type: "activity" }, at(2026, 11, 10)),
    ev({ track: "playground", type: "focus_session", payload: { minutes: 20 } }, at(2026, 11, 11)),
  ];
  const d = deriveProgress(events, { todayKey: TODAY });
  assert.deepEqual(d.activityDays, ["2026-11-09", "2026-11-10", "2026-11-11"]);
  assert.equal(d.currentStreak, 3);
  assert.equal(d.longestStreak, 3);
  assert.equal(d.minutesByDay["2026-11-11"], 20);
});

test("current streak starts yesterday when today has no events yet", () => {
  const events = [
    ev({ track: "cpp", type: "activity" }, at(2026, 11, 9)),
    ev({ track: "cpp", type: "activity" }, at(2026, 11, 10)),
  ];
  const d = deriveProgress(events, { todayKey: TODAY });
  assert.equal(d.currentStreak, 2);
});

test("current streak is 0 when neither today nor yesterday have events", () => {
  const events = [ev({ track: "cpp", type: "activity" }, at(2026, 11, 8))];
  const d = deriveProgress(events, { todayKey: TODAY });
  assert.equal(d.currentStreak, 0);
  assert.equal(d.longestStreak, 1);
});

test("longest streak ignores gaps; current streak stops at gaps", () => {
  const events = [
    ev({ track: "cpp", type: "activity" }, at(2026, 11, 1)),
    ev({ track: "cpp", type: "activity" }, at(2026, 11, 2)),
    ev({ track: "cpp", type: "activity" }, at(2026, 11, 3)),
    // gap on 11-04
    ev({ track: "cpp", type: "activity" }, at(2026, 11, 9)),
    ev({ track: "cpp", type: "activity" }, at(2026, 11, 10)),
  ];
  const d = deriveProgress(events, { todayKey: TODAY });
  assert.equal(d.longestStreak, 3);
  assert.equal(d.currentStreak, 2);
});

test("minutesThisWeek and eventsThisWeek only count the trailing 7 days", () => {
  const events = [
    ev({ track: "playground", type: "focus_session", payload: { minutes: 30 } }, at(2026, 11, 11)),
    ev({ track: "playground", type: "focus_session", payload: { minutes: 30 } }, at(2026, 11, 6)),
    ev({ track: "playground", type: "focus_session", payload: { minutes: 30 } }, at(2026, 11, 3)), // 8 days ago — outside
  ];
  const d = deriveProgress(events, { todayKey: TODAY });
  assert.equal(d.minutesThisWeek, 60);
  assert.equal(d.eventsThisWeek, 2);
  assert.equal(d.totalFocusMinutes, 90);
});

test("quiz accuracy aggregates per topic and flags weak topics (>=2 attempts)", () => {
  const q = (topic: string, score: number, total: number, day: number) =>
    ev(
      { track: "cpp", type: "quiz_attempt", topic, payload: { score, total, perQuestion: [] } },
      at(2026, 11, day)
    );
  const events = [
    q("oop", 1, 4, 1),
    q("oop", 2, 4, 2),
    q("oop", 1, 4, 3), // 4/12 = 33%
    q("basics", 4, 4, 1),
    q("basics", 4, 4, 2), // 100%
  ];
  const d = deriveProgress(events, { todayKey: TODAY });
  assert.equal(d.quiz.attempts, 5);
  assert.equal(d.quiz.total, 20);
  assert.equal(d.quiz.correct, 12);
  assert.equal(d.quiz.accuracy, 60);
  assert.equal(d.quiz.perTopic["oop"].accuracy, 33);
  assert.equal(d.weakTopics[0].topic, "oop");
  assert.equal(d.weakTopics.length, 2);
});

test("reviewDue counts only the LATEST attempt per item", () => {
  const events = [
    ev(
      { track: "cpp", type: "quiz_attempt", itemId: "l1", topic: "cpp-basics",
        payload: { score: 0, total: 4, perQuestion: [false, false, false, false] } },
      at(2026, 11, 5, 10)
    ),
    ev(
      { track: "cpp", type: "quiz_attempt", itemId: "l1", topic: "cpp-basics",
        payload: { score: 3, total: 4, perQuestion: [true, true, true, false] } },
      at(2026, 11, 5, 11)
    ),
    // item without perQuestion falls back to score arithmetic
    ev(
      { track: "elzero", type: "quiz_attempt", itemId: "001", topic: "intro",
        payload: { score: 1, total: 2 } },
      at(2026, 11, 6, 10)
    ),
  ];
  const d = deriveProgress(events, { todayKey: TODAY });
  assert.equal(d.reviewDue, 2); // 1 (l1 latest) + 1 (elzero 001)
});

test("lastActivityByTrack reports the newest event per track", () => {
  const events = [
    ev({ track: "cpp", type: "activity" }, at(2026, 11, 1)),
    ev({ track: "elzero", type: "activity" }, at(2026, 11, 7)),
    ev({ track: "cpp", type: "activity" }, at(2026, 11, 5)),
  ];
  const d = deriveProgress(events, { todayKey: TODAY });
  assert.ok(d.lastActivityByTrack.cpp?.startsWith("2026-11-05") || d.lastActivityByTrack.cpp !== null);
  assert.ok(d.lastActivityByTrack.elzero?.startsWith("2026-11-07") || d.lastActivityByTrack.elzero !== null);
  assert.equal(d.lastActivityByTrack.books, null);
});

test("activityGrid returns weeks*7 entries ending today", () => {
  const grid = activityGrid(["2026-11-11", "2026-10-30"], TODAY, 2);
  assert.equal(grid.length, 14);
  assert.equal(grid[grid.length - 1].key, TODAY);
  assert.equal(grid[grid.length - 1].count, 1);
  assert.equal(grid.filter((g) => g.count === 1).length, 2);
});

test("accuracyTrend buckets quiz attempts per week, null when none", () => {
  const events = [
    ev({ track: "cpp", type: "quiz_attempt", payload: { score: 4, total: 4 } }, at(2026, 11, 11)),
    ev({ track: "cpp", type: "quiz_attempt", payload: { score: 0, total: 4 } }, at(2026, 11, 10)),
  ];
  const trend = accuracyTrend(events, TODAY, 8);
  assert.equal(trend.length, 8);
  const last = trend[trend.length - 1];
  assert.equal(last.accuracy, 50); // (4+0) / (4+4)
  assert.equal(trend[0].accuracy, null); // nothing that far back
});

test("xp and level accumulate across mixed events", () => {
  const events = [
    ev({ track: "cpp", type: "lesson_completed", itemId: "l1" }, at(2026, 11, 10)), // 10
    ev({ track: "cpp", type: "quiz_attempt", payload: { score: 2, total: 2 } }, at(2026, 11, 10)), // 17
    ev({ track: "playground", type: "focus_session", payload: { minutes: 30 } }, at(2026, 11, 11)), // 30
  ];
  const d = deriveProgress(events, { todayKey: TODAY });
  assert.equal(d.xp, 57);
  assert.equal(d.level, 1);
  assert.equal(d.xpThisWeek, 57);
});
