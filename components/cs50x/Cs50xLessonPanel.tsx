"use client";

/**
 * Interactive lesson panel under the lecture video — tabs: Summary / Key terms /
 * Practice / My notes. Arabic-first UI; lecture content stays in English.
 */

import { useState } from "react";
import { useCopy } from "@/lib/i18n/context";
import type { Cs50xLecture } from "@/lib/cs50x";
import Cs50xKeyTerms from "./Cs50xKeyTerms";
import Cs50xPractice from "./Cs50xPractice";
import Cs50xNotes from "./Cs50xNotes";
import { FileText, Layers, ListChecks, NotebookPen, AlertCircle } from "lucide-react";

const COPY = {
  ar: {
    tabs: {
      summary: "الملخص",
      terms: "مصطلحات",
      practice: "تدرّب",
      notes: "ملاحظاتي",
    },
    summaryTitle: "ماذا ستتعلم في هذه المحاضرة",
    unreviewed:
      "هذا الملخص مبني على عنوان المحاضرة فقط ولم يُتحقق منه مقابل المحتوى — شاهده على يوتيوب للمحتوى الأصلي الكامل.",
    original: "العنوان الأصلي على القناة",
  },
  en: {
    tabs: {
      summary: "Summary",
      terms: "Key terms",
      practice: "Practice",
      notes: "My notes",
    },
    summaryTitle: "What you'll learn in this lecture",
    unreviewed:
      "This summary is based on the lecture title only — not verified against the content. Watch the original video for the full material.",
    original: "Original title on the channel",
  },
} as const;

const TABS = [
  { id: "summary", icon: FileText },
  { id: "terms", icon: Layers },
  { id: "practice", icon: ListChecks },
  { id: "notes", icon: NotebookPen },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function Cs50xLessonPanel({ lecture }: { lecture: Cs50xLecture }) {
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
                  ? "border-rose-400/50 bg-rose-500/15 text-rose-300"
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
            <p dir="rtl" className="mt-3 leading-8 text-slate-300">{lecture.summary}</p>
            <p className="mt-4 text-xs uppercase tracking-wide text-slate-500">{c.original}</p>
            <p dir="ltr" className="mt-1 text-sm font-semibold text-slate-300">{lecture.title}</p>
            {!lecture.reviewed && (
              <p className="mt-4 flex items-start gap-2 rounded-xl border border-amber-500/25 bg-amber-500/[0.08] px-4 py-3 text-xs leading-6 text-amber-200">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {c.unreviewed}
              </p>
            )}
          </div>
        )}
        {tab === "terms" && (
          <div role="tabpanel">
            <Cs50xKeyTerms terms={lecture.terms} videoId={lecture.id} courseId="cs50x" />
          </div>
        )}
        {tab === "practice" && (
          <div role="tabpanel">
            <Cs50xPractice items={lecture.practice} lectureId={lecture.id} topic="cs50x" />
          </div>
        )}
        {tab === "notes" && (
          <div role="tabpanel">
            <Cs50xNotes videoId={lecture.id} />
          </div>
        )}
      </div>
    </div>
  );
}
