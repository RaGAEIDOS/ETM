import { test } from "node:test";
import assert from "node:assert/strict";
import {
  ETM_PA_CREDIT,
  ETM_PA_ROADMAP,
  externalContent,
  findPACourse,
  findPAVideo,
  formatPADuration,
  normalizePaAnswer,
  orderedPAVideos,
  paAcceptedAnswers,
  paCourses,
  paVideoIndex,
  paVideos,
  paVideosOfCourse,
} from "../../lib/programmingadvices-videos.ts";

const EXPECTED = new Map([
  ["pa-foundations", { number: 1, count: 20, playlist: "PL3X--QIIK-OHgMV2yBz3GLfM5d_5BxOSj" }],
  ["pa-algorithms", { number: 2, count: 50, playlist: "PL3X--QIIK-OEUIwbQU79V76RHelBUQKiz" }],
]);

test("exactly two approved courses with the official playlists and counts", () => {
  assert.equal(paCourses.length, 2);
  for (const course of paCourses) {
    const expected = EXPECTED.get(course.id);
    assert.ok(expected, `unexpected course ${course.id}`);
    assert.equal(course.number, expected.number);
    assert.equal(course.videoCount, expected.count);
    assert.equal(course.playlistId, expected.playlist);
    assert.equal(
      course.playlistUrl,
      `https://www.youtube.com/playlist?list=${expected.playlist}`
    );
  }
  assert.equal(
    paCourses.reduce((sum, course) => sum + course.videoCount, 0),
    70,
    "the two official playlists hold 20 + 50 videos"
  );
});

test("pilot ships course 1's first ten lessons in order, course 2 is pending", () => {
  const course1 = paVideosOfCourse("pa-foundations");
  assert.deepEqual(
    course1.map((video) => video.id),
    Array.from({ length: 10 }, (_, index) => `pa1-${String(index + 1).padStart(2, "0")}`)
  );
  assert.equal(paVideosOfCourse("pa-algorithms").length, 0);
  assert.deepEqual(orderedPAVideos(), course1);
  assert.equal(
    paVideos.length,
    course1.length,
    "no unapproved course may leak into the shipped catalogue"
  );
});

test("video ids, numbers and official URLs are internally consistent", () => {
  const ids = new Set<string>();
  for (const video of paVideos) {
    const course = findPACourse(video.courseId);
    assert.ok(course, `${video.id}: unknown course`);
    assert.ok(!ids.has(video.id), `duplicate id ${video.id}`);
    ids.add(video.id);
    assert.match(video.id, /^pa[12]-\d{2}$/);
    assert.equal(video.id, `pa1-${String(video.number).padStart(2, "0")}`);
    assert.equal(video.number, paVideoIndex(video.id) + 1);
    assert.match(video.youtubeId, /^[A-Za-z0-9_-]{11}$/);
    assert.ok(video.youtube.includes(`v=${video.youtubeId}`));
    assert.ok(video.youtube.includes(`list=${course.playlistId}`));
    assert.match(video.duration, /^PT(?:\d+H)?(?:\d+M)?(?:\d+S)?$/);
    assert.ok(video.title.trim() && video.titleEn.trim());
    assert.ok(video.section.trim() && video.sectionEn.trim());
  }
  assert.equal(findPAVideo("pa1-01")?.youtubeId, "LWCBg5tb64I");
  assert.equal(findPAVideo("pa2-01"), undefined);
});

test("every shipped lesson is conservative, bilingual and has original drills", () => {
  for (const video of paVideos) {
    assert.equal(video.reviewed, false, `${video.id}: no captions, so reviewed must stay false`);
    const sentences = (video.summary.match(/[.!?؟]/g) ?? []).length;
    assert.ok(sentences >= 2 && sentences <= 4, `${video.id}: summary needs 2-4 sentences`);
    assert.ok(video.summaryEn.length > 40, `${video.id}: English summary too short`);
    assert.ok(video.terms.length >= 1 && video.terms.length <= 5, `${video.id}: 1-5 terms`);
    for (const term of video.terms) {
      assert.ok(term.en.trim() && term.ar.trim(), `${video.id}: bilingual term required`);
    }
    assert.ok(
      video.practice.length >= 3 && video.practice.length <= 5,
      `${video.id}: 3-5 practice items`
    );
    for (const item of video.practice) {
      assert.ok(item.hint.trim() && item.hintEn.trim(), `${video.id}: hint(s) required`);
      assert.ok(
        item.explanation.trim() && item.explanationEn.trim(),
        `${video.id}: explanation(s) required`
      );
      if (item.type === "mcq") {
        assert.ok(item.answer >= 0 && item.answer < item.options.length);
        assert.equal(new Set(item.options).size, item.options.length);
      } else if (item.type === "fill" || item.type === "trace" || item.type === "pseudocode") {
        assert.ok(item.answer.trim().length > 0);
        if (item.type !== "fill") assert.ok(item.code.trim().length > 0);
      } else if (item.type === "match") {
        assert.ok(item.pairs.length >= 2);
        assert.equal(new Set(item.pairs.map((p) => p.left)).size, item.pairs.length);
        assert.equal(new Set(item.pairs.map((p) => p.right)).size, item.pairs.length);
      } else if (item.type === "order") {
        assert.ok(item.steps.length >= 2);
        assert.equal(new Set(item.steps).size, item.steps.length);
      }
    }
  }
});

test("credit and legal boundaries are exact", () => {
  assert.equal(
    ETM_PA_CREDIT,
    "Content by Dr. Mohammed Abu-Hadhoud / Programming Advices on YouTube. This platform is not affiliated with Programming Advices."
  );
  assert.equal(externalContent.permissionGranted, false);
  assert.equal(ETM_PA_ROADMAP, "https://programmingadvices.com/courses");
});

test("formatPADuration and answer normalization", () => {
  assert.equal(formatPADuration("PT4M55S"), "4:55");
  assert.equal(formatPADuration("PT1H2M3S"), "1:02:03");
  assert.equal(formatPADuration("PT26M49S"), "26:49");
  assert.equal(formatPADuration("nope"), "");
  assert.equal(normalizePaAnswer("  0x1A "), "0x1a");
  assert.equal(normalizePaAnswer("١٣"), "13");
  assert.equal(normalizePaAnswer("Information!"), "information");
  assert.deepEqual(paAcceptedAnswers("معلومات", ["information"]), ["معلومات", "information"]);
});
