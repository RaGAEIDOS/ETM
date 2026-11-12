import { test } from "node:test";
import assert from "node:assert/strict";
import {
  CS50X_LECTURES,
  CS50X_PSETS,
  CS50X_PLAYLIST_ID,
  CS50X_PLAYLIST_URL,
  cs50xCatalogueProblems,
  cs50xLectureIndex,
  findCs50xLecture,
  normalizeCs50xAnswer,
  isoDuration,
  shortDuration,
} from "../../lib/cs50x.ts";

test("catalogue integrity: zero problems", () => {
  assert.deepEqual(cs50xCatalogueProblems(), []);
});

test("13 official lectures from the official CS50 playlist", () => {
  assert.equal(CS50X_LECTURES.length, 13);
  assert.ok(CS50X_PLAYLIST_URL.includes(CS50X_PLAYLIST_ID));
  assert.equal(CS50X_LECTURES[0].youtubeId, "HJP0a6vKvlo"); // Introduction
  assert.equal(CS50X_LECTURES[CS50X_LECTURES.length - 1].id, "week-10");
});

test("lecture ids are unique and match playlist order", () => {
  const ids = CS50X_LECTURES.map((l) => l.id);
  assert.equal(new Set(ids).size, ids.length);
  CS50X_LECTURES.forEach((l, i) => assert.equal(l.number, i + 1));
});

test("every lecture has the official watch URL with the playlist list", () => {
  for (const l of CS50X_LECTURES) {
    assert.ok(l.youtube.includes(`v=${l.youtubeId}`));
    assert.ok(l.youtube.includes(`list=${CS50X_PLAYLIST_ID}`));
  }
});

test("every lecture is conservative: unreviewed, original Arabic summary, practice present", () => {
  for (const l of CS50X_LECTURES) {
    assert.equal(l.reviewed, false, `${l.id} should be reviewed:false`);
    assert.ok(l.summary.length > 30, `${l.id} summary too short`);
    assert.ok(l.terms.length > 0 && l.practice.length >= 2, `${l.id} needs terms + practice`);
  }
});

test("mcq answers in range; fill answers non-empty", () => {
  for (const l of CS50X_LECTURES) {
    for (const item of l.practice) {
      if (item.type === "mcq") {
        assert.ok(item.answer >= 0 && item.answer < item.options.length, `${l.id} out of range`);
      } else {
        assert.ok(item.answer.trim().length > 0);
      }
    }
  }
});

test("certificate path: 10 problem sets + final project", () => {
  assert.equal(CS50X_PSETS.length, 11);
  assert.equal(CS50X_PSETS.filter((p) => p.id.startsWith("pset-")).length, 10);
  assert.equal(CS50X_PSETS[CS50X_PSETS.length - 1].id, "final-project");
});

test("findCs50xLecture and cs50xLectureIndex round-trip", () => {
  const l = findCs50xLecture("week-1")!;
  assert.ok(l);
  assert.equal(CS50X_LECTURES[cs50xLectureIndex("week-1")].id, "week-1");
  assert.equal(findCs50xLecture("week-99"), undefined);
});

test("isoDuration and shortDuration", () => {
  assert.equal(isoDuration(104), "PT1M44S");
  assert.equal(isoDuration(7253), "PT2H53S");
  assert.equal(shortDuration(7253), "2h 01m");
});

test("normalizeCs50xAnswer folds case, diacritics and whitespace", () => {
  assert.equal(normalizeCs50xAnswer("  Bubble   SORT "), "bubble sort");
  assert.equal(normalizeCs50xAnswer("لَاغَةٌ  عربية"), "لاغة عربية");
});
