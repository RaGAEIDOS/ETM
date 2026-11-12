"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { useCopy } from "@/lib/i18n/context";
import { useProgressStore } from "@/lib/progress/store";

const COPY = {
  ar: {
    markComplete: "علّم الفيديو كمكتمل",
    completed: "مكتمل — اضغط للتراجع",
  },
  en: {
    markComplete: "Mark video as watched",
    completed: "Watched — click to undo",
  },
} as const;

export default function ElzeroCompleteButton({
  videoId,
  section,
}: {
  videoId: string;
  section?: string;
}) {
  const c = useCopy(COPY);
  const { ready, isDone, toggle } = useProgressStore();
  const done = ready && isDone("elzero", videoId);

  return (
    <button
      type="button"
      aria-pressed={done}
      onClick={() => toggle("elzero", videoId, section)}
      className={`mt-3 inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-bold transition-all ${
        done
          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
          : "border-white/15 bg-white/5 text-white hover:bg-white/10"
      }`}
    >
      {done ? (
        <CheckCircle2 className="h-5 w-5" />
      ) : (
        <Circle className="h-5 w-5" />
      )}
      {done ? c.completed : c.markComplete}
    </button>
  );
}
