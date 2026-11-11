import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  PlayCircle,
  Clock,
  ChevronRight,
  BookMarked,
  ListChecks,
  PenLine,
  Lightbulb,
  CheckCircle2,
} from "lucide-react";
import { elzeroVideos, findVideo, videoIndex } from "@/lib/elzero-videos";
import Quiz from "@/components/Quiz";
import CodeBlock from "@/components/CodeBlock";
import ElzeroCompleteButton from "@/components/ElzeroCompleteButton";
import { formatNumber, localePath } from "@/lib/i18n/config";
import { localeFromParams, pageMetadata } from "@/lib/i18n/server";

const COPY = {
  ar: {
    metaNotFound: "الفيديو غير موجود",
    metaTitle: (id: string, title: string) => `فيديو #${id}: ${title}`,
    breadcrumb: "فيديوهات ElZero",
    videoBadge: (id: string) => `فيديو #${id}`,
    videoOf: (id: string, total: number) =>
      `فيديو #${id} من ${formatNumber(total)}`,
    chrome: "اختبار + ملخص + مصطلحات",
    watch: "شاهد على YouTube",
    summaryTitle: "ملخص الفيديو",
    summaryNote:
      "لفهم كامل، شاهد الفيديو الأصلي على قناة أسامة الزيرو من الرابط أعلاه، ثم ارجع للاختبار. المحتوى هنا ملخص أصلي من ETM — نحن لا ننسخ نص الفيديو. كل الصياغة والشروحات من إعدادنا، مرتبة حسب ترتيب الزيرو الرسمي على GitHub.",
    codeExample: "مثال برمجي",
    tryPlayground: "جرّبه في المحرر",
    keyTerms: "المصطلحات المهمة في هذا الفيديو",
    exerciseTitle: "تمرين سريع",
    exerciseBody:
      "اكتب الكود الموجود في المثال داخل المحرر، غيّر قيمة واحدة وجرّبه بنفسك، ثم أجب على الاختبار. لو عرفت الإجابة من أول محاولة، انتقل إلى الفيديو التالي — التكرار التدريجي أسرع من إعادة المشاهدة.",
    previous: "الفيديو السابق",
    next: "الفيديو التالي",
    ended: "انتهت السلسلة",
    backToList: "العودة إلى قائمة الفيديوهات",
  },
  en: {
    metaNotFound: "Video not found",
    metaTitle: (id: string, title: string) => `Video #${id}: ${title}`,
    breadcrumb: "ElZero Videos",
    videoBadge: (id: string) => `Video #${id}`,
    videoOf: (id: string, total: number) =>
      `Video #${id} of ${formatNumber(total)}`,
    chrome: "Quiz + summary + terms",
    watch: "Watch on YouTube",
    summaryTitle: "Video summary",
    summaryNote:
      "For the full understanding, watch the original video on Osama ElZero's channel from the link above, then come back for the quiz. The content here is an original ETM summary — we do not copy the video text. All phrasing and explanations are ours, assembled in the official ElZero order on GitHub.",
    codeExample: "Code example",
    tryPlayground: "Try it in the playground",
    keyTerms: "Key terms in this video",
    exerciseTitle: "Quick exercise",
    exerciseBody:
      "Write the code from the example in the playground, change one value and try it yourself, then answer the quiz. If you got it right on the first try, move to the next video — gradual repetition is faster than rewatching.",
    previous: "Previous video",
    next: "Next video",
    ended: "Series ended",
    backToList: "Back to the video list",
  },
} as const;

export function generateStaticParams() {
  return elzeroVideos.map((v) => ({ video: v.id }));
}

export async function generateMetadata({
  params,
}: {
  params: { video: string; locale: string };
}): Promise<Metadata> {
  const locale = localeFromParams(params);
  const v = findVideo(params.video);
  if (!v) return { title: COPY[locale].metaNotFound };
  const title = locale === "en" ? v.titleEn : v.title;
  return pageMetadata({
    locale,
    path: `/elzero/${v.id}`,
    title: COPY[locale].metaTitle(v.id, title),
    description: v.summary,
  });
}

