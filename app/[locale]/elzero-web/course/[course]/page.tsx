import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  PlayCircle,
  ListChecks,
  Clock,
  Globe2,
  ClipboardList,
  Map,
  GraduationCap,
  AlertCircle,
} from "lucide-react";
import {
  ELZERO_WEB_COURSES,
  ELZERO_WEB_CHANNEL,
  ELZERO_WEB_SITE,
  ELZERO_CREDIT,
  elzeroWebCourseVideos,
  findElzeroWebCourse,
  sectionsForCourse,
} from "@/lib/elzero-web-videos";
import { formatNumber, localePath } from "@/lib/i18n/config";
import { localeFromParams, pageMetadata } from "@/lib/i18n/server";
import ElzeroWebCourseProgress from "@/components/elzero-web/ElzeroWebCourseProgress";
import ElzeroWebVideoCard from "@/components/elzero-web/ElzeroWebVideoCard";

const COPY = {
  ar: {
    metaNotFound: "الكورس غير موجود",
    track: "مسار الويب",
    videos: (n: number) => `${formatNumber(n)} حلقة`,
    onPlaylist: "على YouTube",
    official: "صفحة الكورس الرسمية",
    studyPlan: "خطة الدراسة الرسمية",
    assignments: "ملف الواجبات الرسمي",
    credit: "حقوق المحتوى",
    watchOnYoutube: "افتح القائمة الكاملة على YouTube",
    pendingNote:
      "كل الحلقات تحمل شارة «قيد المراجعة» حتى تُشاهد ويُؤكد محتواها بشريًا. أول حلقات HTML عندها مسودة ملخص ومصطلحات وتدريب موسومة بنفس الشارة، والباقي يُنشر محتواه بعد المراجعة اليدوية. شاهد الفيديو الأصلي أولًا دائمًا.",
    reviewedNote: "كل حلقات هذا الكورس مراجعة يدويًا.",
    back: "كل كورسات المسار",
    summaryNote:
      "شاهد الحلقة الأصلية على قناة Elzero Web School من الرابط أعلاه، ثم عُد هنا للأسئلة. الملخص والمصطلحات والتدريب نصوص أصلية من ETM ولا تنسخ نص الفيديو.",
  },
  en: {
    metaNotFound: "Course not found",
    track: "Web track",
    videos: (n: number) => `${formatNumber(n)} videos`,
    onPlaylist: "on YouTube",
    official: "Official course page",
    studyPlan: "Official study plan",
    assignments: "Official assignments archive",
    credit: "Content credit",
    watchOnYoutube: "Open the full playlist on YouTube",
    pendingNote:
      "Every lesson carries a \"pending review\" badge until its content is confirmed by a human watch. The first HTML lessons have a summary + terms + drills, tagged with the same badge as drafts; the rest is published after manual review. Always watch the original video first.",
    reviewedNote: "Every lesson in this course is manually reviewed.",
    back: "All track courses",
    summaryNote:
      "Watch the original lesson on the Elzero Web School channel from the link above, then come back for the drills. Summaries, terms and drills are original ETM text and never copy the video.",
  },
} as const;

