import type { Metadata } from "next";
import Link from "next/link";
import {
  Terminal,
  PlayCircle,
  ExternalLink,
  CheckCircle2,
  Layers,
  ListChecks,
  ArrowLeft,
  Route,
} from "lucide-react";
import {
  LINUX_SECTIONS,
  LINUXTOPA_CHANNEL,
  LINUXTOPA_PLAYLIST,
  linuxCourses,
  linuxVideos,
  linuxVideosBySection,
} from "@/lib/linux-videos";
import { localeFromParams, pageMetadata } from "@/lib/i18n/server";
import { formatNumber, localePath } from "@/lib/i18n/config";
import ResumeCard from "@/components/ResumeCard";
import LinuxCourseProgress from "@/components/linux/LinuxCourseProgress";
import LinuxReviewDueCard from "@/components/linux/LinuxReviewDueCard";
import LinuxCredit from "@/components/linux/LinuxCredit";
import YouTubeThumbnail from "@/components/YouTubeThumbnail";

const COPY = {
  ar: {
    metaTitle: "قسم لينكس — تعلم نظام اللينكس مجانًا",
    metaDescription:
      "دورة Linuxtopia العربية «تعلم نظام اللينكس 2021» (٥٣ فيديو) مدمجة داخل المنصة: ملخصات عربية، فلاش كارد، أسئلة تدريبية ومعمل طرفية محاكاة — مع حفظ موضع المشاهدة تلقائيًا.",
    eyebrow: "لينكس مجانًا · من محتوى Linuxtopia",
    titleLead: "قسم",
    titleAccent: "لينكس",
    intro:
      "دورة «تعلم نظام اللينكس 2021» من قناة Linuxtopia (٥٣ فيديو) — مدمجة هنا داخل المنصة مع ملخص عربي، مصطلحات وفلاش كارد، أسئلة تدريبية متنوعة ومعمل طرفية محاكاة بالكامل داخل متصفحك. شاهد بالسرعة التي تناسبك، وسيُحفظ موضعك تلقائيًا.",
    channel: "القناة على YouTube",
    catalogue: (courses: number, videos: number) =>
      `${formatNumber(courses)} دورة · ${formatNumber(videos)} فيديو`,
    whatToDo: [
      "ملخص عربي لكل فيديو",
      "مصطلحات + فلاش كارد",
      "أسئلة وتطبيقات عملية",
      "معمل طرفية محاكاة",
    ],
    coursesTitle: "الدورة",
    openCourse: "عرض الدروس",
    videoCount: (n: number) => `${formatNumber(n)} فيديو`,
    openPlaylist: "افتح القائمة على YouTube",
    sectionsTitle: "أقسام الدورة",
    sectionVideos: (n: number) => `${formatNumber(n)} فيديو`,
    pathTitle: "طريقة اللعب داخل المنصة",
    path: [
      { title: "شاهد داخل المنصة", desc: "يُحفظ موضعك تلقائيًا أثناء المشاهدة — أكمل لاحقًا من حيث توقفت." },
      { title: "ثبّت بالمصطلحات والأسئلة", desc: "فلاش كارد مع جدول مراجعة متباعدة + أسئلة متنوعة بعد كل فيديو." },
      { title: "تدرّب في معمل الطرفية", desc: "تحديات عملية على نظام ملفات افتراضي داخل متصفحك — لا شيء حقيقي يُنفذ." },
    ],
  },
  en: {
    metaTitle: "Linux section — learn Linux for free",
    metaDescription:
      "Linuxtopia's «The Complete Linux Course 2021» (53 videos), embedded with Arabic summaries, flashcards, practice quizzes and a fully simulated in-browser terminal.",
    eyebrow: "Free Linux · powered by Linuxtopia",
    titleLead: "Linux",
    titleAccent: "Section",
    intro:
      "The Complete Linux Course 2021 by Linuxtopia (53 videos) — embedded right here with an Arabic summary, key-term flashcards, varied practice quizzes and a fully simulated in-browser terminal lab. Watch at your own pace; your position is saved automatically.",
    channel: "The channel on YouTube",
    catalogue: (courses: number, videos: number) =>
      `${formatNumber(courses)} course · ${formatNumber(videos)} videos`,
    whatToDo: [
      "Arabic summary per video",
      "Key terms + flashcards",
      "Practice quizzes",
      "Simulated terminal lab",
    ],
    coursesTitle: "The course",
    openCourse: "View lessons",
    videoCount: (n: number) => `${formatNumber(n)} videos`,
    openPlaylist: "Open the playlist on YouTube",
    sectionsTitle: "Course sections",
    sectionVideos: (n: number) => `${formatNumber(n)} videos`,
    pathTitle: "How it works inside the platform",
    path: [
      { title: "Watch inside the platform", desc: "Your position is saved automatically — pick up later exactly where you stopped." },
      { title: "Lock it in with terms & quizzes", desc: "Flashcards on a spaced-repetition schedule + varied questions after every video." },
      { title: "Train in the terminal lab", desc: "Hands-on challenges on an in-memory virtual filesystem — nothing real ever runs." },
    ],
  },
} as const;

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = localeFromParams(params);
  const c = COPY[locale];
  return pageMetadata({
    locale,
    path: "/linux",
    title: c.metaTitle,
    description: c.metaDescription,
  });
}

