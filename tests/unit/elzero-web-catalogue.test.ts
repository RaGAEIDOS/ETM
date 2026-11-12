import { test } from "node:test";
import assert from "node:assert/strict";
import {
  ELZERO_WEB_COURSES,
  ELZERO_WEB_SECTIONS,
  elzeroWebVideos,
  elzeroVideoIndex,
  elzeroWebCatalogueProblems,
  elzeroWebCourseVideos,
  findElzeroWebVideo,
  normalizeElzeroWebAnswer,
  sectionForNumber,
} from "../../lib/elzero-web-videos.ts";

test("catalogue integrity: zero problems", () => {
  assert.deepEqual(elzeroWebCatalogueProblems(), []);
});

test("six courses, counts match the official playlists", () => {
  const counts = Object.fromEntries(ELZERO_WEB_COURSES.map((c) => [c.id, c.lessons]));
  assert.deepEqual(counts, { html: 37, css: 88, javascript: 188, typescript: 38, sass: 19, gitgithub: 20 });
  assert.equal(elzeroWebVideos.length, 390);
});

test("every section belongs to a real course and holds real lesson numbers", () => {
  for (const s of ELZERO_WEB_SECTIONS) {
    assert.ok(ELZERO_WEB_COURSES.some((c) => c.id === s.course), `unknown course ${s.course}`);
    assert.ok(s.videos.length > 0, `empty section ${s.course}/${s.id}`);
    const max = Math.max(...s.videos);
    assert.ok(max <= (ELZERO_WEB_COURSES.find((c) => c.id === s.course)?.lessons ?? 0));
  }
});

test("courseVideos returns lessons in playlist order", () => {
  for (const c of ELZERO_WEB_COURSES) {
    const list = elzeroWebCourseVideos(c.id);
    assert.equal(list.length, c.lessons);
    for (let i = 0; i < list.length; i += 1) assert.equal(list[i].number, i + 1);
  }
});

test("first ten lessons are curated (not placeholders)", () => {
  for (const id of ["html-001", "html-002", "html-003", "html-004", "html-005", "html-006", "html-007", "html-008", "html-009", "html-010"]) {
    const v = findElzeroWebVideo(id);
    assert.ok(v, `missing ${id}`);
    assert.ok(v!.terms.length > 0, `${id} has no terms`);
    assert.ok(v!.practice.length >= 3, `${id} has fewer than 3 practice items`);
    assert.ok(v!.summary.length > 40, `${id} summary too short`);
    assert.equal(v!.reviewed, false);
  }
});

test("curated lessons: mcq answers are in range; fill answers non-empty", () => {
  for (const v of elzeroWebVideos) {
    for (const item of v.practice) {
      if (item.type === "mcq") {
        assert.ok(item.answer >= 0 && item.answer < item.options.length, `${v.id} mcq out of range`);
      } else if (item.type === "fill") {
        assert.ok(item.answer.trim().length > 0, `${v.id} fill answer empty`);
      }
    }
  }
});

test("sectionForNumber matches section ranges", () => {
  assert.equal(sectionForNumber("html", 1)?.id, "intro");
  assert.equal(sectionForNumber("html", 36)?.id, "a11y");
  assert.equal(sectionForNumber("css", 50)?.id, "flex");
});

test("elzeroVideoIndex is consistent with the array", () => {
  const v = findElzeroWebVideo("html-001")!;
  assert.equal(elzeroWebVideos[elzeroVideoIndex(v.id)].id, v.id);
});

test("normalizeElzeroWebAnswer folds case, diacritics and whitespace", () => {
  assert.equal(normalizeElzeroWebAnswer("  HyperText   Markup  LANGUAGE "), "hypertext markup language");
  assert.equal(normalizeElzeroWebAnswer("</P>"), "</p>");
  assert.equal(normalizeElzeroWebAnswer("فقرة   عربيّة"), "فقرة عربية");
});
