/**
 * "This week's workflow" card: Watch Lecture → Section → Shorts → Submit
 * Problem Set, with links to the official CS50 properties for that week.
 *
 * CS50 does not publish one shorts playlist per week: the week page lists that
 * week's shorts topic pages, and the channel keeps one official CS50 Shorts
 * playlist. Both are linked, so nothing is invented.
 */

import Link from "next/link";
import { ExternalLink, PlayCircle, Users, ListVideo, Wrench } from "lucide-react";
import { localePath } from "@/lib/i18n/config";
import {
  CS50X_PSETS_URL,
  CS50X_SHORTS_PLAYLIST_URL,
  type Cs50xWeek,
} from "@/lib/cs50x";

const COPY = {
  ar: {
    title: "خطة هذا الأسبوع",
    lecture: "شاهد المحاضرة",
    section: "السكشن",
    shorts: "الشورتس",
    pset: "سلّم التكليف",
    weekPage: "صفحة الأسبوع",
    shortsHint: "قائمة CS50 Shorts الرسمية",
    weekShorts: "شورتس الأسبوع على صفحته",
    allPsets: "كل التكاليف",
  },
  en: {
    title: "This week's workflow",
    lecture: "Watch lecture",
    section: "Section",
    shorts: "Shorts",
    pset: "Submit problem set",
    weekPage: "Week page",
    shortsHint: "Official CS50 Shorts playlist",
    weekShorts: "The week's shorts on its page",
    allPsets: "All problem sets",
  },
} as const;

export default function Cs50xWeekWorkflow({
  week,
  locale,
  showTitle = true,
}: {
  week: Cs50xWeek;
  locale: string;
  showTitle?: boolean;
}) {
  const c = COPY[locale === "en" ? "en" : "ar"];
  const loc = locale === "en" ? "en" : "ar";
  const sectionHref = week.sectionUrl ?? week.weekUrl;
  const psetHref = week.psetUrl ?? CS50X_PSETS_URL;

  const steps = [
    {
      key: "lecture",
      label: c.lecture,
      hint: c.weekPage,
      href: localePath(loc, `/cs50x/${week.lectureId}`),
      external: false,
      icon: PlayCircle,
      secondaryHref: week.weekUrl,
      secondaryLabel: c.weekPage,
    },
    {
      key: "section",
      label: c.section,
      hint: week.label,
      href: sectionHref,
      external: true,
      icon: Users,
    },
    {
      key: "shorts",
      label: c.shorts,
      hint: c.shortsHint,
      href: CS50X_SHORTS_PLAYLIST_URL,
      external: true,
      icon: ListVideo,
      secondaryHref: week.weekUrl,
      secondaryLabel: c.weekShorts,
    },
    {
      key: "pset",
      label: c.pset,
      hint: c.allPsets,
      href: psetHref,
      external: true,
      icon: Wrench,
      secondaryHref: CS50X_PSETS_URL,
      secondaryLabel: c.allPsets,
    },
  ] as const;

  return (
    <div className="rounded-2xl border border-rose-500/20 bg-rose-500/[0.04] p-4">
      {showTitle && (
        <h3 className="mb-3 text-sm font-black text-rose-200">{c.title}</h3>
      )}
      <ol className="grid gap-2 sm:grid-cols-2">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const body = (
            <>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-rose-400/25 bg-rose-500/10 font-mono text-[11px] font-black text-rose-300">
                {i + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <Icon className="h-3.5 w-3.5 text-rose-400" />
                  {step.label}
                </span>
                <span className="mt-0.5 block truncate text-[10px] text-slate-500">
                  {step.hint}
                </span>
              </span>
              <ExternalLink className="mt-1 h-3 w-3 shrink-0 text-slate-600" />
            </>
          );

          return (
            <li key={step.key}>
              {step.external ? (
                <a
                  href={step.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-2.5 transition-colors hover:border-rose-400/30 hover:bg-rose-500/[0.06]"
                >
                  {body}
                </a>
              ) : (
                <Link
                  href={step.href}
                  className="flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-2.5 transition-colors hover:border-rose-400/30 hover:bg-rose-500/[0.06]"
                >
                  {body}
                </Link>
              )}
              {"secondaryHref" in step && step.secondaryHref && (
                <a
                  href={step.secondaryHref}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-flex items-center gap-1 px-1 text-[10px] font-semibold text-slate-500 hover:text-rose-300"
                >
                  {step.secondaryLabel}
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
