import type { Metadata } from "next";
import Link from "next/link";
import { PlayCircle, BookMarked, ListChecks, GraduationCap } from "lucide-react";
import { elzeroVideos, sectionsList } from "@/lib/elzero-videos";

export const metadata: Metadata = {
  title: "ElZero Videos",
  description:
    "The Fundamentals of Programming with C++ ElZero playlist: 78 videos, each with a summary, key terms and a quick quiz — from the intro to pointers.",
};

export default function ElzeroPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-12">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-sm font-bold text-cyan-300">
          <GraduationCap className="h-4 w-4" />
          The ElZero path — Fundamentals Of Programming With C++
        </span>
        <h1 className="mt-5 text-3xl sm:text-5xl font-black text-white leading-tight">
          ElZero <span className="gradient-text">Videos</span>
        </h1>
        <p className="mt-4 text-slate-400 leading-8 text-base sm:text-lg">
          Every video from the{" "}
          <strong className="text-white">78-episode playlist</strong> has a{" "}
          <strong className="text-white">quick summary</strong> +{" "}
          <strong className="text-white">key terms</strong> +{" "}
          <strong className="text-white">a quick quiz</strong>. Watch the original
          on YouTube, come back here for the review and quiz — and finish each
          video before moving to the next one.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
          <a
            href="https://www.youtube.com/playlist?list=PLDoPjvoNmBAwy-rS6WKudwVeb_x63EzgS"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-cyan-400 to-violet-500 px-5 py-3 font-bold text-ink-950 hover:opacity-90"
          >
            <PlayCircle className="h-5 w-5" />
            Open the YouTube playlist
          </a>
          <Link
            href="/learn/stage-1/elzero-fundamentals/zero-intro"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 font-bold text-white hover:bg-white/10"
          >
            Start from the first lesson
          </Link>
        </div>
      </div>

      <div className="grid gap-2 sm:gap-3 sm:grid-cols-2 lg:grid-cols-5 mb-10">
        {sectionsList.map((s) => (
          <a
            key={s.en}
            href={`#sec-${s.en.replace(/\s+/g, "-")}`}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:border-cyan-500/30 transition-colors block"
          >
            <div className="text-xs font-bold text-cyan-400">{s.range}</div>
            <div className="mt-1 font-bold text-white text-sm">{s.ar}</div>
            <div className="text-xs text-slate-500" dir="ltr">
              {s.en}
            </div>
          </a>
        ))}
      </div>

      <div className="space-y-12">
        {sectionsList.map((sec) => {
          const vids = elzeroVideos.filter((v) => v.sectionEn === sec.en);
          if (!vids.length) return null;
          return (
            <section key={sec.en} id={`sec-${sec.en.replace(/\s+/g, "-")}`}>
              <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
                <div>
                  <h2 className="text-2xl font-black text-white">
                    {sec.ar}{" "}
                    <span className="text-sm font-medium text-slate-500 font-mono">
                      {sec.range}
                    </span>
                  </h2>
                  <p className="text-sm text-slate-500" dir="ltr">
                    {sec.en}
                  </p>
                </div>
                <span className="text-sm text-slate-400">
                  {vids.length} videos
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {vids.map((v) => (
                  <Link
                    key={v.id}
                    href={`/elzero/${v.id}`}
                    className="group rounded-2xl border border-white/10 bg-ink-900/60 p-5 hover:border-cyan-500/30 transition-all hover:-translate-y-0.5 block"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs font-mono text-cyan-300">
                        #{v.id}
                      </span>
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 text-ink-950 shrink-0">
                        <PlayCircle className="h-5 w-5" />
                      </span>
                    </div>
                    <h3 className="mt-3 font-black text-white leading-7 group-hover:text-cyan-300 transition-colors">
                      {v.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono" dir="ltr">
                      {v.titleEn}
                    </p>
                    <p className="mt-3 text-sm text-slate-400 leading-6 line-clamp-2">
                      {v.summary}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 px-3 py-1 text-violet-300">
                        <BookMarked className="h-3 w-3" />
                        {v.terms.length} terms
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 text-cyan-300">
                        <ListChecks className="h-3 w-3" />
                        {v.quiz.length} questions
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
