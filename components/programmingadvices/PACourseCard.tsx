"use client";

/** Hub card for one Programming Advices course: count, progress, continue. */

import Link from "@/lib/i18n/navigation";
import { useCopy, useLocale } from "@/lib/i18n/context";
import { formatNumber, localePath } from "@/lib/i18n/config";
import { useProgressStore } from "@/lib/progress/store";
import {
  paVideosOfCourse,
  type PACourse,
} from "@/lib/programmingadvices-videos";
import PACourseProgress from "./PACourseProgress";
import { Binary, Network, ArrowLeft, PlayCircle, ListChecks, Globe2 } from "lucide-react";

const ICONS = {
  foundations: Binary,
  algorithms: Network,
} as const;

const COPY = {
  ar: {
    continue: "تابع من حيث توقفت",
    start: "ابدأ الدورة",
    browse: "استعرض الدورة",
    videos: (n: string) => `${n} فيديو في القائمة الرسمية`,
    available: (n: string, total: string) => `${n} من ${total} متاح الآن`,
    official: "الصفحة الرسمية للدورة",
    soon: "دروس هذه الدورة تُضاف على دفعات بعد اعتماد المرحلة التجريبية.",
  },
  en: {
    continue: "Continue where you left off",
    start: "Start the course",
    browse: "Browse the course",
    videos: (n: string) => `${n} videos in the official playlist`,
    available: (n: string, total: string) => `${n} of ${total} available now`,
    official: "Official course page",
    soon: "This course's lessons are added in batches after the pilot is approved.",
  },
} as const;

export default function PACourseCard({ course }: { course: PACourse }) {
  const c = useCopy(COPY);
  const locale = useLocale();
  const { ready, isDone } = useProgressStore();
  const videos = paVideosOfCourse(course.id);
  const Icon = ICONS[course.icon];

  const next = ready ? videos.find((v) => !isDone("programmingadvices", v.id)) ?? videos[0] : videos[0];
  const href = next
    ? localePath(locale, `/programmingadvices/${next.id}`)
    : localePath(locale, `/programmingadvices/course/${course.id}`);
  const started = ready && videos.some((v) => isDone("programmingadvices", v.id));

  return (
    <div className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-start gap-4">
        <span
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${course.color} text-ink-950`}
        >
          <Icon className="h-7 w-7" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-black uppercase tracking-widest text-amber-400">
            {locale === "ar" ? `كورس ${formatNumber(course.number)}` : `Course ${formatNumber(course.number)}`}
          </p>
          <h2 className="mt-1 text-lg font-black leading-7 text-white" dir="auto">
            {locale === "ar" ? course.shortTitle : course.shortTitleEn}
          </h2>
          <p dir="auto" className="mt-2 text-sm leading-7 text-slate-400 line-clamp-3">
            {locale === "ar" ? course.description : course.descriptionEn}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <ListChecks className="h-4 w-4 text-amber-400" />
          {c.videos(formatNumber(course.videoCount))}
        </span>
        <span dir="ltr" className="font-mono text-[11px] text-slate-500">
          {c.available(formatNumber(videos.length), formatNumber(course.videoCount))}
        </span>
        <a
          href={course.officialPageUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 font-bold text-cyan-300 hover:text-cyan-200"
        >
          <Globe2 className="h-3.5 w-3.5" />
          {c.official}
        </a>
      </div>

      <div className="mt-4">
        <PACourseProgress videoIds={videos.map((v) => v.id)} declaredCount={course.videoCount} />
      </div>

      {videos.length === 0 && (
        <p className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-3 text-xs leading-6 text-slate-500">
          {c.soon}
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Link
          href={href}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-amber-400 to-orange-500 px-5 py-2.5 text-sm font-black text-ink-950 hover:opacity-90"
        >
          <PlayCircle className="h-4 w-4" />
          {videos.length === 0 ? c.browse : started ? c.continue : c.start}
          <ArrowLeft className="h-4 w-4 ltr:rotate-180" />
        </Link>
        <Link
          href={localePath(locale, `/programmingadvices/course/${course.id}`)}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-bold text-slate-300 hover:text-white"
        >
          {c.browse}
        </Link>
      </div>
    </div>
  );
}
