import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  RELIGIOUS_CATEGORIES,
  allReligiousLessons,
  findReligiousCategory,
  findReligiousCourse,
  findReligiousLesson,
  religiousCourses,
  religiousLessonCount,
  religiousLessonIdsOfCourse,
  religiousLessonsOfCourse,
} from "../../lib/religious.ts";

const EXPECTED = new Map([
  ["islam-essentials", { number: 1, instructor: "د. سامح الجنداوي", category: "foundations" }],
  [
    "contemporary-awareness",
    { number: 2, instructor: "د. أيمن عبد الرحيم", category: "contemporary" },
  ],
]);

test("exactly the two requested courses, with their instructors and categories", () => {
  assert.equal(religiousCourses.length, 2);
  for (const course of religiousCourses) {
    const expected = EXPECTED.get(course.id);
    assert.ok(expected, `unexpected course ${course.id}`);
    assert.equal(course.number, expected.number);
    assert.equal(course.instructor, expected.instructor);
    assert.equal(course.category, expected.category);
    assert.ok(course.title.trim() && course.titleEn.trim());
    assert.ok(course.description.trim() && course.descriptionEn.trim());
    assert.ok(course.instructorEn.trim());
  }
  assert.deepEqual(
    religiousCourses.map((course) => course.id),
    ["islam-essentials", "contemporary-awareness"]
  );
});

test("every course belongs to a known category and has bilingual tags", () => {
  const categoryIds = new Set(RELIGIOUS_CATEGORIES.map((category) => category.id));
  for (const course of religiousCourses) {
    assert.ok(categoryIds.has(course.category), `${course.id}: unknown category`);
    assert.ok(findReligiousCategory(course.category), `${course.id}: category not resolvable`);
    assert.ok(course.tags.length > 0 && course.tags.length === course.tagsEn.length);
    assert.ok(course.cover.startsWith("/courses/"));
    assert.ok(course.coverAlt.trim() && course.coverAltEn.trim());
  }
});

test("cover files exist in public/ so the cards never render a broken image", () => {
  for (const course of religiousCourses) {
    const file = fileURLToPath(
      new URL(`../../public${course.cover}`, import.meta.url)
    );
    assert.ok(existsSync(file), `missing cover: ${course.cover}`);
  }
});

test("no invented content: modules are empty and no lesson ships a video or link", () => {
  for (const course of religiousCourses) {
    // Until an official source is verified, the track must stay honest.
    assert.equal(course.modules.length, 0, `${course.id}: modules must stay empty until verified`);
    assert.equal(religiousLessonCount(course), 0);
    assert.equal(religiousLessonsOfCourse(course.id).length, 0);
    assert.deepEqual(religiousLessonIdsOfCourse(course.id), []);
  }
  assert.equal(allReligiousLessons().length, 0);
  assert.equal(findReligiousLesson("islam-essentials-01"), null);
});

test("unknown ids resolve to null instead of throwing", () => {
  assert.equal(findReligiousCourse("does-not-exist"), null);
  assert.equal(findReligiousCategory("does-not-exist"), null);
  assert.deepEqual(religiousLessonsOfCourse("does-not-exist"), []);
  assert.deepEqual(religiousLessonIdsOfCourse("does-not-exist"), []);
});
