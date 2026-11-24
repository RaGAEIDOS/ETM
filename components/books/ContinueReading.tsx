"use client";

import Link from "next/link";
import { ArrowLeft, Bookmark, BookOpen } from "lucide-react";
import { formatNumber, localePath, type Locale } from "@/lib/i18n/config";
import { latestBookProgress } from "@/lib/progress/core";
import { useProgressStore } from "@/lib/progress/store";

const COPY = {
  ar: {
    start: "ابدأ القراءة",
    resume: (page: number) => `متابعة من صفحة ${formatNumber(page)}`,
    saved: (percent: number) => `${formatNumber(percent)}% من الكتاب`,
  },
  en: {
    start: "Start reading",
    resume: (page: number) => `Continue from page ${formatNumber(page)}`,
    saved: (percent: number) => `${formatNumber(percent)}% of the book`,
  },
} as const;

/**
 * Reader CTA that resumes from the last saved page of a hosted book.
 * Renders the neutral "start reading" label until the progress store is
 * hydrated, so server and client markup match on the first paint.
 */
export default function ContinueReading({
  slug,
  locale,
  className = "",
  align = "start",
}: {
  slug: string;
  locale: Locale;
  className?: string;
  align?: "start" | "center";
}) {
  const c = COPY[locale];
  const store = useProgressStore();
  const progress = store.ready ? latestBookProgress(store.file.events, slug) : null;
  const percent =
    progress && progress.total > 0
      ? Math.min(100, Math.round((progress.page / progress.total) * 100))
      : 0;
  const Icon = progress ? Bookmark : BookOpen;

  return (
    <Link
      href={localePath(locale, `/books/self-development/${slug}/read`)}
      className={`group inline-flex items-center gap-3 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2.5 text-sm font-bold text-cyan-200 transition-colors hover:border-cyan-400/50 hover:bg-cyan-500/20 ${
        align === "center" ? "justify-center" : ""
      } ${className}`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="flex flex-col text-start">
        <span>{progress ? c.resume(progress.page) : c.start}</span>
        {progress && percent > 0 && (
          <span className="text-[10px] font-bold text-cyan-400/80">{c.saved(percent)}</span>
        )}
      </span>
      <ArrowLeft
        className={`h-4 w-4 shrink-0 transition-transform group-hover:-translate-x-0.5 ${
          locale === "ar" ? "" : "rotate-180"
        }`}
      />
    </Link>
  );
}
