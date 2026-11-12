"use client";

import Link from "@/lib/i18n/navigation";
import { useCopy, useLocale } from "@/lib/i18n/context";
import { formatNumber } from "@/lib/i18n/config";
import { ArrowLeft, Target } from "lucide-react";
import { stages } from "@/lib/data";
import { elzeroVideos } from "@/lib/elzero-videos";
import type { DerivedProgress } from "@/lib/progress/core";

const COPY = {
  ar: {
    title: "تحتاج تركيزاً",
    empty: "لا توجد بيانات كافية بعد — حل المزيد من الاختبارات لتظهر هنا.",
    practice: "تدرّب الآن",
    accuracy: "دقة",
    attempts: (n: number) => `${formatNumber(n)} محاولات`,
  },
  en: {
    title: "Needs focus",
    empty: "Not enough data yet — answer more quiz questions to see insights.",
    practice: "Practice now",
    accuracy: "accuracy",
    attempts: (n: number) => `${formatNumber(n)} attempts`,
  },
} as const;

function topicLabel(topic: string, isAr: boolean): string {
  for (const s of stages) {
    for (const c of s.courses) {
      if (c.id === topic) return isAr ? c.title : c.titleEn;
    }
  }
  for (const v of elzeroVideos) {
    if (v.section === topic || v.sectionEn === topic) {
      return isAr ? v.section : v.sectionEn;
    }
  }
  return topic;
}

function topicHref(topic: string): string {
  for (const s of stages) {
    for (const c of s.courses) {
      if (c.id === topic) return `/learn/${s.id}/${c.id}`;
    }
  }
  return "/elzero";
}

/** Weakest quiz topics (≥2 attempts), lowest accuracy first. */
export default function WeakTopics({
  weakTopics,
}: {
  weakTopics: DerivedProgress["weakTopics"];
}) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const c = useCopy(COPY);
  const top = weakTopics.slice(0, 4);

  return (
    <div className="rounded-2xl border border-white/10 bg-ink-900/60 p-6">
      <h2 className="flex items-center gap-2 font-black text-white">
        <Target className="h-5 w-5 text-amber-400" />
        {c.title}
      </h2>
      {top.length === 0 ? (
        <p className="mt-4 text-sm text-slate-400 leading-7">{c.empty}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {top.map((t) => (
            <li
              key={t.topic}
              className="rounded-xl border border-amber-500/15 bg-amber-500/[0.04] p-3"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-bold text-white leading-6">
                  {topicLabel(t.topic, isAr)}
                </span>
                <span className="shrink-0 text-xs font-bold text-amber-300">
                  {formatNumber(t.accuracy)}% {c.accuracy}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="text-[11px] text-slate-500">
                  {c.attempts(t.attempts)}
                </span>
                <Link
                  href={topicHref(t.topic)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-amber-300 hover:text-amber-200"
                >
                  {c.practice}
                  <ArrowLeft className="h-3.5 w-3.5 ltr:rotate-180" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
