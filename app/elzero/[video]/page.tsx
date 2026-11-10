import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  PlayCircle,
  Clock,
  ChevronLeft,
  BookMarked,
  ListChecks,
  PenLine,
  Lightbulb,
  CheckCircle2,
} from "lucide-react";
import { elzeroVideos, findVideo, videoIndex } from "@/lib/elzero-videos";
import Quiz from "@/components/Quiz";
import CodeBlock from "@/components/CodeBlock";

export function generateStaticParams() {
  return elzeroVideos.map((v) => ({ video: v.id }));
}

export async function generateMetadata({
  params,
}: {
  params: { video: string };
}): Promise<Metadata> {
  const v = findVideo(params.video);
  if (!v) return { title: "Video not found" };
  return {
    title: `Video #${v.id}: ${v.title}`,
    description: v.summary,
  };
}

export default function ElzeroVideoPage({
  params,
}: {
  params: { video: string };
}) {
  const v = findVideo(params.video);
  if (!v) notFound();
  const idx = videoIndex(params.video);
  const prev = idx > 0 ? elzeroVideos[idx - 1] : null;
  const next =
    idx >= 0 && idx < elzeroVideos.length - 1 ? elzeroVideos[idx + 1] : null;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-10" dir="rtl">
      <nav className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500 mb-6" dir="ltr">
        <Link href="/elzero" className="hover:text-cyan-300 transition-colors">
          ElZero Videos
        </Link>
        <ChevronLeft className="h-4 w-4" />
        <span className="text-slate-300">Video #{v.id}</span>
      </nav>

      <header>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-gradient-to-l from-cyan-400 to-violet-500 px-3 py-1 text-xs font-bold text-ink-950">
            {v.section}
          </span>
          <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-slate-400 font-mono">
            Video #{v.id} of 78
          </span>
          <span className="flex items-center gap-1 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-slate-400">
            <Clock className="h-3 w-3" />
            Quiz + summary + terms
          </span>
        </div>
        <h1 className="mt-4 text-3xl sm:text-4xl font-black text-white leading-tight">
          {v.title}
        </h1>
        <p className="mt-1 text-sm font-mono text-slate-500" dir="ltr">
          {v.titleEn} — {v.sectionEn}
        </p>
        <a
          href={v.youtube}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-cyan-400 to-violet-500 px-5 py-3 font-bold text-ink-950 hover:opacity-90"
        >
          <PlayCircle className="h-5 w-5" />
          Watch on YouTube
        </a>
      </header>

      <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-8">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/15 text-sm font-black text-cyan-300">
            1
          </span>
          Video summary
        </h2>
        <p className="text-slate-300 leading-8">{v.summary}</p>
        <p className="mt-4 text-sm text-slate-500 leading-7">
          For the full understanding, watch the original video on Osama ElZero&apos;s
          channel from the link above, then come back for the quiz. The content here
          is an original ETM summary — we do not copy the video text. All phrasing and
          explanations are ours, assembled in the official ElZero order on GitHub.
        </p>
      </section>

      {v.example && (
        <div className="mt-6">
          <h2 className="flex items-center gap-2 text-xl font-bold text-white mb-4">
            <ListChecks className="h-5 w-5 text-cyan-400" />
            Code example
          </h2>
          <CodeBlock
            code={v.example.code}
            language="cpp"
            title={v.example.title}
            playground={{
              scope: "elzero",
              id: v.id,
              number: v.number,
              lessonTitle: v.title,
              title: v.example.title,
            }}
          />
          <Link
            href={`/playground?code=${encodeURIComponent(v.example.code)}`}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500/15 border border-amber-500/30 px-4 py-2 text-sm font-bold text-amber-300 hover:bg-amber-500/25 transition-colors"
          >
            <Lightbulb className="h-4 w-4" />
            Try it in the playground
          </Link>
        </div>
      )}

      <section className="mt-8 rounded-2xl border border-violet-500/20 bg-violet-500/[0.05] p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold text-violet-300">
          <BookMarked className="h-5 w-5" />
          Key terms in this video
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {v.terms.map((t) => (
            <div key={t.en} className="rounded-xl border border-white/10 bg-ink-900/60 p-4">
              <span className="font-mono font-bold text-cyan-300" dir="ltr">
                {t.en}
              </span>
              <p className="mt-1.5 text-sm text-slate-300 leading-6">{t.ar}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-amber-500/20 bg-amber-500/[0.05] p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold text-amber-300">
          <PenLine className="h-5 w-5" />
          Quick exercise
        </h2>
        <p className="mt-3 text-slate-200 leading-8">
          Write the code from the example in the playground, change one value and
          try it yourself, then answer the quiz. If you got it right on the first
          try, move to the next video — gradual repetition is faster than rewatching.
        </p>
      </section>

      <div className="mt-8">
        <Quiz questions={v.quiz} />
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {prev ? (
          <Link
            href={`/elzero/${prev.id}`}
            className="group rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:border-white/25 transition-colors"
          >
            <span className="text-xs text-slate-400">Previous video</span>
            <span className="mt-1 block font-bold text-white">
              #{prev.id} — {prev.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={`/elzero/${next.id}`}
            className="group rounded-xl border border-cyan-500/30 bg-cyan-500/[0.07] p-4 hover:bg-cyan-500/[0.12] transition-colors"
          >
            <span className="text-xs text-cyan-400 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Next video
            </span>
            <span className="mt-1 block font-bold text-white">
              #{next.id} — {next.title}
            </span>
          </Link>
        ) : (
          <Link
            href="/elzero"
            className="group rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:border-white/25 transition-colors"
          >
            <span className="text-xs text-slate-400">Series ended</span>
            <span className="mt-1 block font-bold text-white">
              Back to the video list
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}
