import Link from "next/link";
import { ArrowLeft, MoonStar } from "lucide-react";
import { formatNumber, localePath, type Locale } from "@/lib/i18n/config";
import {
  religiousCourses,
  religiousLessonCount,
  religiousResourcesOfCourse,
} from "@/lib/religious";
import ReligiousCourseCard from "./ReligiousCourseCard";

const COPY = {
  ar: {
    eyebrow: "علوم شرعية",
    title: "كورسات دينية",
    lead: "مسار متكامل يجمع دورتين كاملتين في أصول الدين والوعي المعاصر — بمحاضراتهما ومددهما وملفاتهما، وبنفس تجربة التعلم والتتبع في ETM.",
    cta: "كل الكورسات الدينية",
    note: (lessons: string, pdfs: string) =>
      `المنهجان كاملان الآن: ${lessons} محاضرة و${pdfs} ملفات PDF ومصادر رسمية.`,
  },
  en: {
    eyebrow: "Islamic studies",
    title: "Religious courses",
    lead: "A complete track with two full courses in faith foundations and contemporary awareness — lectures, durations and files included, with the same learning and progress experience as ETM.",
    cta: "All religious courses",
    note: (lessons: string, pdfs: string) =>
      `Both curricula are complete: ${lessons} lectures and ${pdfs} PDF files with official sources.`,
  },
} as const;

export default function ReligiousCoursesBand({ locale }: { locale: Locale }) {
  const c = COPY[locale];
  const lessonCount = religiousCourses.reduce(
    (total, course) => total + religiousLessonCount(course),
    0
  );
  const pdfCount = religiousCourses.reduce(
    (total, course) =>
      total +
      religiousResourcesOfCourse(course).filter((resource) => resource.kind === "pdf").length,
    0
  );

  return (
    <section
      aria-labelledby="religious-courses-title"
      className="bg-gradient-to-b from-amber-500/[0.04] via-transparent to-cyan-500/[0.03] py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-xs font-black text-amber-200">
              <MoonStar className="h-3.5 w-3.5" aria-hidden />
              {c.eyebrow}
            </span>
            <h2
              id="religious-courses-title"
              className="mt-3 text-3xl font-black text-white sm:text-4xl"
            >
              {c.title}
            </h2>
            <p className="mt-3 text-base leading-8 text-slate-400 sm:text-lg">{c.lead}</p>
          </div>
          <Link
            href={localePath(locale, "/islamic-studies")}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-bold text-white hover:bg-white/10"
          >
            {c.cta}
            <ArrowLeft className="h-4 w-4 ltr:rotate-180" aria-hidden />
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {religiousCourses.map((course) => (
            <ReligiousCourseCard key={course.id} course={course} />
          ))}
        </div>

        <p className="mt-4 text-xs leading-6 text-slate-500">
          {c.note(formatNumber(lessonCount), formatNumber(pdfCount))}
        </p>
      </div>
    </section>
  );
}
