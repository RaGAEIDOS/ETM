import { test } from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_DAILY_GOAL_MINUTES,
  diffDayKeys,
  dayKeyOf,
  deriveProgress,
  emptyProgressFile,
  levelForXp,
  localDayKey,
  mergeEvents,
  migrateLegacy,
  parseProgressFile,
  serializeProgressFile,
  shiftDayKey,
  xpForEvent,
  type ProgressEvent,
} from "../../lib/progress/core.ts";

let counter = 0;
function ev(
  partial: Partial<ProgressEvent> & Pick<ProgressEvent, "track" | "type">,
  at: Date
): ProgressEvent {
  counter += 1;
  return {
    id: partial.id ?? `test-${counter}`,
    v: 2,
    at: at.toISOString(),
    ...partial,
  };
}

const at = (y: number, m: number, d: number, h = 12) => new Date(y, m - 1, d, h);

// ---------------- local-day helpers ----------------

test("localDayKey round-trips a local Date regardless of machine timezone", () => {
  assert.equal(localDayKey(new Date(2026, 0, 15, 12)), "2026-01-15");
  assert.equal(localDayKey(new Date(2026, 11, 31, 23, 59)), "2026-12-31");
});

test("dayKeyOf parses ISO instants onto their LOCAL day (not UTC slice)", () => {
  const local = new Date(2026, 5, 10, 23, 30);
  assert.equal(dayKeyOf(local.toISOString()), localDayKey(local));
});

test("dayKeyOf rejects garbage", () => {
  assert.equal(dayKeyOf("not-a-date"), null);
});

test("diffDayKeys counts whole days across month boundaries", () => {
  assert.equal(diffDayKeys("2026-01-31", "2026-02-02"), 2);
  assert.equal(diffDayKeys("2026-03-01", "2026-02-28"), -1);
  assert.equal(diffDayKeys("2026-11-11", "2026-11-11"), 0);
});

test("shiftDayKey walks backwards/forwards across month ends", () => {
  assert.equal(shiftDayKey("2026-03-01", -1), "2026-02-28");
  assert.equal(shiftDayKey("2026-12-31", 1), "2027-01-01");
});

// ---------------- migration ----------------

test("migrateLegacy synthesizes v2 events from the legacy layout", () => {
  const events = migrateLegacy({
    map: { "basics-l1": true, "elzero-001": true, "ignored-false": false },
    activityDays: ["2026-11-01", "not-a-day", "2026-11-03"],
    focusLog: { "2026-11-01": 25, "nope": 10, "2026-11-02": 0 },
  });
  const cppDone = events.find((e) => e.track === "cpp" && e.type === "lesson_completed");
  const videoDone = events.find((e) => e.track === "elzero" && e.type === "lesson_completed");
  assert.equal(cppDone?.itemId, "basics-l1");
  assert.equal(videoDone?.itemId, "001");
  assert.equal(events.filter((e) => e.type === "activity").length, 2);
  const focus = events.find((e) => e.type === "focus_session");
  assert.equal(focus?.payload?.minutes, 25);
  assert.ok(events.every((e) => e.v === 2 && e.migrated === true));
});

test("migrateLegacy with empty input produces an empty list (reversible, lossless)", () => {
  assert.deepEqual(migrateLegacy({}), []);
});

test("migration preserves legacy completion meaning in the derived map", () => {
  const events = migrateLegacy({ map: { "l-1": true, "elzero-042": true } });
  const derived = deriveProgress(events);
  assert.equal(derived.map["l-1"], true);
  assert.equal(derived.map["elzero-042"], true);
  assert.equal(derived.totalCompletions, 2);
});

// ---------------- merge ----------------

test("mergeEvents unions by id and sorts by at/id", () => {
  const a = ev({ id: "a", track: "cpp", type: "activity" }, at(2026, 1, 2));
  const b = ev({ id: "b", track: "cpp", type: "activity" }, at(2026, 1, 1));
  const c = ev({ id: "c", track: "elzero", type: "activity" }, at(2026, 1, 3));
  const merged = mergeEvents([a, c], [b, a]);
  assert.deepEqual(
    merged.map((e) => e.id),
    ["b", "a", "c"]
  );
});

test("mergeEvents drops malformed entries instead of crashing", () => {
  const good = ev({ track: "cpp", type: "activity" }, at(2026, 1, 1));
  const merged = mergeEvents(
    [good, null as unknown as ProgressEvent, { id: "x" } as ProgressEvent],
    []
  );
  assert.deepEqual(merged.map((e) => e.id), [good.id]);
});

test("serialize/parse roundtrip keeps events and settings", () => {
  const file = emptyProgressFile();
  file.settings.dailyGoalMinutes = 30;
  file.events.push(ev({ track: "cpp", type: "lesson_completed", itemId: "l1" }, at(2026, 2, 1)));
  const parsed = parseProgressFile(JSON.parse(serializeProgressFile(file)));
  assert.equal(parsed.version, 2);
  assert.equal(parsed.settings.dailyGoalMinutes, 30);
  assert.equal(parsed.events.length, 1);
  assert.equal(parsed.events[0].itemId, "l1");
});

test("parseProgressFile rejects foreign shapes", () => {
  assert.throws(() => parseProgressFile(null));
  assert.throws(() => parseProgressFile({ version: 1 }));
  assert.throws(() => parseProgressFile("nope"));
});

test("parseProgressFile sanitizes bad settings and bad events", () => {
  const parsed = parseProgressFile({
    version: 2,
    events: [
      { id: "ok", v: 2, track: "cpp", type: "activity", at: at(2026, 1, 1).toISOString() },
      { bogus: true },
    ],
    settings: { dailyGoalMinutes: -5 },
  });
  assert.equal(parsed.events.length, 1);
  assert.equal(parsed.settings.dailyGoalMinutes, DEFAULT_DAILY_GOAL_MINUTES);
});

// ---------------- XP and levels ----------------

test("xpForEvent scores the documented rules", () => {
  const mk = (track: ProgressEvent["track"], type: ProgressEvent["type"], payload?: Record<string, unknown>) =>
    ev({ track, type, payload }, new Date());
  assert.equal(xpForEvent(mk("cpp", "lesson_completed")), 10);
  assert.equal(xpForEvent(mk("cpp", "quiz_attempt", { score: 5, total: 5 })), 17); // 2 + 10 + 5 perfect
  assert.equal(xpForEvent(mk("cpp", "quiz_attempt", { score: 3, total: 5 })), 12); // 2 + 10 pass
  assert.equal(xpForEvent(mk("cpp", "quiz_attempt", { score: 1, total: 5 })), 2); // fail: attempt only
  assert.equal(xpForEvent(mk("cpp", "quiz_attempt", { score: 0, total: 0 })), 0); // empty quiz: nothing
  assert.equal(xpForEvent(mk("playground", "exercise_run", { success: true })), 5);
  assert.equal(xpForEvent(mk("playground", "exercise_run", { success: false })), 0);
  assert.equal(xpForEvent(mk("playground", "focus_session", { minutes: 25 })), 25);
});

test("levelForXp climbs every 100 XP, floor at 1", () => {
  assert.equal(levelForXp(0), 1);
  assert.equal(levelForXp(99), 1);
  assert.equal(levelForXp(100), 2);
  assert.equal(levelForXp(1050), 11);
});
