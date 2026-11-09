import type { Course, Lesson, Stage } from "./types";
import { stageMetas } from "./stages";

import { lessons as cppBasics } from "./content/cpp-basics";
import { lessons as thinkingComputer } from "./content/thinking-computer";
import { lessons as tools } from "./content/tools";

import { lessons as oop } from "./content/oop";
import { lessons as pointersMemory } from "./content/pointers-memory";
import { lessons as dataStructures } from "./content/data-structures";
import { lessons as recursion } from "./content/recursion";

import { lessons as algorithms } from "./content/algorithms";
import { lessons as mathCs } from "./content/math-cs";
import { lessons as architecture } from "./content/architecture";
import { lessons as os } from "./content/os";
import { lessons as networkingDb } from "./content/networking-db";

import { lessons as compilers } from "./content/compilers";
import { lessons as gameEngine } from "./content/game-engine";
import { lessons as osDev } from "./content/os-dev";
import { lessons as distributed } from "./content/distributed";
import { lessons as security } from "./content/security";

const contentMap: Record<string, Lesson[]> = {
  "cpp-basics": cppBasics,
  "thinking-computer": thinkingComputer,
  tools: tools,

  oop: oop,
  "pointers-memory": pointersMemory,
  "data-structures": dataStructures,
  recursion: recursion,

  algorithms: algorithms,
  "math-cs": mathCs,
  architecture: architecture,
  os: os,
  "networking-db": networkingDb,

  compilers: compilers,
  "game-engine": gameEngine,
  "os-dev": osDev,
  distributed: distributed,
  security: security,
};

export const stages: Stage[] = stageMetas.map((meta) => ({
  ...meta,
  courses: meta.courses.map((courseMeta) => {
    const lessons = contentMap[courseMeta.id] ?? [];
    return { ...courseMeta, lessons } as Course;
  }),
}));

export function findStage(stageId: string) {
  return stages.find((s) => s.id === stageId);
}

export function findCourse(stageId: string, courseId: string) {
  const stage = findStage(stageId);
  return stage?.courses.find((c) => c.id === courseId);
}

export function findLesson(stageId: string, courseId: string, lessonId: string) {
  const course = findCourse(stageId, courseId);
  return course?.lessons.find((l) => l.id === lessonId);
}

export function getLessonContext(stageId: string, courseId: string, lessonId: string) {
  const course = findCourse(stageId, courseId);
  if (!course) return null;
  const index = course.lessons.findIndex((l) => l.id === lessonId);
  if (index === -1) return null;
  const lesson = course.lessons[index];
  const prev = index > 0 ? course.lessons[index - 1] : null;
  const next = index < course.lessons.length - 1 ? course.lessons[index + 1] : null;
  return { lesson, course, index, prev, next };
}

export function totalLessons() {
  return stages.reduce(
    (sum, s) => sum + s.courses.reduce((acc, c) => acc + c.lessons.length, 0),
    0
  );
}

export function totalCourses() {
  return stages.reduce((sum, s) => sum + s.courses.length, 0);
}
