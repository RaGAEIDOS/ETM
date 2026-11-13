import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap, PlayCircle, ListChecks, BadgeCheck } from "lucide-react";
import {
  ELZERO_WEB_COURSES,
  ELZERO_WEB_CHANNEL,
  ELZERO_WEB_SITE,
  ELZERO_CREDIT,
  elzeroWebVideos,
} from "@/lib/elzero-web-videos";
import { formatNumber, localePath } from "@/lib/i18n/config";
import { localeFromParams, pageMetadata } from "@/lib/i18n/server";
import ElzeroWebCourseCard from "@/components/elzero-web/ElzeroWebCourseCard";

const COPY = {
  ar: {
    metaTitle: "مسار الويب — ElZero Web School",
    metaDescription:
      "منهج Elzero Web School الكامل للويب بالعربي: HTML وCSS وبوت كامب JavaScript وTypeScript وSASS وGit وGitHub — 390 حلقة من القوائم الرسمية على YouTube مع تقدم وطبقات تدريب أصلية من ETM.",
    eyebrow: "مسار الويب · ElZero Web School",
    titleLead: "منهج الويب الكامل",
    titleAccent: "ElZero Web",
    introBefore: "كل دورات",
    introHas: "الويب المجانية بالعربي من قناة",
    stats: "حلقة فيديو · كورس · قوائم YouTube رسمية",
    badgeA11y: "بادج",
    note:
      "الفيديوهات تُعرض عبر المشغل الرسمي لليوتيوب فقط — لا يتم تحميل أو إعادة استضافة أي محتوى. كل ملخص ومصطلح وتدريب هنا نص أصلي من ETM، والحلقات التي لم تُراجع بعد تحمل شارة واضحة.",
    courses: "كورسات المسار",
    credit: "حقوق المحتوى",
    watchOnYoutube: "قناة YouTube الرسمية",
    officialSite: "موقع ElZero الرسمي",
  },
  en: {
    metaTitle: "Web Track — ElZero Web School",
    metaDescription:
      "The complete Elzero Web School web curriculum in Arabic: HTML, CSS, JavaScript Bootcamp, TypeScript, SASS and Git & GitHub — 390 videos from the official YouTube playlists, with progress and original ETM drills.",
    eyebrow: "Web track · ElZero Web School",
    titleLead: "The complete web curriculum",
    titleAccent: "ElZero Web",
    introBefore: "All",
    introHas: "free web courses in Arabic from the",
    stats: "videos · courses · official YouTube playlists",
    badgeA11y: "badge",
    note:
      "Videos play through the official YouTube player only — nothing is downloaded or re-hosted. Every summary, term and drill here is original ETM text, and unreviewed lessons carry a visible badge.",
    courses: "Track courses",
    credit: "Content credit",
    watchOnYoutube: "Official YouTube channel",
    officialSite: "Official ElZero site",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = localeFromParams(params);
  const c = COPY[locale];
  return pageMetadata({
    locale,
    path: "/elzero-web",
    title: c.metaTitle,
    description: c.metaDescription,
  });
}

export default function ElzeroWebPage({ params }: { params: { locale: string } }) {
  const locale = localeFromParams(params);
  const c = COPY[locale];
  const totalVideos = elzeroWebVideos.length;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-12">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-sm font-bold text-cyan-300">
          <GraduationCap className="h-4 w-4" />
          {c.eyebrow}
        </span>
        <h1 className="mt-5 text-3xl sm:text-5xl font-black text-white leading-tight">
          {c.titleLead}{" "}
          <span className="gradient-text" dir="ltr">
            {c.titleAccent}
          </span>
        </h1>
        <p className="mt-4 text-slate-400 leading-8 text-base sm:text-lg">
          {c.introBefore} <strong className="text-white">{formatNumber(ELZERO_WEB_COURSES.length)}</strong>{" "}
          {c.introHas} <strong className="text-white" dir="ltr">Elzero Web School</strong>
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
          <a
            href={ELZERO_WEB_CHANNEL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-cyan-400 to-violet-500 px-5 py-3 font-bold text-ink-950 hover:opacity-90"
          >
            <PlayCircle className="h-5 w-5" />
            {c.watchOnYoutube}
          </a>
          <a
            href={ELZERO_WEB_SITE}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 font-bold text-white hover:bg-white/10"
          >
            <ListChecks className="h-5 w-5" />
            {c.officialSite}
          </a>
        </div>
        <div className="mt-5 flex flex-wrap justify-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-bold text-slate-300">
            <BadgeCheck className="h-3.5 w-3.5 text-emerald-400" />
            {formatNumber(totalVideos)} {locale === "ar" ? "حلقة بالترتيب الرسمي للقوائم" : "videos in official playlist order"}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-3xl mb-10 rounded-2xl border border-amber-500/20 bg-amber-500/[0.05] p-5">
        <h2 className="flex items-center gap-2 text-sm font-black text-amber-300">
          <ListChecks className="h-4 w-4" />
          {c.credit}
        </h2>
        <p className="mt-2 text-sm leading-7 text-slate-300" dir="auto">
          {ELZERO_CREDIT}
        </p>
        <p className="mt-2 text-xs leading-6 text-slate-500">{c.note}</p>
      </div>

      <h2 className="mb-5 text-2xl font-black text-white">{c.courses}</h2>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {ELZERO_WEB_COURSES.map((course) => (
          <ElzeroWebCourseCard key={course.id} course={course} />
        ))}
      </div>

      <p className="mt-10 text-center text-xs text-slate-500 leading-6">
        {locale === "ar" ? (
          <>
            التقدم يُحفظ محليًا على جهازك داخل المنصة — مسار{" "}
            <span dir="ltr" className="font-mono">elzero-web</span>، ولا يُشارك مع أي جهة.
          </>
        ) : (
          <>
            Progress is stored locally on your device under track{" "}
            <span dir="ltr" className="font-mono">elzero-web</span> and never shared.
          </>
        )}
      </p>
    </div>
  );
}
