"use client";

/**
 * Course card for the Islamic Studies track. Uses the same card language as
 * the existing tracks: cover, category chip, instructor, progress and CTA.
 * When lessons exist it continues from the first unfinished one; otherwise it
 * links to the course page.
 */

import Link from "@/lib/i18n/navigation";
import { useCopy, useLocale } from "@/lib/i18n/context";
import { formatNumber } from "@/lib/i18n/config";
import { useProgressStore } from "@/lib/progress/store";
import {
  findReligiousCategory,
  religiousLessonCount,
  religiousLessonsOfCourse,
  religiousResourcesOfCourse,
  type ReligiousCourse,
} from "@/lib/religious";
import {
  ArrowLeft,
  BookOpen,
  Compass,
  FileText,
  ListChecks,
  UserRound,
} from "lucide-react";
import ReligiousCourseProgress from "./ReligiousCourseProgress";

const ICONS = {
  book: BookOpen,
  compass: Compass,
} as const;

const COPY = {
  ar: {
    course: (n: string) => `دورة ${n}`,
    lessons: (n: string) => `${n} دروس`,
    modules: (n: string) => `${n} وحدات`,
    pdfs: (n: string) => `${n} ملفات PDF`,
    start: "ابدأ الدورة",
    continue: "تابع من حيث توقفت",
    browse: "استعرض الدورة",
    soon: "لا توجد دروس منشورة بعد",
  },
  en: {
    course: (n: string) => `Course ${n}`,
    lessons: (n: string) => `${n} lessons`,
    modules: (n: string) => `${n} modules`,
    pdfs: (n: string) => `${n} PDF files`,
    start: "Start the course",
    continue: "Continue where you left off",
    browse: "Browse the course",
    soon: "No lessons published yet",
  },
} as const;

export default function ReligiousCourseCard({
  course,
  className = "",
}: {
  course: ReligiousCourse;
  className?: string;
}) {
  const c = useCopy(COPY);
  const locale = useLocale();
  const isAr = locale === "ar";
  const { ready, isDone } = useProgressStore();

  const Icon = ICONS[course.icon];
  const category = findReligiousCategory(course.category);
  const lessons = religiousLessonsOfCourse(course.id);
  const lessonIds = lessons.map((lesson) => lesson.id);
  const lessonCount = religiousLessonCount(course);
  const pdfCount = religiousResourcesOfCourse(course).filter(
    (resource) => resource.kind === "pdf"
  ).length;
  const next = ready ? lessons.find((lesson) => !isDone("religious", lesson.id)) : lessons[0];
  const started = ready && lessons.some((lesson) => isDone("religious", lesson.id));
  const href = next
    ? `/islamic-studies/${next.id}`
    : `/islamic-studies/course/${course.id}`;

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-colors hover:border-amber-500/30 ${className}`}
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-ink-950">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={course.cover}
          alt={isAr ? course.coverAlt : course.coverAltEn}
          width={1200}
          height={675}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/20 to-transparent" />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
          <span className="rounded-full border border-white/15 bg-ink-950/70 px-2.5 py-1 text-[11px] font-black text-amber-200 backdrop-blur">
            {c.course(formatNumber(course.number))}
          </span>
          {category && (
            <span className="rounded-full border border-cyan-400/25 bg-cyan-500/15 px-2.5 py-1 text-[11px] font-bold text-cyan-100 backdrop-blur">
              {isAr ? category.label : category.labelEn}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start gap-3">
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${course.color} text-ink-950`}
          >
            <Icon className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-black leading-7 text-white" dir="auto">
              {isAr ? course.title : course.titleEn}
            </h3>
            <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-bold text-amber-300">
              <UserRound className="h-3.5 w-3.5" aria-hidden />
              {isAr ? course.instructor : course.instructorEn}
            </p>
          </div>
        </div>

        <p
          dir="auto"
          className="mt-3 line-clamp-3 text-sm leading-7 text-slate-400"
        >
          {isAr ? course.description : course.descriptionEn}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
          {lessonCount > 0 ? (
            <>
              <span className="inline-flex items-center gap-1.5">
                <ListChecks className="h-3.5 w-3.5 text-amber-400" aria-hidden />
                {c.lessons(formatNumber(lessonCount))}
              </span>
              {course.modules.length > 0 && (
                <span>{c.modules(formatNumber(course.modules.length))}</span>
              )}
              {pdfCount > 0 && (
                <span className="inline-flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-emerald-400" aria-hidden />
                  {c.pdfs(formatNumber(pdfCount))}
                </span>
              )}
            </>
          ) : (
            <span className="rounded-full bg-white/5 px-2 py-0.5 font-bold text-slate-400">
              {c.soon}
            </span>
          )}
        </div>

        {lessonIds.length > 0 && (
          <div className="mt-3">
            <ReligiousCourseProgress lessonIds={lessonIds} />
          </div>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
          <Link
            href={href}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-amber-400 to-orange-500 px-4 py-2.5 text-sm font-black text-ink-950 hover:opacity-90"
          >
            {lessonCount === 0 ? c.browse : started ? c.continue : c.start}
            <ArrowLeft className="h-4 w-4 ltr:rotate-180" aria-hidden />
          </Link>
          {lessonCount > 0 && (
            <Link
              href={`/islamic-studies/course/${course.id}`}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-bold text-slate-300 hover:bg-white/5 hover:text-white"
            >
              {c.browse}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
