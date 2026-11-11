import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { stages, findStage, getLessonContext } from "@/lib/data";
import LessonView from "@/components/LessonView";

export function generateStaticParams() {
  return stages.flatMap((s) =>
    s.courses.flatMap((c) =>
      c.lessons.map((l) => ({ stage: s.id, course: c.id, lesson: l.id }))
    )
  );
}

export async function generateMetadata({
  params,
}: {
  params: { stage: string; course: string; lesson: string };
}): Promise<Metadata> {
  const ctx = getLessonContext(params.stage, params.course, params.lesson);
  if (!ctx) return { title: "Lesson not found" };
  return {
    title: ctx.lesson.title,
    description: ctx.lesson.description,
  };
}

export default function LessonPage({
  params,
}: {
  params: { stage: string; course: string; lesson: string };
}) {
  const stage = findStage(params.stage);
  const ctx = getLessonContext(params.stage, params.course, params.lesson);
  if (!stage || !ctx) notFound();

  return (
    <LessonView
      stage={stage}
      course={ctx.course}
      lesson={ctx.lesson}
      prev={ctx.prev}
      next={ctx.next}
      index={ctx.index}
    />
  );
}
