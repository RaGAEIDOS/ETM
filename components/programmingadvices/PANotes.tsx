"use client";

/**
 * Personal notes for a Programming Advices lesson.
 * Local-first: stored only in this browser under
 * etm-programmingadvices-notes-v1, included in Export/Delete my data, and
 * never committed or shown to anyone else. The panel also offers a direct
 * notes-only export and a delete action.
 */

import { useEffect, useState } from "react";
import { useCopy } from "@/lib/i18n/context";
import {
  deletePANotes,
  loadPANotes,
  savePANote,
} from "@/lib/programmingadvices-notes";
import { NotebookPen, Check, Download, Trash2 } from "lucide-react";

const COPY = {
  ar: {
    title: "ملاحظاتي",
    placeholder: "اكتب ملاحظاتك الخاصة عن هذا الدرس… (تُحفظ على جهازك فقط)",
    saved: "حُفظت",
    saving: "يُحفظ…",
    hint: "لا يراها أحد غيرك — تُحفظ محليًا في متصفحك وتشملها أدوات «تصدير/حذف بياناتي».",
    exportNotes: "صدّر ملاحظاتي",
    deleteNote: "احذف ملاحظة هذا الدرس",
    deleteAll: "احذف كل ملاحظات المسار",
    confirmDelete: "هل تريد حذف ملاحظة هذا الدرس؟",
    confirmDeleteAll: "هل تريد حذف كل ملاحظات Programming Advices من هذا الجهاز؟",
    deleted: "حُذفت",
  },
  en: {
    title: "My notes",
    placeholder: "Write your own notes for this lesson… (stored on your device only)",
    saved: "Saved",
    saving: "Saving…",
    hint: "Nobody else can see these — they live in your browser and are covered by Export/Delete my data.",
    exportNotes: "Export my notes",
    deleteNote: "Delete this lesson's note",
    deleteAll: "Delete all track notes",
    confirmDelete: "Delete this lesson's note?",
    confirmDeleteAll: "Delete every Programming Advices note from this device?",
    deleted: "Deleted",
  },
} as const;

export default function PANotes({ videoId }: { videoId: string }) {
  const c = useCopy(COPY);
  const [text, setText] = useState("");
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");

  useEffect(() => {
    const notes = loadPANotes();
    setText(notes[videoId]?.text ?? "");
    setReady(true);
  }, [videoId]);

  useEffect(() => {
    if (!ready) return;
    setState("saving");
    const timer = window.setTimeout(() => {
      savePANote(videoId, text);
      setState("saved");
    }, 600);
    return () => window.clearTimeout(timer);
  }, [text, videoId, ready]);

  const exportNotes = () => {
    try {
      const blob = new Blob([JSON.stringify(loadPANotes(), null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "etm-programmingadvices-notes.json";
      anchor.click();
      URL.revokeObjectURL(url);
    } catch {
      /* download may be blocked */
    }
  };

  const deleteCurrent = () => {
    if (!window.confirm(c.confirmDelete)) return;
    savePANote(videoId, "");
    setText("");
    setState("saved");
  };

  const deleteAll = () => {
    if (!window.confirm(c.confirmDeleteAll)) return;
    deletePANotes();
    setText("");
    setState("saved");
  };

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-lg font-bold text-white">
          <NotebookPen className="h-5 w-5 text-amber-400" />
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
        className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-7 text-white placeholder-slate-500 outline-none focus:border-amber-400/60"
      />
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={exportNotes}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white"
        >
          <Download className="h-3.5 w-3.5" />
          {c.exportNotes}
        </button>
        <button
          type="button"
          onClick={deleteCurrent}
          className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/25 px-3 py-1.5 text-xs font-bold text-rose-300 hover:bg-rose-500/10"
        >
          <Trash2 className="h-3.5 w-3.5" />
          {c.deleteNote}
        </button>
        <button
          type="button"
          onClick={deleteAll}
          className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/25 px-3 py-1.5 text-xs font-bold text-rose-300 hover:bg-rose-500/10"
        >
          <Trash2 className="h-3.5 w-3.5" />
          {c.deleteAll}
        </button>
      </div>
      <p className="mt-2 text-[11px] leading-5 text-slate-500">{c.hint}</p>
    </div>
  );
}