export default function ElzeroVideoPage({
  params,
}: {
  params: { video: string; locale: string };
}) {
  const locale = localeFromParams(params);
  const c = COPY[locale];
  const v = findVideo(params.video);
  if (!v) notFound();
  const idx = videoIndex(params.video);
  const prev = idx > 0 ? elzeroVideos[idx - 1] : null;
  const next =
    idx >= 0 && idx < elzeroVideos.length - 1 ? elzeroVideos[idx + 1] : null;
  const videoTitle = locale === "en" ? v.titleEn : v.title;
  const videoSubtitle = locale === "en" ? v.title : v.titleEn;
  const sectionLabel = locale === "en" ? v.sectionEn : v.section;
  const sectionSub = locale === "en" ? v.section : v.sectionEn;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-10">
      <nav
        className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500 mb-6"
        aria-label={c.breadcrumb}
      >
        <Link
          href={localePath(locale, "/elzero")}
          className="hover:text-cyan-300 transition-colors"
        >
          {c.breadcrumb}
        </Link>
        <ChevronRight className="h-4 w-4 rtl:rotate-180" />
        <span className="text-slate-300">{c.videoBadge(v.id)}</span>
      </nav>

      <header>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="rounded-full bg-gradient-to-l from-cyan-400 to-violet-500 px-3 py-1 text-xs font-bold text-ink-950"
            dir="auto"
          >
            {sectionLabel}
          </span>
          <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-slate-400 font-mono">
            {c.videoOf(v.id, elzeroVideos.length)}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-slate-400">
            <Clock className="h-3 w-3" />
            {c.chrome}
          </span>
        </div>
        <h1
          className="mt-4 text-3xl sm:text-4xl font-black text-white leading-tight"
          dir="auto"
        >
          {videoTitle}
        </h1>
        <p
          className="mt-1 text-sm font-mono text-slate-500"
          dir={locale === "en" ? "rtl" : "ltr"}
        >
          {videoSubtitle} — {sectionSub}
        </p>
        <a
          href={v.youtube}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-cyan-400 to-violet-500 px-5 py-3 font-bold text-ink-950 hover:opacity-90"
        >
          <PlayCircle className="h-5 w-5" />
          {c.watch}
        </a>
        <div>
          <ElzeroCompleteButton videoId={v.id} section={v.section} />
        </div>
      </header>

      <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-8">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/15 text-sm font-black text-cyan-300">
            1
          </span>
          {c.summaryTitle}
        </h2>
        <p className="text-slate-300 leading-8" dir="rtl">
          {v.summary}
        </p>
        <p className="mt-4 text-sm text-slate-500 leading-7">{c.summaryNote}</p>
      </section>

      {v.example && (
        <div className="mt-6">
          <h2 className="flex items-center gap-2 text-xl font-bold text-white mb-4">
            <ListChecks className="h-5 w-5 text-cyan-400" />
            {c.codeExample}
          </h2>
          <CodeBlock
            code={v.example.code}
            language="cpp"
            title={v.example.title}
          />
          <Link
            href={localePath(
              locale,
              `/playground?code=${encodeURIComponent(v.example.code)}`
            )}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500/15 border border-amber-500/30 px-4 py-2 text-sm font-bold text-amber-300 hover:bg-amber-500/25 transition-colors"
          >
            <Lightbulb className="h-4 w-4" />
            {c.tryPlayground}
          </Link>
        </div>
      )}

      <section className="mt-8 rounded-2xl border border-violet-500/20 bg-violet-500/[0.05] p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold text-violet-300">
          <BookMarked className="h-5 w-5" />
          {c.keyTerms}
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {v.terms.map((t) => (
            <div
              key={t.en}
              className="rounded-xl border border-white/10 bg-ink-900/60 p-4"
            >
              <span className="font-mono font-bold text-cyan-300" dir="ltr">
                {t.en}
              </span>
              <p className="mt-1.5 text-sm text-slate-300 leading-6" dir="rtl">
                {t.ar}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-amber-500/20 bg-amber-500/[0.05] p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold text-amber-300">
          <PenLine className="h-5 w-5" />
          {c.exerciseTitle}
        </h2>
        <p className="mt-3 text-slate-200 leading-8">{c.exerciseBody}</p>
      </section>

      <div className="mt-8">
        <Quiz questions={v.quiz} track="elzero" itemId={v.id} topic={v.section} />
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {prev ? (
          <Link
            href={localePath(locale, `/elzero/${prev.id}`)}
            className="group rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:border-white/25 transition-colors"
          >
            <span className="text-xs text-slate-400">{c.previous}</span>
            <span className="mt-1 block font-bold text-white" dir="auto">
              #{prev.id} — {locale === "en" ? prev.titleEn : prev.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={localePath(locale, `/elzero/${next.id}`)}
            className="group rounded-xl border border-cyan-500/30 bg-cyan-500/[0.07] p-4 hover:bg-cyan-500/[0.12] transition-colors"
          >
            <span className="text-xs text-cyan-400 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              {c.next}
            </span>
            <span className="mt-1 block font-bold text-white" dir="auto">
              #{next.id} — {locale === "en" ? next.titleEn : next.title}
            </span>
          </Link>
        ) : (
          <Link
            href={localePath(locale, "/elzero")}
            className="group rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:border-white/25 transition-colors"
          >
            <span className="text-xs text-slate-400">{c.ended}</span>
            <span className="mt-1 block font-bold text-white">
              {c.backToList}
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}