export default function LinuxHubPage({ params }: { params: { locale: string } }) {
  const locale = localeFromParams(params);
  const c = COPY[locale];
  const course = linuxCourses[0];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-12">
      {/* Hero */}
      <div className="mx-auto mb-10 max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-sm font-bold text-amber-300">
          <Terminal className="h-4 w-4" />
          {c.eyebrow}
        </span>
        <h1 className="mt-5 text-4xl sm:text-6xl font-black leading-tight text-white">
          {c.titleLead}{" "}
          <span className="gradient-text">{c.titleAccent}</span>
        </h1>
        <p dir="rtl" className="mt-4 text-base leading-8 text-slate-400 sm:text-lg">
          {c.intro}
        </p>
        <p className="mt-3 font-mono text-sm font-bold text-amber-300" dir="ltr">
          {c.catalogue(linuxCourses.length, linuxVideos.length)}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
          {c.whatToDo.map((item) => (
            <span key={item} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />
              {item}
            </span>
          ))}
        </div>
        <div className="mt-6">
          <a
            href={LINUXTOPA_CHANNEL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-bold text-slate-200 hover:bg-white/10 hover:text-white"
          >
            <PlayCircle className="h-5 w-5 text-amber-400" />
            {c.channel}
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Continue where you left off */}
      <div className="mb-10">
        <ResumeCard variant="linux" />
      </div>

      {/* Review queue entry */}
      <div className="mb-10">
        <LinuxReviewDueCard />
      </div>

      {/* The course card */}
      <h2 className="mb-5 text-2xl font-black text-white">{c.coursesTitle}</h2>
      <div className="rounded-2xl border border-white/10 bg-ink-900/60 p-6 transition-all hover:border-amber-500/25">
        {linuxVideos[0] && (
          <div className="-mx-6 -mt-6 mb-4 overflow-hidden rounded-t-2xl border-b border-white/5 bg-black">
            <YouTubeThumbnail
              youtubeId={linuxVideos[0].youtubeId}
              alt={course.title}
              className="aspect-video w-full object-cover opacity-90 transition-opacity hover:opacity-100"
            />
          </div>
        )}
        <div className="flex flex-wrap items-start gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-ink-950">
            <Terminal className="h-7 w-7" />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-black leading-snug text-white" dir="rtl">
              {course.title}
            </h3>
            <p className="mt-1 text-xs font-bold uppercase tracking-wide text-amber-400" dir="ltr">
              {course.titleEn}
            </p>
            <p dir="rtl" className="mt-2 max-w-3xl text-sm leading-7 text-slate-400">
              {course.description}
            </p>
          </div>
        </div>
        <LinuxCourseProgress videoIds={linuxVideos.map((v) => v.id)} />
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-4 text-xs">
          <span className="inline-flex items-center gap-1.5 text-slate-400">
            <ListChecks className="h-4 w-4 text-amber-400" />
            {c.videoCount(linuxVideos.length)}
          </span>
          <div className="flex items-center gap-3">
            <Link
              href={localePath(locale, `/linux/course/${course.id}`)}
              className="inline-flex items-center gap-1 font-bold text-amber-300 hover:text-amber-200"
            >
              {c.openCourse}
              <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" />
            </Link>
            <a
              href={LINUXTOPA_PLAYLIST}
              target="_blank"
              rel="noreferrer"
              aria-label={c.openPlaylist}
              title={c.openPlaylist}
              className="text-slate-500 transition-colors hover:text-amber-300"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Course sections teaser */}
      <section className="mt-10" aria-label={c.sectionsTitle}>
        <h2 className="mb-4 flex items-center gap-2 text-2xl font-black text-white">
          <Layers className="h-6 w-6 text-amber-400" />
          {c.sectionsTitle}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {LINUX_SECTIONS.map((section) => {
            const count = linuxVideosBySection(section.id).length;
            if (count === 0) return null;
            return (
              <Link
                key={section.id}
                href={localePath(locale, `/linux/course/linux-2021#section-${section.id}`)}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all hover:-translate-y-0.5 hover:border-amber-500/30"
              >
                <div className="flex items-center justify-between gap-3">
                  <span dir="rtl" className="font-black leading-7 text-white group-hover:text-amber-100">
                    {section.title}
                  </span>
                  <span className="shrink-0 rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-1 font-mono text-[10px] font-bold text-amber-300">
                    {c.sectionVideos(count)}
                  </span>
                </div>
                <p dir="rtl" className="mt-2 text-xs leading-6 text-slate-500">
                  {section.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="mt-10" aria-label={c.pathTitle}>
        <h2 className="flex items-center gap-2 text-2xl font-black text-white">
          <Route className="h-6 w-6 text-amber-400" />
          {c.pathTitle}
        </h2>
        <ol className="mt-5 grid gap-3 sm:grid-cols-3">
          {c.path.map((step, i) => (
            <li key={i} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <span dir="ltr" className="font-mono text-xs font-black text-amber-400">0{i + 1}</span>
              <p dir="rtl" className="mt-2 font-black leading-7 text-white">{step.title}</p>
              <p dir="rtl" className="mt-1 text-xs leading-6 text-slate-400">{step.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      <LinuxCredit />
    </div>
  );
}
