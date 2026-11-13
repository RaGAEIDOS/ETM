"use client";

/**
 * Lesson panel under the embedded video — tabs: Summary / Key terms /
 * Practice / Notes. Arabic-first, fully bilingual, with code and English
 * terms isolated LTR. The `reviewed: false` notice is always visible on the
 * summary tab when the content was written from title/description only.
 */

import { useState } from "react";
import { useCopy, useLocale } from "@/lib/i18n/context";
import type { PAVideo } from "@/lib/programmingadvices-videos";
import { formatPADuration } from "@/lib/programmingadvices-videos";
import PAKeyTerms from "./PAKeyTerms";
import PAPractice from "./PAPractice";
import PANotes from "./PANotes";
import {
  FileText,
  Layers,
  ListChecks,
  NotebookPen,
  AlertCircle,
  ExternalLink,
  Clock3,
} from "lucide-react";

const COPY = {
  ar: {
    tabs: {
      summary: "الملخص",
      terms: "مصطلحات",
      practice: "تدرّب",
      notes: "ملاحظاتي",
    },
    summaryTitle: "ماذا ستتعلم في هذا الدرس",
    unreviewed:
      "هذا الملخص مبني على عنوان الفيديو ووصفه فقط ولم يُتحقق منه مقابل المحتوى — قد لا يعكس كل التفاصيل. لا توجد نصوص مفرّغة منشورة هنا.",
    original: "العنوان الأصلي على القناة",
    duration: "المدة",
    noTerms: "لا توجد مصطلحات بعد.",
    practiceHint: "تشمل التمارين: اختيار من متعدد، إجابة مكتوبة، تتبع تنفيذ، ومطابقة وترتيب.",
  },
  en: {
    tabs: {
      summary: "Summary",
      terms: "Key terms",
      practice: "Practice",
      notes: "My notes",
    },
    summaryTitle: "What you will learn in this lesson",
    unreviewed:
      "This summary is based only on the video title and description and has not been verified against the content — it may not reflect every detail. No transcripts are published here.",
    original: "Original title on the channel",
    duration: "Duration",
    noTerms: "No key terms yet.",
    practiceHint: "Drills include multiple choice, typed answers, dry-running, matching and ordering.",
  },
} as const;

export default function PALessonPanel({ video }: { video: PAVideo }) {
  const c = useCopy(COPY);
  const locale = useLocale();
  const isAr = locale === "ar";
  const [tab, setTab] = useState<"summary" | "terms" | "practice" | "notes">("summary");

  const tabs = [
    { id: "summary" as const, label: c.tabs.summary, icon: FileText },
    { id: "terms" as const, label: c.tabs.terms, icon: Layers },
    { id: "practice" as const, label: c.tabs.practice, icon: ListChecks },
    { id: "notes" as const, label: c.tabs.notes, icon: NotebookPen },
  ];

  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
      <div className="mb-5 flex flex-wrap gap-2" role="tablist" aria-label={c.tabs.summary}>
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold transition-colors ${
              tab === id
                ? "border-amber-400/60 bg-amber-500/15 text-amber-200"
                : "border-white/10 bg-white/[0.03] text-slate-400 hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {tab === "summary" && (
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-bold text-white">{c.summaryTitle}</h3>
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-400">
              <Clock3 className="h-3 w-3" />
              <span dir="ltr">{formatPADuration(video.duration)}</span>
            </span>
          </div>

          {!video.reviewed && (
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-amber-500/25 bg-amber-500/[0.08] px-4 py-3 text-xs leading-6 text-amber-100">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              <span>{c.unreviewed}</span>
            </div>
          )}

          <p dir="auto" className="text-sm leading-8 text-slate-300">
            {isAr ? video.summary : video.summaryEn}
          </p>

          <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{c.original}</p>
            <p dir="auto" className="mt-1 text-sm font-semibold leading-7 text-slate-200">
              {video.title}
            </p>
            <a
              href={video.youtube}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              YouTube
            </a>
          </div>

          <p className="mt-4 text-[11px] leading-5 text-slate-500">{c.practiceHint}</p>
        </div>
      )}

      {tab === "terms" && (
        <PAKeyTerms terms={video.terms} videoId={video.id} courseId={video.courseId} />
      )}

      {tab === "practice" && (
        <PAPractice items={video.practice} videoId={video.id} courseId={video.courseId} />
      )}

      {tab === "notes" && <PANotes videoId={video.id} />}
    </div>
  );
}
