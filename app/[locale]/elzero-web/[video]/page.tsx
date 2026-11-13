import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Clock,
  ChevronRight,
  BookMarked,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  PenLine,
} from "lucide-react";
import {
  ELZERO_WEB_CHANNEL,
  ELZERO_WEB_SITE,
  ELZERO_CREDIT,
  elzeroWebCourseVideos,
  elzeroWebVideos,
  findElzeroWebVideo,
  findElzeroWebCourse,
} from "@/lib/elzero-web-videos";
import ElzeroWebCompleteButton from "@/components/ElzeroWebCompleteButton";
import ElzeroWebPractice from "@/components/elzero-web/ElzeroWebPractice";
import ElzeroWebVideoFacade from "@/components/elzero-web/ElzeroWebVideoFacade";
import { formatDuration } from "@/lib/elzero-web-track";
import { formatNumber, localePath } from "@/lib/i18n/config";
import { localeFromParams, pageMetadata } from "@/lib/i18n/server";

const COPY = {
  ar: {
    metaNotFound: "الحلقة غير موجودة",
    metaTitle: (n: number, title: string) => `الحلقة #${formatNumber(n)}: ${title}`,
    track: "مسار الويب",
    videoBadge: (n: number) => `الحلقة #${formatNumber(n)}`,
    videoOf: (n: number, total: number) =>
      `الحلقة #${formatNumber(n)} من ${formatNumber(total)}`,
    summaryTitle: "ملخص الحلقة",
    pendingTitle: "لم تُراجع هذه الحلقة بعد",
    pendingBody:
      "الملخص والمصطلحات والتدريب تُضاف بعد مراجعة الفيديو يدويًا — لا تنشر ETM محتوى غير مراجع. شاهد الحلقة الأصلية من قناة Elzero Web School أولًا.",
    draftTitle: "مسودة قيد المراجعة",
    draftBody:
      "هذا الملخص مكتوب لكنه لم يُؤكَّد بعد بمشاهدة بشرية — اعتبره مرجعًا أوليًا وشاهد الفيديو الأصلي للتأكد. المصطلحات والتدريب أدناه بنفس الحالة.",
    summaryNote:
      "شاهد الفيديو الأصلي على قناة Elzero Web School من الرابط أعلاه، ثم عُد هنا للتدريب. الملخص والمصطلحات هنا نصوص أصلية من ETM ولا تنسخ نص الفيديو.",
    versionNote: "ملاحظة الإصدار",
    keyTerms: "المصطلحات المهمة في هذه الحلقة",
    practiceTitle: "التدريب",
    credit: "حقوق المحتوى",
    official: "القناة الرسمية",
    site: "elzero.org",
    previous: "الحلقة السابقة",
    next: "الحلقة التالية",
    ended: "انتهت حلقات هذا الكورس",
    backToCourse: "عودة لصفحة الكورس",
  },
  en: {
    metaNotFound: "Lesson not found",
    metaTitle: (n: number, title: string) => `Video #${formatNumber(n)}: ${title}`,
    track: "Web track",
    videoBadge: (n: number) => `Video #${formatNumber(n)}`,
    videoOf: (n: number, total: number) =>
      `Video #${formatNumber(n)} of ${formatNumber(total)}`,
    summaryTitle: "Lesson summary",
    pendingTitle: "This lesson is not reviewed yet",
    pendingBody:
      "Summary, terms and drills are added after the video is manually reviewed - ETM never publishes unreviewed content as final. Watch the original lesson on the Elzero Web School channel first.",
    draftTitle: "Unreviewed draft",
    draftBody:
      "This summary is written but has not been confirmed by a human watch yet - treat it as a starting reference and verify against the original channel video. The terms and drills below are in the same state.",
    summaryNote:
      "Watch the original video on the Elzero Web School channel from the link above, then come back for the drills. Summaries and terms here are original ETM text and never copy the video.",
    versionNote: "Version note",
    keyTerms: "Key terms in this video",
    practiceTitle: "Practice",
    credit: "Content credit",
    official: "Official channel",
    site: "elzero.org",
    previous: "Previous video",
    next: "Next video",
    ended: "You finished this course",
    backToCourse: "Back to the course page",
  },
} as const;

