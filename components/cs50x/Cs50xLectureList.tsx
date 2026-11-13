"use client";

/**
 * Week-by-week grid for the /cs50x hub.
 *
 * The official CS50x syllabus is 12 weeks (0–10 + AI) followed by the final
 * project. Each card carries the week's official thumbnail, the learner's done
 * state and the full "this week's workflow" (lecture → section → shorts →
 * problem set). The opening welcome video is linked separately.
 */

import Link from "next/link";
import { useCopy, useLocale } from "@/lib/i18n/context";
import { formatNumber, localePath } from "@/lib/i18n/config";
import { useProgressStore } from "@/lib/progress/store";
import {
  CS50X_FINAL_PROJECT,
  CS50X_LECTURES,
  CS50X_WEEKS,
  findCs50xLecture,
  isCs50xPilotWeek,
} from "@/lib/cs50x";
import YouTubeThumbnail from "@/components/YouTubeThumbnail";
import Cs50xWeekWorkflow from "@/components/cs50x/Cs50xWeekWorkflow";
import { CheckCircle2, ArrowLeft, GraduationCap } from "lucide-react";

const COPY = {
  ar: {
    intro: "ابدأ بمقدمة CS50x",
    minutes: "دقيقة",
    done: "مكتملة",
    pilot: "محتوى الطيار",
    finalTitle: "المشروع النهائي",
    finalBody:
      "بعد الأسبوع العاشر، ابنِ مشروعك النهائي وسلّمه عبر edX. استلهم من معرض مشاريع الطلاب الرسمي.",
    project: "صفحة المشروع النهائي",
    gallery: "معرض المشاريع",
  },
  en: {
    intro: "Start with the CS50x introduction",
    minutes: "min",
    done: "Completed",
    pilot: "Pilot content",
    finalTitle: "Final Project",
    finalBody:
      "After week 10, build your final project and submit it via edX. Browse the official gallery for inspiration.",
    project: "Final project page",
    gallery: "Project gallery",
  },
} as const;

export default function Cs50xLectureList() {
  const c = useCopy(COPY);
  const locale = useLocale();
  const { ready, isDone } = useProgressStore();
  const intro = findCs50xLecture("intro");

  return (
    <div>
      {intro && (
        <Link
          href={localePath(locale, `/cs50x/${intro.id}`)}
          className="mb-4 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-bold text-slate-300 transition-colors hover:border-rose-400/30 hover:text-white"
        >
          <GraduationCap className="h-4 w-4 text-rose-400" />
          {c.intro}
          <ArrowLeft className="h-4 w-4 ltr:rotate-180" />
        </Link>
      )}

      <ol className="grid gap-4">
        {CS50X_WEEKS.map((week) => {
          const lecture = CS50X_LECTURES.find((l) => l.id === week.lectureId);
          const done = ready && lecture ? isDone("cs50x", lecture.id) : false;
          const minutes = lecture
            ? Math.max(1, Math.round(lecture.durationSeconds / 60))
            : 0;

          return (
            <li
              key={week.id}
              className="rounded-2xl border border-white/10 bg-ink-900/60 p-4 transition-colors hover:border-rose-500/25 sm:p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row">
                {lecture && (
                  <Link
                    href={localePath(locale, `/cs50x/${lecture.id}`)}
                    className="group block w-full shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black sm:w-52"
                  >
                    <YouTubeThumbnail
                      youtubeId={lecture.youtubeId}
                      alt={`${week.label} — ${week.title}`}
                      width={416}
                      height={234}
                      className="aspect-video w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
                    />
                  </Link>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-gradient-to-l from-rose-400 to-orange-500 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-ink-950">
                      {week.label}
                    </span>
                    <h3 className="font-black text-white">{week.title}</h3>
                    {isCs50xPilotWeek(week.id) && (
                      <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                        {c.pilot}
                      </span>
                    )}
                    {done && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                        <CheckCircle2 className="h-3 w-3" />
                        {c.done}
                      </span>
                    )}
                    {lecture && (
                      <Link
                        href={localePath(locale, `/cs50x/${lecture.id}`)}
                        className="ms-auto inline-flex items-center gap-1 text-xs font-bold text-rose-300 hover:text-rose-200"
                      >
                        {`${formatNumber(minutes)} ${c.minutes}`}
                        <ArrowLeft className="h-3.5 w-3.5 ltr:rotate-180" />
                      </Link>
                    )}
                  </div>
                  <div className="mt-3">
                    <Cs50xWeekWorkflow week={week} locale={locale} />
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Final project */}
      <div className="mt-4 rounded-2xl border border-amber-500/25 bg-gradient-to-l from-amber-500/[0.08] to-rose-500/[0.06] p-5">
        <div className="flex flex-wrap items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-300">
            <GraduationCap className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="font-black text-white">{c.finalTitle}</h3>
            <p className="mt-1 text-sm leading-7 text-slate-400">{c.finalBody}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href={CS50X_FINAL_PROJECT.projectUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-200 hover:bg-amber-500/15"
              >
                {c.project}
              </a>
              <a
                href={CS50X_FINAL_PROJECT.galleryUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-300 hover:text-white"
              >
                {c.gallery}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
