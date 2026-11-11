"use client";

/**
 * Interactive lesson panel under the video — tabs: Summary / Key terms /
 * Practice / Speaking / Notes. Content is Arabic-first; English material
 * stays in English.
 */

import { useState } from "react";
import { useCopy } from "@/lib/i18n/context";
import type { EnglishVideo } from "@/lib/english-videos";
import EnglishKeyTerms from "./EnglishKeyTerms";
import EnglishPractice from "./EnglishPractice";
import EnglishSpeaking from "./EnglishSpeaking";
import EnglishNotes from "./EnglishNotes";
import { FileText, Layers, ListChecks, Mic, NotebookPen, AlertCircle } from "lucide-react";

const COPY = {
  ar: {
    tabs: {
      summary: "الملخص",
      terms: "مصطلحات",
      practice: "تدرّب",
      speaking: "تحدث",
      notes: "ملاحظاتي",
    },
    summaryTitle: "ماذا ستتعلم في هذا الفيديو",
    unreviewed: "هذا الملخص مبني على عنوان الفيديو ووصفه فقط ولم يُتحقق منه مقابل المحتوى — قد لا يعكس كل التفاصيل.",
    original: "العنوان الأصلي على القناة",
  },
  en: {
    tabs: {
      summary: "Summary",
      terms: "Key terms",
      practice: "Practice",
      speaking: "Speaking",
      notes: "My notes",
    },
    summaryTitle: "What you'll learn in this video",
    unreviewed: "This summary is based on the video's title and description only — not verified against the content. It may miss details.",
    original: "Original title on the channel",
  },
} as const;

const TABS = [
  { id: "summary", icon: FileText },
  { id: "terms", icon: Layers },
  { id: "practice", icon: ListChecks },
  { id: "speaking", icon: Mic },
  { id: "notes", icon: NotebookPen },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function EnglishLessonPanel({ video }: { video: EnglishVideo }) {
  const c = useCopy(COPY);
  const [tab, setTab] = useState<TabId>("summary");

  return (
    <div className="mt-6">
      <div role="tablist" aria-label={c.tabs.summary} className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map(({ id, icon: Icon }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              role="tab"
              aria-selected={active}
              onClick={() => setTab(id)}
              className={`flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition-colors ${
                active
                  ? "border-emerald-400/50 bg-emerald-500/15 text-emerald-300"
                  : "border-white/10 bg-white/[0.03] text-slate-400 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {c.tabs[id]}
            </button>
          );
        })}
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
        {tab === "summary" && (
          <div role="tabpanel">
            <h3 className="text-lg font-bold text-white">{c.summaryTitle}</h3>
            <p dir="rtl" className="mt-3 leading-8 text-slate-300">{video.summary}</p>
            <p className="mt-4 text-xs uppercase tracking-wide text-slate-500">{c.original}</p>
            <p dir="ltr" className="mt-1 text-sm font-semibold text-slate-300">{video.titleEn}</p>
            {!video.reviewed && (
              <p className="mt-4 flex items-start gap-2 rounded-xl border border-amber-500/25 bg-amber-500/[0.08] px-4 py-3 text-xs leading-6 text-amber-200">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {c.unreviewed}
              </p>
            )}
          </div>
        )}
        {tab === "terms" && (
          <div role="tabpanel">
            <EnglishKeyTerms terms={video.terms} videoId={video.id} courseId={video.courseId} />
          </div>
        )}
        {tab === "practice" && (
          <div role="tabpanel">
            <EnglishPractice items={video.practice} videoId={video.id} courseId={video.courseId} />
          </div>
        )}
        {tab === "speaking" && (
          <div role="tabpanel">
            <EnglishSpeaking terms={video.terms} />
          </div>
        )}
        {tab === "notes" && (
          <div role="tabpanel">
            <EnglishNotes videoId={video.id} />
          </div>
        )}
      </div>
    </div>
  );
}