export function generateStaticParams() {
  return elzeroWebVideos.map((v) => ({ video: v.id }));
}

export async function generateMetadata({
  params,
}: {
  params: { video: string; locale: string };
}): Promise<Metadata> {
  const locale = localeFromParams(params);
  const v = findElzeroWebVideo(params.video);
  const course = v ? findElzeroWebCourse(v.course) : undefined;
  const c = COPY[locale];
  if (!v) return { title: c.metaNotFound };
  const title = locale === "en" ? course?.titleEn ?? v.title : course?.title ?? v.title;
  return pageMetadata({
    locale,
    path: `/elzero-web/${v.id}`,
    title: c.metaTitle(v.number, v.title),
    description: v.reviewed ? v.summary : title,
  });
}

export default function ElzeroWebVideoPage({
  params,
}: {
  params: { video: string; locale: string };
}) {
  const locale = localeFromParams(params);
  const c = COPY[locale];
  const v = findElzeroWebVideo(params.video);
  if (!v) notFound();
  const course = findElzeroWebCourse(v.course);
  if (!course) notFound();

  const courseVideos = elzeroWebCourseVideos(course.id);
  const idx = courseVideos.findIndex((x) => x.id === v.id);
  const prev = idx > 0 ? courseVideos[idx - 1] : null;
  const next = idx >= 0 && idx < courseVideos.length - 1 ? courseVideos[idx + 1] : null;
  const topic = course.id;
  const watchHref = v.youtube;
  const hasContent = v.terms.length > 0;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-10">
      <nav
        className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500 mb-6"
        aria-label={c.track}
      >
        <Link
          href={localePath(locale, "/elzero-web")}
          className="hover:text-cyan-300 transition-colors"
        >
          {c.track}
        </Link>
        <ChevronRight className="h-4 w-4 rtl:rotate-180" />
        <Link
          href={localePath(locale, `/elzero-web/course/${course.id}`)}
          className="hover:text-cyan-300 transition-colors"
          dir="auto"
        >
          {locale === "en" ? course.titleEn : course.title}
        </Link>
        <ChevronRight className="h-4 w-4 rtl:rotate-180" />
        <span className="text-slate-300">{c.videoBadge(v.number)}</span>
      </nav>

      <header>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-slate-400 font-mono">
            {c.videoOf(v.number, courseVideos.length)}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-slate-400">
            <Clock className="h-3 w-3" />
            <span dir="ltr">{formatDuration(v.duration)}</span>
          </span>
          {!v.reviewed && (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-300">
              <AlertCircle className="h-3 w-3" />
              {locale === "ar" ? "قيد المراجعة" : "Pending review"}
            </span>
          )}
        </div>
        <h1
          className="mt-4 text-3xl sm:text-4xl font-black text-white leading-tight"
          dir="auto"
        >
          {v.title}
        </h1>
        <p className="mt-1 text-sm font-mono text-slate-500" dir="ltr">
          {course.titleEn} — #{formatNumber(v.number)}
        </p>
        <div className="mt-5 max-w-xl">
          <ElzeroWebVideoFacade
            youtubeId={v.youtubeId}
            title={v.title}
            videoId={v.id}
            courseId={v.course}
            watchUrl={watchHref}
          />
        </div>
        <div>
          <ElzeroWebCompleteButton videoId={v.id} topic={topic} />
        </div>
      </header>

      {/* Content is shown when it exists (curated). While unreviewed it is
          always wrapped in the amber "pending" treatment below. */}
      {!v.reviewed && (
        <section className="mt-8 rounded-2xl border border-amber-500/20 bg-amber-500/[0.05] p-5 sm:p-8">
          <h2 className="flex items-center gap-2 text-xl font-bold text-amber-300">
            <AlertCircle className="h-5 w-5" />
            {hasContent ? c.draftTitle : c.pendingTitle}
          </h2>
          {hasContent ? (
            <>
              <p className="mt-3 text-slate-300 leading-8">{c.draftBody}</p>
              <p className="mt-4 text-slate-300 leading-8" dir="auto">
                {v.summary}
              </p>
              {v.versionNote && (
                <p className="mt-4 text-sm leading-7 text-amber-200/80 border-s-2 border-amber-500/40 ps-3" dir="auto">
                  <span className="font-bold">{c.versionNote}: </span>
                  {v.versionNote}
                </p>
              )}
              <p className="mt-4 text-sm text-slate-500 leading-7">{c.summaryNote}</p>
            </>
          ) : (
            <p className="mt-3 text-slate-300 leading-8">{c.pendingBody}</p>
          )}
        </section>
      )}

      {v.reviewed && (
        <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/15 text-sm font-black text-cyan-300">
              1
            </span>
            {c.summaryTitle}
          </h2>
          <p className="text-slate-300 leading-8" dir="auto">
            {v.summary}
          </p>
          {v.versionNote && (
            <p className="mt-4 text-sm leading-7 text-amber-200/80 border-s-2 border-amber-500/40 ps-3" dir="auto">
              <span className="font-bold">{c.versionNote}: </span>
              {v.versionNote}
            </p>
          )}
          <p className="mt-4 text-sm text-slate-500 leading-7">{c.summaryNote}</p>
        </section>
      )}

      {v.terms.length > 0 && (
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
                <p className="mt-1.5 text-sm text-slate-300 leading-6" dir="auto">
                  {t.ar}
                </p>
                {t.example && (
                  <code className="mt-2 block overflow-x-auto rounded-lg border border-white/5 bg-black/50 px-3 py-2 text-[11px] text-cyan-200" dir="ltr">
                    {t.example}
                  </code>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {v.practice.length > 0 && (
        <section className="mt-8">
          <h2 className="flex items-center gap-2 text-xl font-bold text-white mb-4">
            <PenLine className="h-5 w-5 text-cyan-400" />
            {c.practiceTitle}
          </h2>
          <ElzeroWebPractice items={v.practice} videoId={v.id} courseId={v.course} />
        </section>
      )}

      <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        <h2 className="flex items-center gap-2 text-sm font-black text-slate-400">
          <Lightbulb className="h-4 w-4 text-amber-400" />
          {c.credit}
        </h2>
        <p className="mt-2 text-sm leading-7 text-slate-400" dir="auto">
          {ELZERO_CREDIT}
        </p>
        <div className="mt-3 flex flex-wrap gap-3 text-xs">
          <a
            href={ELZERO_WEB_CHANNEL}
            target="_blank"
            rel="noreferrer"
            className="font-bold text-cyan-300 hover:text-cyan-200"
          >
            {c.official} — @ElzeroWebSchool
          </a>
          <a
            href={ELZERO_WEB_SITE}
            target="_blank"
            rel="noreferrer"
            className="font-bold text-cyan-300 hover:text-cyan-200"
          >
            {c.site}
          </a>
        </div>
      </section>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {prev ? (
          <Link
            href={localePath(locale, `/elzero-web/${prev.id}`)}
            className="group rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:border-white/25 transition-colors"
          >
            <span className="text-xs text-slate-400">{c.previous}</span>
            <span className="mt-1 block font-bold text-white leading-7" dir="auto">
              #{formatNumber(prev.number)} - {prev.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={localePath(locale, `/elzero-web/${next.id}`)}
            className="group rounded-xl border border-cyan-500/30 bg-cyan-500/[0.07] p-4 hover:bg-cyan-500/[0.12] transition-colors"
          >
            <span className="text-xs text-cyan-400 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              {c.next}
            </span>
            <span className="mt-1 block font-bold text-white leading-7" dir="auto">
              #{formatNumber(next.number)} - {next.title}
            </span>
          </Link>
        ) : (
          <Link
            href={localePath(locale, `/elzero-web/course/${course.id}`)}
            className="group rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:border-white/25 transition-colors"
          >
            <span className="text-xs text-slate-400">{c.ended}</span>
            <span className="mt-1 block font-bold text-white">
              {c.backToCourse}
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}
