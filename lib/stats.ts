import type { Lesson, Stage } from "./types";

export interface NextLesson {
  stage: Stage;
  courseId: string;
  courseTitle: string;
  courseTitleEn: string;
  lesson: Lesson;
}

export function findNextLesson(
  map: Record<string, boolean>,
  stages: Stage[]
): NextLesson | null {
  for (const stage of stages) {
    for (const course of stage.courses) {
      for (const lesson of course.lessons) {
        if (!map[lesson.id]) {
          return {
            stage,
            courseId: course.id,
            courseTitle: course.title,
            courseTitleEn: course.titleEn,
            lesson,
          };
        }
      }
    }
  }
  return null;
}

export function nextLessons(
  map: Record<string, boolean>,
  stages: Stage[],
  count = 5
): NextLesson[] {
  const out: NextLesson[] = [];
  for (const stage of stages) {
    for (const course of stage.courses) {
      for (const lesson of course.lessons) {
        if (!map[lesson.id]) {
          out.push({
            stage,
            courseId: course.id,
            courseTitle: course.title,
            courseTitleEn: course.titleEn,
            lesson,
          });
          if (out.length >= count) return out;
        }
      }
    }
  }
  return out;
}
