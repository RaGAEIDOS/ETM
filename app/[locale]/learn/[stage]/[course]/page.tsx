import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { stages, findCourse, findStage } from "@/lib/data";
import { localeFromParams, pageMetadata } from "@/lib/i18n/server";
import CourseView from "@/components/CourseView";

const COPY = {
  ar: { notFound: "الكورس غير موجود" },
  en: { notFound: "Course not found" },
} as const;

export function generateStaticParams() {
  return stages.flatMap((s) =>
    s.courses.map((c) => ({ stage: s.id, course: c.id }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; stage: string; course: string };
}): Promise<Metadata> {
  const locale = localeFromParams(params);
  const course = findCourse(params.stage, params.course);
  if (!course) return { title: COPY[locale].notFound };
  return pageMetadata({
    locale,
    path: `/learn/${params.stage}/${course.id}`,
    title: locale === "ar" ? course.title : course.titleEn,
    description: course.description,
  });
}

export default function CoursePage({
  params,
}: {
  params: { locale: string; stage: string; course: string };
}) {
  const stage = findStage(params.stage);
  const course = findCourse(params.stage, params.course);
  if (!stage || !course) notFound();
  return <CourseView stage={stage} course={course} />;
}