export async function generateStaticParams() {
  return ELZERO_WEB_COURSES.map((c) => ({ course: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: { course: string; locale: string };
}): Promise<Metadata> {
  const locale = localeFromParams(params);
  const course = findElzeroWebCourse(params.course);
  const c = COPY[locale];
  if (!course) return { title: c.metaNotFound };
  return pageMetadata({
    locale,
    path: `/elzero-web/course/${course.id}`,
    title: locale === "en" ? course.titleEn : course.title,
    description: course.description,
  });
}

export default function ElzeroWebCoursePage({
  params,
}: {
  params: { course: string; locale: string };
}) {
  const locale = localeFromParams(params);
  const c = COPY[locale];
  const course = findElzeroWebCourse(params.course);
  if (!course) notFound();

  const videos = elzeroWebCourseVideos(course.id);
  const sections = sectionsForCourse(course.id);
  const allReviewed = videos.every((v) => v.reviewed);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-10">
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
        <span className="text-slate-300">{locale === "en" ? course.titleEn : course.title}</span>
      </nav>

      <header className="max-w-3xl">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full bg-gradient-to-l ${course.color} px-3 py-1 text-xs font-bold text-ink-950`}
            dir="ltr"
          >
            {course.titleEn}
          </span>
          <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-slate-400 font-mono">
            {c.videos(videos.length)}
          </span>
        </div>
        <h1 className="mt-4 text-3xl sm:text-4xl font-black text-white leading-tight" dir="auto">
          {locale === "ar" ? course.title : course.titleEn}
        </h1>
        <p className="mt-3 text-slate-400 leading-8" dir="auto">
          {course.description}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <ListChecks className="h-4 w-4 text-cyan-400" />
            {formatNumber(course.lessons)}
          </span>
          <span className="inline-flex items-center gap-1.5" dir="ltr">
            <Clock className="h-4 w-4 text-cyan-400" />
            {course.totalTime}
          </span>
        </div>
        <div className="mt-5 flex flex-wrap gap-3 text-sm">
          <a
            href={course.playlistUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-cyan-400 to-violet-500 px-5 py-3 font-bold text-ink-950 hover:opacity-90"
          >
            <PlayCircle className="h-5 w-5" />
            {c.watchOnYoutube}
          </a>
          <a
            href={course.courseUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 font-bold text-white hover:bg-white/10"
          >
            <Globe2 className="h-5 w-5" />
            {c.official}
          </a>
          {course.studyPlanUrl && (
            <a
              href={course.studyPlanUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 font-bold text-white hover:bg-white/10"
            >
              <Map className="h-5 w-5" />
              {c.studyPlan}
            </a>
          )}
          {course.assignmentsUrl && (
            <a
              href={course.assignmentsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 font-bold text-white hover:bg-white/10"
            >
              <ClipboardList className="h-5 w-5" />
              {c.assignments}
            </a>
          )}
        </div>
        <ElzeroWebCourseProgress courseId={course.id} total={videos.length} />
      </header>

      <div className="mt-8 rounded-2xl border border-amber-500/20 bg-amber-500/[0.05] p-5 max-w-3xl">
        <h2 className="flex items-center gap-2 text-sm font-black text-amber-300">
          <GraduationCap className="h-4 w-4" />
          {c.credit}
        </h2>
        <p className="mt-2 text-sm leading-7 text-slate-300" dir="auto">
          {ELZERO_CREDIT}
        </p>
        <p className="mt-2 text-xs leading-6 text-slate-500">
          {allReviewed ? c.reviewedNote : c.pendingNote}
        </p>
      </div>

      <div className="mt-10 space-y-12">
        {sections.map((sec) => {
          const secVideos = videos.filter((v) => v.section === sec.id);
          if (!secVideos.length) return null;
          const first = secVideos[0].number;
          const last = secVideos[secVideos.length - 1].number;
          return (
            <section key={sec.id} id={`sec-${sec.id}`}>
              <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
                <div>
                  <h2 className="text-2xl font-black text-white" dir="auto">
                    {locale === "en" ? sec.titleEn : sec.title}
                  </h2>
                  <p className="text-sm text-slate-500 leading-6" dir="auto">
                    {sec.description}
                  </p>
                </div>
                <span className="text-sm text-slate-400 font-mono" dir="ltr">
                  #{formatNumber(first)}–{formatNumber(last)}
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
                {secVideos.map((v) => (
                  <ElzeroWebVideoCard
                    key={v.id}
                    id={v.id}
                    number={v.number}
                    title={v.title}
                    duration={v.duration}
                    youtubeId={v.youtubeId}
                    reviewed={v.reviewed}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
