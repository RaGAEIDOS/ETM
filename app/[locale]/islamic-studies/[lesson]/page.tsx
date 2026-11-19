import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ExternalLink, UserRound, VideoOff } from "lucide-react";
import { localeFromParams, pageMetadata } from "@/lib/i18n/server";
import { localePath } from "@/lib/i18n/config";
import { allReligiousLessons, findReligiousLesson } from "@/lib/religious";
import ReligiousCompletionBar from "@/components/religious/ReligiousCompletionBar";
import ReligiousVideoFacade from "@/components/religious/ReligiousVideoFacade";

const COPY = {
  ar: {
    breadcrumb: "الدورات الدينية",
    lesson: "درس",
    videoMissingTitle: "فيديو الدرس لم يُضف بعد",
    videoMissingBody:
      "سيظهر الفيديو هنا بعد التحقق من الرابط الرسمي. يمكنك قراءة وصف الدرس وإتمامه، وسيُحفظ تقدمك.",
    resources: "روابط رسمية",
    previous: "الدرس السابق",
    next: "الدرس التالي",
    backToCourse: "العودة إلى الدورة",
    instructor: "المحاضر",
  },
  en: {
    breadcrumb: "Religious courses",
    lesson: "Lesson",
    videoMissingTitle: "This lesson's video has not been added yet",
    videoMissingBody:
      "The video will appear here after the official link is verified. You can still read the description and mark the lesson complete; your progress is saved.",
    resources: "Official links",
    previous: "Previous lesson",
    next: "Next lesson",
    backToCourse: "Back to the course",
    instructor: "Instructor",
  },
} as const;

export function generateStaticParams() {
  return allReligiousLessons().map(({ lesson }) => ({ lesson: lesson.id }));
}

export async function generateMetadata({
  params,
}: {
  params: { lesson: string; locale: string };
}): Promise<Metadata> {
  const locale = localeFromParams(params);
  const entry = findReligiousLesson(params.lesson);
  if (!entry) return { title: params.lesson };
  const isAr = locale === "ar";
  return pageMetadata({
    locale,
    path: `/islamic-studies/${entry.lesson.id}`,
    title: isAr ? entry.lesson.title : entry.lesson.titleEn,
    description: isAr ? entry.lesson.description : entry.lesson.descriptionEn,
  });
}

export default function ReligiousLessonPage({
  params,
}: {
  params: { lesson: string; locale: string };
}) {
  const locale = localeFromParams(params);
  const c = COPY[locale];
  const isAr = locale === "ar";
  const entry = findReligiousLesson(params.lesson);
  if (!entry) notFound();

  const { course, module, lesson } = entry;
  const siblings = allReligiousLessons().filter((item) => item.course.id === course.id);
  const index = siblings.findIndex((item) => item.lesson.id === lesson.id);
  const previous = index > 0 ? siblings[index - 1] : null;
  const next = index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
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
        <Link
          href={localePath(locale, `/islamic-studies/course/${course.id}`)}
          className="transition-colors hover:text-amber-300"
          dir="auto"
        >
          {isAr ? course.title : course.titleEn}
        </Link>
        <ChevronRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
        <span className="text-slate-300">{c.lesson}</span>
      </nav>

      <header>
        <span className="rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-xs font-black text-amber-200">
          {isAr ? module.title : module.titleEn}
        </span>
        <h1 className="mt-4 text-2xl font-black leading-snug text-white sm:text-3xl" dir="auto">
          {isAr ? lesson.title : lesson.titleEn}
        </h1>
        <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-amber-300">
          <UserRound className="h-4 w-4" aria-hidden />
          <span className="text-slate-500">{c.instructor}:</span>
          {isAr ? course.instructor : course.instructorEn}
        </p>
        <p className="mt-3 text-sm leading-8 text-slate-400" dir="auto">
          {isAr ? lesson.description : lesson.descriptionEn}
        </p>
      </header>

      <div className="mt-6">
        {lesson.youtubeId ? (
          <ReligiousVideoFacade
            youtubeId={lesson.youtubeId}
            title={isAr ? lesson.title : lesson.titleEn}
            locale={locale}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-6 text-center">
            <VideoOff className="mx-auto h-8 w-8 text-slate-500" aria-hidden />
            <h2 className="mt-3 text-lg font-black text-white">{c.videoMissingTitle}</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-slate-400">
              {c.videoMissingBody}
            </p>
          </div>
        )}
      </div>

      {lesson.resources && lesson.resources.length > 0 && (
        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-black text-white">{c.resources}</h2>
          <ul className="mt-3 space-y-2">
            {lesson.resources.map((resource) => (
              <li key={resource.url}>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-cyan-300 hover:text-cyan-200"
                >
                  <ExternalLink className="h-4 w-4" aria-hidden />
                  {resource.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <ReligiousCompletionBar lessonId={lesson.id} courseId={course.id} />

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        {previous ? (
          <Link
            href={localePath(locale, `/islamic-studies/${previous.lesson.id}`)}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-slate-200 hover:bg-white/10"
          >
            <ChevronRight className="h-4 w-4 rotate-180 rtl:rotate-0" aria-hidden />
            {c.previous}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={localePath(locale, `/islamic-studies/${next.lesson.id}`)}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-slate-200 hover:bg-white/10"
          >
            {c.next}
            <ChevronLeft className="h-4 w-4 rtl:rotate-180" aria-hidden />
          </Link>
        ) : (
          <Link
            href={localePath(locale, `/islamic-studies/course/${course.id}`)}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-slate-200 hover:bg-white/10"
          >
            {c.backToCourse}
          </Link>
        )}
      </div>
    </div>
  );
}
