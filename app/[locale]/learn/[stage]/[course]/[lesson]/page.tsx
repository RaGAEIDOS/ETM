import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { stages, findStage, getLessonContext } from "@/lib/data";
import { localeFromParams, pageMetadata } from "@/lib/i18n/server";
import LessonView from "@/components/LessonView";

const COPY = {
  ar: { notFound: "الدرس غير موجود" },
  en: { notFound: "Lesson not found" },
} as const;

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
  params: { locale: string; stage: string; course: string; lesson: string };
}): Promise<Metadata> {
  const locale = localeFromParams(params);
  const ctx = getLessonContext(params.stage, params.course, params.lesson);
  if (!ctx) return { title: COPY[locale].notFound };
  return pageMetadata({
    locale,
    path: `/learn/${params.stage}/${params.course}/${ctx.lesson.id}`,
    title: locale === "ar" ? ctx.lesson.title : ctx.lesson.titleEn,
    description: ctx.lesson.description,
  });
}

export default function LessonPage({
  params,
}: {
  params: { locale: string; stage: string; course: string; lesson: string };
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
