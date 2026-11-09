import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { stages, findCourse, findStage } from "@/lib/data";
import CourseView from "@/components/CourseView";

export function generateStaticParams() {
  return stages.flatMap((s) =>
    s.courses.map((c) => ({ stage: s.id, course: c.id }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: { stage: string; course: string };
}): Promise<Metadata> {
  const course = findCourse(params.stage, params.course);
  if (!course) return { title: "كورس غير موجود" };
  return { title: course.title, description: course.description };
}

export default function CoursePage({
  params,
}: {
  params: { stage: string; course: string };
}) {
  const stage = findStage(params.stage);
  const course = findCourse(params.stage, params.course);
  if (!stage || !course) notFound();
  return <CourseView stage={stage} course={course} />;
}
