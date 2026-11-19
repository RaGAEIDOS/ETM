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
  formatReligiousDuration,
  religiousCourses,
  religiousLessonCount,
  religiousLessonIdsOfCourse,
  religiousLessonsOfCourse,
  religiousResourcesOfCourse,
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
    const file = fileURLToPath(new URL(`../../public${course.cover}`, import.meta.url));
    assert.ok(existsSync(file), `missing cover: ${course.cover}`);
  }
});

test("both curricula are populated with the verified lecture counts", () => {
  const expected = new Map([
    ["islam-essentials", { total: 17, modules: [17] }],
    ["contemporary-awareness", { total: 17, modules: [9, 8] }],
  ]);

  for (const course of religiousCourses) {
    const target = expected.get(course.id);
    assert.ok(target, `unexpected course ${course.id}`);
    assert.equal(religiousLessonCount(course), target.total, `${course.id}: lesson count`);
    assert.deepEqual(
      course.modules.map((module) => module.lessons.length),
      target.modules,
      `${course.id}: module distribution`
    );
    assert.ok(course.modules.every((module) => module.title.trim() && module.titleEn.trim()));
    assert.equal(religiousLessonsOfCourse(course.id).length, target.total);
    assert.equal(religiousLessonIdsOfCourse(course.id).length, target.total);
  }

  assert.equal(allReligiousLessons().length, 34);
  assert.ok(findReligiousLesson("islam-essentials-01"));
  assert.ok(findReligiousLesson("contemporary-awareness-17"));
  assert.equal(findReligiousLesson("islam-essentials-18"), null);
});

test("lesson ids are stable, sequential and globally unique", () => {
  const allIds = new Set<string>();
  const allYouTubeIds = new Set<string>();

  for (const course of religiousCourses) {
    const lessons = religiousLessonsOfCourse(course.id);
    lessons.forEach((lesson, index) => {
      assert.equal(
        lesson.id,
        `${course.id}-${String(index + 1).padStart(2, "0")}`,
        `${course.id}: unstable lesson id`
      );
      assert.ok(!allIds.has(lesson.id), `duplicate lesson id ${lesson.id}`);
      allIds.add(lesson.id);

      assert.match(lesson.youtubeId ?? "", /^[\w-]{11}$/, `${lesson.id}: invalid video id`);
      assert.ok(!allYouTubeIds.has(lesson.youtubeId!), `duplicate video id ${lesson.youtubeId}`);
      allYouTubeIds.add(lesson.youtubeId!);

      assert.match(lesson.duration ?? "", /^PT(?:\d+H)?(?:\d+M)?(?:\d+S)?$/, `${lesson.id}: invalid duration`);
      assert.ok(lesson.title.trim() && lesson.titleEn.trim());
      assert.ok(lesson.description.trim() && lesson.descriptionEn.trim());
    });
  }

  assert.equal(allIds.size, 34);
  assert.equal(allYouTubeIds.size, 34);
});

test("course and module metadata point at verified official playlists", () => {
  for (const course of religiousCourses) {
    assert.match(course.playlistUrl ?? "", /^https:\/\/www\.youtube\.com\/playlist\?list=/, `${course.id}: playlist`);
    if (course.channelUrl) {
      assert.match(course.channelUrl, /^https:\/\/(www\.)?youtube\.com\//, `${course.id}: channel`);
    }
    for (const module of course.modules) {
      if (module.playlistUrl) {
        assert.match(
          module.playlistUrl,
          /^https:\/\/www\.youtube\.com\/playlist\?list=/,
          `${course.id}/${module.id}: playlist`
        );
      }
    }
  }

  const islam = findReligiousCourse("islam-essentials");
  const contemporary = findReligiousCourse("contemporary-awareness");
  assert.ok(islam);
  assert.ok(contemporary);
  assert.equal(islam.modules[0].lessons[0].youtubeId, "XT85mB1592E");
  assert.equal(islam.modules[0].lessons[16].youtubeId, "IarxW0IyDkU");
  assert.equal(contemporary.modules[0].lessons[0].youtubeId, "ei9FVKHZxxM");
  assert.equal(contemporary.modules[0].lessons[8].youtubeId, "dFvNQRdZ_RQ");
  assert.equal(contemporary.modules[1].lessons[0].youtubeId, "f_8omvN42K4");
  assert.equal(contemporary.modules[1].lessons[7].youtubeId, "pXAm1odzavI");
});

test("every attached PDF is either local and present, or an official https post", () => {
  for (const course of religiousCourses) {
    const resources = religiousResourcesOfCourse(course);
    assert.ok(
      resources.some((resource) => resource.kind === "pdf"),
      `${course.id}: no PDF resources`
    );

    for (const resource of resources) {
      assert.ok(resource.label.trim() && resource.labelEn.trim(), `unlabelled resource ${resource.url}`);
      assert.ok(
        resource.url.startsWith("/") || resource.url.startsWith("https://"),
        `${course.id}: unsafe resource URL ${resource.url}`
      );
      if (resource.kind !== "pdf" || !resource.url.startsWith("/")) continue;
      const file = fileURLToPath(new URL(`../../public${resource.url}`, import.meta.url));
      assert.ok(existsSync(file), `${course.id}: missing local PDF ${resource.url}`);
    }
  }
});

test("the course book for Sameh points at his official Telegram post", () => {
  const islam = findReligiousCourse("islam-essentials");
  assert.ok(islam);
  const book = religiousResourcesOfCourse(islam).find(
    (resource) => resource.url === "https://t.me/samehelgendawey/1196"
  );
  assert.ok(book, "missing official course book post");
  assert.equal(book.kind, "pdf");
});

test("duration formatter matches the track's clock format", () => {
  assert.equal(formatReligiousDuration("PT23M34S"), "23:34");
  assert.equal(formatReligiousDuration("PT2H2M22S"), "2:02:22");
  assert.equal(formatReligiousDuration("PT1H5M7S"), "1:05:07");
  assert.equal(formatReligiousDuration(undefined), "");
  assert.equal(formatReligiousDuration("not-a-duration"), "");
});

test("unknown ids resolve to null instead of throwing", () => {
  assert.equal(findReligiousCourse("does-not-exist"), null);
  assert.equal(findReligiousCategory("does-not-exist"), null);
  assert.deepEqual(religiousLessonsOfCourse("does-not-exist"), []);
  assert.deepEqual(religiousLessonIdsOfCourse("does-not-exist"), []);
  assert.equal(findReligiousLesson("does-not-exist"), null);
});
