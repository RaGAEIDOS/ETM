"use client";

/**
 * Personal notes for a Linux lesson. Stored locally only
 * (etm-linux-notes-v1) and covered by Export/Import/Delete my data.
 */

import { useEffect, useState } from "react";
import { useCopy } from "@/lib/i18n/context";
import { loadLinuxNotes, saveLinuxNote } from "@/lib/linux-notes";
import { NotebookPen, Check } from "lucide-react";

const COPY = {
  ar: {
    title: "ملاحظاتي",
    placeholder: "اكتب ملاحظاتك الخاصة عن هذا الدرس… (تُحفظ على جهازك فقط)",
    saved: "حُفظت",
    saving: "يُحفظ…",
    hint: "لا يراها أحد غيرك — تُحفظ محليًا في متصفحك وتشملها أدوات «تصدير/حذف بياناتي».",
  },
  en: {
    title: "My notes",
    placeholder: "Write your own notes for this lesson… (stored on your device only)",
    saved: "Saved",
    saving: "Saving…",
    hint: "Nobody else can see these — they live in your browser and are covered by Export/Delete my data.",
  },
} as const;

export default function LinuxNotes({ videoId }: { videoId: string }) {
  const c = useCopy(COPY);
  const [text, setText] = useState("");
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");

  // Hydrate from storage on mount (client-only value).
  useEffect(() => {
    const notes = loadLinuxNotes();
    setText(notes[videoId]?.text ?? "");
    setReady(true);
  }, [videoId]);

  // Debounced autosave.
  useEffect(() => {
    if (!ready) return;
    setState("saving");
    const timer = window.setTimeout(() => {
      saveLinuxNote(videoId, text);
      setState("saved");
    }, 600);
    return () => window.clearTimeout(timer);
  }, [text, videoId, ready]);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-lg font-bold text-white">
          <NotebookPen className="h-5 w-5 text-emerald-400" />
          {c.title}
        </h3>
        <span
          className={`inline-flex items-center gap-1.5 text-xs transition-opacity ${
            state === "saving" ? "text-slate-500" : "text-emerald-400"
          }`}
          aria-live="polite"
        >
          {state === "saving" ? c.saving : (<><Check className="h-3.5 w-3.5" />{c.saved}</>)}
        </span>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={c.placeholder}
        rows={7}
        dir="auto"
        className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-7 text-white placeholder-slate-500 outline-none focus:border-emerald-400/60"
      />
      <p className="mt-2 text-[11px] leading-5 text-slate-500">{c.hint}</p>
    </div>
  );
}
