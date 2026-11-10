"use client";

// Light, eager-loaded wrapper for the embedded lesson playground.
// The heavy <LessonPlaygroundEditor> (Prism, Wandbox client) is loaded ONLY
// on click via next/dynamic, keeping lesson pages fast.
import { useState } from "react";
import dynamic from "next/dynamic";
import { Code2, Sparkles, Loader2 } from "lucide-react";
import { tryItAllowed } from "@/lib/feature-flags";
import type { LessonPlaygroundEditorProps } from "./LessonPlaygroundEditor";

type Props = Omit<LessonPlaygroundEditorProps, "storage"> & {
  storage: LessonPlaygroundEditorProps["storage"] & {
    scope: "elzero" | "learn" | "glossary";
    number?: number;
  };
};

const Editor = dynamic(() => import("./LessonPlaygroundEditor"), {
  ssr: false,
  loading: () => (
    <div className="mt-3 rounded-xl border border-cyan-500/20 bg-white/[0.02] p-5 text-center text-xs text-slate-500">
      <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin text-cyan-400" />
      جارٍ تحميل المحرر…
    </div>
  ),
});

export default function LessonPlayground(props: Props) {
  const [open, setOpen] = useState(false);
  const { starterCode } = props;

  if (!tryItAllowed(props.storage)) return null;

  if (!open) {
    return (
      <div dir="rtl" className="mt-3">
        <button
          onClick={() => setOpen(true)}
          aria-label="جرّب هذا الكود بنفسك"
          className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition-colors min-h-[44px]"
        >
          <Code2 className="h-4 w-4" />
          جرّب الكود بنفسك
          <Sparkles className="h-3.5 w-3.5 text-amber-300" />
        </button>
      </div>
    );
  }

  return <Editor {...props} storage={props.storage} />;
}
