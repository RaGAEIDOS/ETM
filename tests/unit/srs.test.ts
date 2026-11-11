import { test } from "node:test";
import assert from "node:assert/strict";
import {
  deriveSrs,
  normalizeTerm,
  srsDueCount,
  SRS_INTERVALS,
  SRS_MAX_BOX,
} from "../../lib/english/srs.ts";
import type { ProgressEvent } from "../../lib/progress/core.ts";

let counter = 0;
function event(partial: Partial<ProgressEvent> & Pick<ProgressEvent, "track" | "type" | "at">): ProgressEvent {
  counter += 1;
  return {
    id: `e${counter}`,
    v: 2,
    payload: {},
    ...partial,
  };
}

const review = (at: string, term: string, known: boolean): ProgressEvent =>
  event({
    track: "english",
    type: "term_review",
    itemId: "001",
    topic: "en-zero",
    at,
    payload: { term, known },
  });

const DAY = "2026-11-11";
const iso = (dayKey: string, time = "12:00:00.000Z") => `${dayKey}T${time}`;

test("normalizeTerm trims and collapses whitespace", () => {
  assert.equal(normalizeTerm("  hello   world  "), "hello world");
  assert.equal(normalizeTerm("\tnewline\n\ntest\t"), "newline test");
  assert.equal(normalizeTerm(""), "");
});

test("empty history: nothing due, nothing seen", () => {
  const s = deriveSrs([], DAY);
  assert.equal(s.dueCount, 0);
  assert.equal(s.seenTerms, 0);
  assert.equal(s.terms.length, 0);
});

test("unrelated tracks and event types are ignored", () => {
  const s = deriveSrs(
    [
      review(iso("2026-11-01"), "apple", true),
      event({ track: "cpp", type: "term_review", at: iso("2026-11-01"), payload: { term: "apple", known: true } }),
      event({ track: "english", type: "quiz_attempt", at: iso("2026-11-01"), payload: { score: 3, total: 4 } }),
    ],
    DAY,
  );
  assert.equal(s.seenTerms, 1);
});

test("first 'known' answer: box 1, due in 3 days, not due today", () => {
  const s = deriveSrs([review(iso(DAY), "apple", true)], DAY);
  assert.equal(s.terms[0].box, 1);
  assert.equal(s.terms[0].due, false);
  assert.equal(s.dueCount, 0);
  assert.equal(s.terms[0].dueDayKey, "2026-11-14"); // SRS_INTERVALS[1] = 3 days
});

test("first 'missed' answer: box 0, due tomorrow", () => {
  const s = deriveSrs([review(iso(DAY), "apple", false)], DAY);
  assert.equal(s.terms[0].box, 0);
  assert.equal(s.terms[0].misses, 1);
  assert.equal(s.terms[0].dueDayKey, "2026-11-12");
});

test("intervals are applied per box after each review", () => {
  const events = [
    review(iso("2026-10-01"), "apple", true), // box 0 -> 1, due +3d = 2026-10-04
    review(iso("2026-10-04"), "apple", true), // box 1 -> 2, due +7d = 2026-10-11
    review(iso("2026-10-11"), "apple", true), // box 2 -> 3, due +16d = 2026-10-27
  ];
  const s = deriveSrs(events, "2026-11-11");
  assert.equal(s.terms[0].box, 3);
  assert.equal(s.terms[0].dueDayKey, "2026-10-27"); // SRS_INTERVALS[3] = 16 days
  assert.equal(s.dueCount, 1); // overdue counts
});

test("miss resets a high box back to 0", () => {
  const events = [
    review(iso("2026-09-01"), "apple", true),
    review(iso("2026-09-02"), "apple", true),
    review(iso("2026-09-05"), "apple", true),
    review(iso(DAY), "apple", false),
  ];
  const s = deriveSrs(events, DAY);
  assert.equal(s.terms[0].box, 0);
  assert.equal(s.terms[0].misses, 1);
  assert.equal(s.terms[0].dueDayKey, "2026-11-12");
});

test("replay order does not depend on input order (sorted by at, id)", () => {
  const a = [
    review(iso("2026-11-01"), "apple", true),
    review(iso("2026-11-03"), "apple", false),
  ];
  const shuffled = [...a].reverse();
  const s1 = deriveSrs(a, DAY);
  const s2 = deriveSrs(shuffled, DAY);
  assert.equal(s1.terms[0].box, s2.terms[0].box);
  assert.equal(s1.terms[0].dueDayKey, s2.terms[0].dueDayKey);
  assert.equal(s1.terms[0].misses, 1); // miss came last chronologically
});

test("max box is clamped at SRS_MAX_BOX", () => {
  const events: ProgressEvent[] = [];
  let t = Date.parse("2026-01-01T00:00:00Z");
  for (let i = 0; i < 10; i += 1) {
    events.push(review(new Date(t).toISOString(), "apple", true));
    t += SRS_INTERVALS[Math.min(i, SRS_INTERVALS.length - 1)] * 86_400_000;
  }
  const s = deriveSrs(events, DAY);
  assert.equal(s.terms[0].box, SRS_MAX_BOX);
  assert.ok(s.terms[0].seen >= 8);
});

test("srsDueCount returns the number of due terms", () => {
  const events = [
    review(iso("2026-11-01"), "overdue", true),   // due from 2026-11-02
    review(iso(DAY), "fresh", true),              // due tomorrow
  ];
  assert.equal(srsDueCount(events, DAY), 1);
});

test("whitespace inside a term is normalized to a single space", () => {
  const events = [
    review(iso(DAY), "phrasal   verb", true),
    review(iso(DAY), "phrasal verb", false),
  ];
  const s = deriveSrs(events, DAY);
  assert.equal(s.seenTerms, 1);
  assert.equal(s.terms[0].misses, 1);
  assert.equal(s.terms[0].box, 0);
});
