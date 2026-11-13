"use client";

/**
 * Compact row for one ElZero Web video on a course page. Links to the
 * internal video page; shows done state from the unified progress store.
 */

import Link from "next/link";
import { useCopy, useLocale } from "@/lib/i18n/context";
import { formatNumber, localePath } from "@/lib/i18n/config";
import { useProgressStore } from "@/lib/progress/store";
import YouTubeThumbnail from "@/components/YouTubeThumbnail";
import { formatDuration } from "@/lib/elzero-web-track";
import { Clock, CheckCircle2, AlertCircle } from "lucide-react";

const COPY = {
  ar: {
    pending: "قيد المراجعة",
    watched: "تمّت",
  },
  en: {
    pending: "Pending review",
    watched: "Watched",
  },
} as const;

export default function ElzeroWebVideoCard({
  id,
  number,
  title,
  duration,
  youtubeId,
  reviewed,
}: {
  id: string;
  number: number;
  title: string;
  duration: string;
  youtubeId: string;
  reviewed: boolean;
}) {
  const c = useCopy(COPY);
  const locale = useLocale();
  const { ready, isDone } = useProgressStore();
  const done = ready && isDone("elzero-web", id);

  return (
    <Link
      href={localePath(locale, `/elzero-web/${id}`)}
      className="group flex gap-4 rounded-2xl border border-white/10 bg-ink-900/60 p-3 hover:border-cyan-500/30 transition-all hover:-translate-y-0.5"
    >
      <span className="relative block w-36 sm:w-40 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black self-start">
        <YouTubeThumbnail
          youtubeId={youtubeId}
          alt={title}
          className="aspect-video w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
        />
        {done && (
          <span className="absolute inset-0 flex items-center justify-center bg-emerald-950/60">
            <CheckCircle2 className="h-8 w-8 text-emerald-300" />
          </span>
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2 text-[11px]">
          <span className="rounded-full bg-white/5 border border-white/10 px-2 py-0.5 font-mono text-cyan-300">
            #{formatNumber(number)}
          </span>
          <span className="inline-flex items-center gap-1 text-slate-500">
            <Clock className="h-3 w-3" />
            <span dir="ltr">{formatDuration(duration)}</span>
          </span>
          {!reviewed && (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-bold text-amber-300">
              <AlertCircle className="h-3 w-3" />
              {c.pending}
            </span>
          )}
        </span>
        <span
          dir="auto"
          className="mt-1.5 block font-bold text-sm leading-6 text-white transition-colors group-hover:text-cyan-300 line-clamp-2"
        >
          {title}
        </span>
      </span>
    </Link>
  );
}
