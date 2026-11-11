"use client";

import Link from "@/lib/i18n/navigation";
import { useCopy, useLocale } from "@/lib/i18n/context";
import { ArrowLeft, BookOpen, CheckCircle2, PlayCircle } from "lucide-react";
import { useProgressStore } from "@/lib/progress/store";
import { findNextLesson } from "@/lib/stats";
import { stages } from "@/lib/data";
import { elzeroVideos } from "@/lib/elzero-videos";

const COPY = {
  ar: {
    label: "تابع من حيث توقفت",
    startCpp: "ابدأ رحلة C++",
    startElzero: "ابدأ رحلة ElZero",
    nextCpp: "الدرس التالي",
    nextElzero: "الفيديو التالي",
    cppDone: "أنهيت كل دروس C++! 🎉",
    elzeroDone: "أنهيت كل فيديوهات ElZero! 🎉",
    projectsCta: "تحدَّ نفسك بالمشاريع",
    curriculumCta: "راجع المنهج من البداية",
    lesson: "درس",
  },
  en: {
    label: "Continue where you left off",
    startCpp: "Start the C++ track",
    startElzero: "Start the ElZero track",
    nextCpp: "Next lesson",
    nextElzero: "Next video",
    cppDone: "You finished every C++ lesson! 🎉",
    elzeroDone: "You finished every ElZero video! 🎉",
    projectsCta: "Challenge yourself with projects",
    curriculumCta: "Review the curriculum from the start",
    lesson: "Lesson",
  },
} as const;

/**
 * "Continue where you left off" card. `variant` picks which track to resume:
 *  - "cpp"    → next incomplete C++ lesson (or first lesson if none started)
 *  - "elzero" → next incomplete ElZero video
 *  - "auto"   → whichever track saw activity most recently (default)
 */
export default function ResumeCard({
  variant = "auto",
}: {
  variant?: "auto" | "cpp" | "elzero";
}) {
  const locale = useLocale();
  const c = useCopy(COPY);
  const isAr = locale === "ar";
  const { stats, ready } = useProgressStore();

  const cppNext = ready ? findNextLesson({ ...stats.map }, stages) : null;
  const doneVideoIds = new Set(stats.doneVideoIds);
  const elzeroNext = ready
    ? elzeroVideos.find((v) => !doneVideoIds.has(v.id)) ?? null
    : null;

  let track: "cpp" | "elzero" = "cpp";
  if (variant === "elzero") track = "elzero";
  else if (variant === "cpp") track = "cpp";
  else {
    const cppAt = stats.lastActivityByTrack.cpp ?? "";
    const elzeroAt = stats.lastActivityByTrack.elzero ?? "";
    track = elzeroAt > cppAt ? "elzero" : "cpp";
    // If the preferred track is finished, resume the other one instead.
    if (track === "cpp" && !cppNext && elzeroNext) track = "elzero";
    else if (track === "elzero" && !elzeroNext && cppNext) track = "cpp";
  }

  if (!ready) {
    return (
      <div
        aria-hidden
        className="h-28 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]"
      />
    );
  }

  if (track === "cpp") {
    if (!cppNext) {
      return (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-emerald-400" />
            <p className="font-bold text-white">{c.cppDone}</p>
          </div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/20 px-4 py-2 text-sm font-bold text-emerald-300 hover:bg-emerald-500/30"
          >
            {c.projectsCta}
            <ArrowLeft className="h-4 w-4 ltr:rotate-180" />
          </Link>
        </div>
      );
    }
    const stageName = isAr ? cppNext.stage.name : cppNext.stage.nameEn;
    const courseTitle = isAr ? cppNext.courseTitle : cppNext.courseTitleEn;
    return (
      <div className="rounded-2xl border border-cyan-500/25 bg-gradient-to-l from-cyan-500/[0.08] to-violet-500/[0.08] p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300">
              <BookOpen className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-cyan-400">
                {c.label} · {c.nextCpp}
              </p>
              <h3 className="mt-1 font-black text-white leading-6">
                {isAr ? cppNext.lesson.title : cppNext.lesson.titleEn ?? cppNext.lesson.title}
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                {stageName} · {courseTitle}
              </p>
            </div>
          </div>
          <Link
            href={`/learn/${cppNext.stage.id}/${cppNext.courseId}/${cppNext.lesson.id}`}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-cyan-400 to-violet-500 px-5 py-2.5 text-sm font-bold text-ink-950 hover:opacity-90"
          >
            {c.nextCpp}
            <ArrowLeft className="h-4 w-4 ltr:rotate-180" />
          </Link>
        </div>
      </div>
    );
  }

  if (!elzeroNext) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-6 w-6 text-emerald-400" />
          <p className="font-bold text-white">{c.elzeroDone}</p>
        </div>
        <Link
          href="/curriculum"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/20 px-4 py-2 text-sm font-bold text-emerald-300 hover:bg-emerald-500/30"
        >
          {c.curriculumCta}
          <ArrowLeft className="h-4 w-4 ltr:rotate-180" />
        </Link>
      </div>
    );
  }
  const videoTitle = isAr ? elzeroNext.title : elzeroNext.titleEn;
  const section = isAr ? elzeroNext.section : elzeroNext.sectionEn;
  return (
    <div className="rounded-2xl border border-violet-500/25 bg-gradient-to-l from-violet-500/[0.08] to-fuchsia-500/[0.08] p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
            <PlayCircle className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-violet-400">
              {c.label} · {c.nextElzero}
            </p>
            <h3 className="mt-1 font-black text-white leading-6" dir="auto">
              #{elzeroNext.id} — {videoTitle}
            </h3>
            <p className="mt-1 text-xs text-slate-400">{section}</p>
          </div>
        </div>
        <Link
          href={`/elzero/${elzeroNext.id}`}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-violet-400 to-fuchsia-500 px-5 py-2.5 text-sm font-bold text-ink-950 hover:opacity-90"
        >
          {c.nextElzero}
          <ArrowLeft className="h-4 w-4 ltr:rotate-180" />
        </Link>
      </div>
    </div>
  );
}
