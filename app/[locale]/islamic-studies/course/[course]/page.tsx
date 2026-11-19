import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Layers, ShieldCheck, UserRound } from "lucide-react";
import { localeFromParams, pageMetadata } from "@/lib/i18n/server";
import { formatNumber, localePath } from "@/lib/i18n/config";
import {
  findReligiousCategory,
  findReligiousCourse,
  religiousCourses,
  religiousLessonCount,
  religiousLessonIdsOfCourse,
} from "@/lib/religious";
import ReligiousLessonList from "@/components/religious/ReligiousLessonList";
import ReligiousCourseProgress from "@/components/religious/ReligiousCourseProgress";

const COPY = {
  ar: {
    breadcrumb: "الدورات الدينية",
    modulesTitle: "الوحدات والدروس",
    lessons: (n: string) => `${n} دروس`,
    modules: (n: string) => `${n} وحدات`,
    soon: "الدروس قيد الإعداد",
    back: "العودة إلى الدورات الدينية",
    sourceTitle: "المصدر الرسمي فقط",
    sourceBody:
      "تُضاف الفيديوهات والدروس هنا بعد التحقق من المصدر الرسمي للمحاضر. لا ننشر روابط أو محتوى غير مؤكد.",
    instructor: "المحاضر",
  },
  en: {
    breadcrumb: "Religious courses",
    modulesTitle: "Modules and lessons",
    lessons: (n: string) => `${n} lessons`,
    modules: (n: string) => `${n} modules`,
    soon: "Lessons being prepared",
    back: "Back to religious courses",
    sourceTitle: "Official source only",
    sourceBody:
      "Videos and lessons are added here after verifying the instructor's official source. We never publish unverified links or content.",
    instructor: "Instructor",
  },
} as const;

export function generateStaticParams() {
  return religiousCourses.map((course) => ({ course: course.id }));
}

export async function generateMetadata({
  params,
}: {
  params: { course: string; locale: string };
}): Promise<Metadata> {
  const locale = localeFromParams(params);
  const course = findReligiousCourse(params.course);
  if (!course) return { title: params.course };
  const isAr = locale === "ar";
  return pageMetadata({
    locale,
    path: `/islamic-studies/course/${course.id}`,
    title: isAr ? `${course.title} — ${course.instructor}` : `${course.titleEn} — ${course.instructorEn}`,
    description: isAr ? course.description : course.descriptionEn,
  });
}

export default function ReligiousCoursePage({
  params,
}: {
  params: { course: string; locale: string };
}) {
  const locale = localeFromParams(params);
  const c = COPY[locale];
  const isAr = locale === "ar";
  const course = findReligiousCourse(params.course);
  if (!course) notFound();

  const category = findReligiousCategory(course.category);
  const lessonCount = religiousLessonCount(course);
  const lessonIds = religiousLessonIdsOfCourse(course.id);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <nav
        className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-slate-500"
        aria-label={c.breadcrumb}
      >
        <Link
          href={localePath(locale, "/islamic-studies")}
          className="transition-colors hover:text-amber-300"
        >
          {c.breadcrumb}
        </Link>
        <ChevronRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
        <span className="text-slate-300" dir="auto">
          {isAr ? course.title : course.titleEn}
        </span>
      </nav>

      <header className="overflow-hidden rounded-3xl border border-white/10 bg-ink-900/60">
        <div className="grid md:grid-cols-2">
          <div className="relative min-h-[220px] overflow-hidden bg-ink-950 md:min-h-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={course.cover}
              alt={isAr ? course.coverAlt : course.coverAltEn}
              width={1200}
              height={675}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent md:bg-gradient-to-l" />
            <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-2 p-4">
              {category && (
                <span className="rounded-full border border-white/15 bg-ink-950/70 px-3 py-1 text-[11px] font-black text-cyan-100 backdrop-blur">
                  {isAr ? category.label : category.labelEn}
                </span>
              )}
              <span className="rounded-full border border-white/15 bg-ink-950/70 px-3 py-1 text-[11px] font-bold text-amber-200 backdrop-blur">
                {lessonCount > 0 ? c.lessons(formatNumber(lessonCount)) : c.soon}
              </span>
            </div>
          </div>

          <div className="p-6">
            <h1 className="text-2xl font-black leading-tight text-white sm:text-3xl" dir="auto">
              {isAr ? course.title : course.titleEn}
            </h1>
            <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-amber-300">
              <UserRound className="h-4 w-4" aria-hidden />
              <span className="text-slate-500">{c.instructor}:</span>
              {isAr ? course.instructor : course.instructorEn}
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-400" dir="auto">
              {isAr ? course.description : course.descriptionEn}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(isAr ? course.tags : course.tagsEn).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-bold text-slate-400"
                >
                  {tag}
                </span>
              ))}
            </div>
            {lessonCount > 0 && (
              <div className="mt-5">
                <ReligiousCourseProgress lessonIds={lessonIds} />
              </div>
            )}
          </div>
        </div>
      </header>

      <section className="mt-8" aria-labelledby="religious-modules-title">
        <h2
          id="religious-modules-title"
          className="mb-4 flex items-center gap-2 text-lg font-black text-white"
        >
          <Layers className="h-5 w-5 text-amber-400" aria-hidden />
          {c.modulesTitle}
        </h2>
        <ReligiousLessonList modules={course.modules} />
      </section>

      <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="flex items-center gap-2 text-sm font-black text-white">
          <ShieldCheck className="h-5 w-5 text-emerald-400" aria-hidden />
          {c.sourceTitle}
        </h2>
        <p className="mt-2 text-xs leading-6 text-slate-400">{c.sourceBody}</p>
      </section>

      <div className="mt-8">
        <Link
          href={localePath(locale, "/islamic-studies")}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-slate-200 hover:bg-white/10"
        >
          <ChevronRight className="h-4 w-4 rotate-180 rtl:rotate-0" aria-hidden />
          {c.back}
        </Link>
      </div>
    </div>
  );
}
