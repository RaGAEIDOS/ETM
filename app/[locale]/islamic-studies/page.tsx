import type { Metadata } from "next";
import {
  BookOpenCheck,
  GraduationCap,
  Layers,
  ListChecks,
  MoonStar,
  ShieldCheck,
  Trophy,
} from "lucide-react";
import { localeFromParams, pageMetadata } from "@/lib/i18n/server";
import { formatNumber } from "@/lib/i18n/config";
import {
  RELIGIOUS_CATEGORIES,
  religiousCourses,
  religiousLessonCount,
} from "@/lib/religious";
import ReligiousCoursesExplorer from "@/components/religious/ReligiousCoursesExplorer";

const COPY = {
  ar: {
    metaTitle: "الدورات الدينية — علوم شرعية بمنهج منظم",
    metaDescription:
      "دورتان في أصول الدين والوعي المعاصر: «ما لا يسع المسلم جهله» للدكتور سامح الجنداوي، و«سلسلة تأسيس وعي المسلم المعاصر» للدكتور أيمن عبد الرحيم — مع تتبع التقدم داخل ETM.",
    badge: "مسار جديد · علوم شرعية",
    titleLead: "الدورات",
    titleAccent: "الدينية",
    intro:
      "دورتان مختارتان في أصول الدين والوعي المعاصر، بنفس تجربة ETM: صفحة مستقلة لكل دورة، اسم المحاضر، تصنيف واضح، وتتبع لتقدمك — ودروس تُضاف تدريجيًا بعد التحقق من المصدر الرسمي.",
    courses: (n: string) => `${n} دورات`,
    lessons: (n: string) => `${n} درسًا متاحًا الآن`,
    categories: (n: string) => `${n} تصنيفات`,
    soon: "الدروس قيد الإعداد",
    howTitle: "كيف يعمل هذا المسار؟",
    how: [
      {
        title: "اختر الدورة",
        body: "كل دورة لها صفحة مستقلة تعرض المحاضر والوصف والتصنيف، مع بحث وتصفية داخل القسم.",
      },
      {
        title: "تعلّم بالوحدات",
        body: "عند إضافة المحتوى الرسمي، تُقسَّم كل دورة إلى وحدات ودروس، ويظهر كل درس في صفحته الخاصة.",
      },
      {
        title: "تابع تقدمك",
        body: "إتمام الدروس يُحفظ في نفس نظام التقدم الموحّد في ETM، ويظهر على بطاقة الدورة وصفحتها.",
      },
    ],
    honestyTitle: "مصدر المحتوى",
    honestyBody:
      "لا تُضاف فيديوهات أو روابط أو نصوص إلا بعد التحقق من المصدر الرسمي للمحاضر. حتى ذلك الحين، تبقى صفحات الدورات صادقة بشأن حالة المحتوى.",
  },
  en: {
    metaTitle: "Religious courses — structured Islamic studies",
    metaDescription:
      "Two courses in faith foundations and contemporary awareness: “What a Muslim Cannot Afford to Ignore” by Dr. Sameh El-Gendawy, and “Building the Contemporary Muslim's Awareness” by Dr. Ayman Abdel-Rahman — with progress tracking inside ETM.",
    badge: "New track · Islamic studies",
    titleLead: "Religious",
    titleAccent: "courses",
    intro:
      "Two selected courses in faith foundations and contemporary awareness, with the same ETM experience: a dedicated page per course, the instructor, a clear category, and progress tracking — with lessons added gradually after verifying the official source.",
    courses: (n: string) => `${n} courses`,
    lessons: (n: string) => `${n} lessons available now`,
    categories: (n: string) => `${n} categories`,
    soon: "Lessons being prepared",
    howTitle: "How this track works",
    how: [
      {
        title: "Choose a course",
        body: "Every course has a dedicated page with its instructor, description and category, plus search and filters inside the section.",
      },
      {
        title: "Learn by modules",
        body: "When official content is added, each course is split into modules and lessons, and every lesson gets its own page.",
      },
      {
        title: "Track your progress",
        body: "Completed lessons are stored in ETM's unified progress system and appear on the course card and course page.",
      },
    ],
    honestyTitle: "Content source",
    honestyBody:
      "No videos, links or texts are added until they are verified against the instructor's official source. Until then, course pages stay honest about the content status.",
  },
} as const;

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = localeFromParams(params);
  const c = COPY[locale];
  return pageMetadata({
    locale,
    path: "/islamic-studies",
    title: c.metaTitle,
    description: c.metaDescription,
  });
}

export default function IslamicStudiesPage({ params }: { params: { locale: string } }) {
  const locale = localeFromParams(params);
  const c = COPY[locale];
  const lessonCount = religiousCourses.reduce(
    (total, course) => total + religiousLessonCount(course),
    0
  );
  const howIcons = [BookOpenCheck, ListChecks, Trophy] as const;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.08] via-ink-900/60 to-cyan-500/[0.06] p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-black text-amber-200">
              <MoonStar className="h-3.5 w-3.5" aria-hidden />
              {c.badge}
            </span>
            <h1 className="mt-4 text-3xl font-black text-white sm:text-4xl">
              {c.titleLead} <span className="gradient-text">{c.titleAccent}</span>
            </h1>
            <p className="mt-4 text-sm leading-8 text-slate-300" dir="auto">
              {c.intro}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center">
            <p dir="ltr" className="font-mono text-3xl font-black text-white">
              {formatNumber(religiousCourses.length)}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {c.courses(formatNumber(religiousCourses.length))}
            </p>
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-bold text-amber-200">
              <GraduationCap className="h-3.5 w-3.5" aria-hidden />
              {lessonCount > 0
                ? c.lessons(formatNumber(lessonCount))
                : c.soon}
            </p>
            <p className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-2.5 py-1 text-[11px] font-bold text-cyan-200">
              <Layers className="h-3.5 w-3.5" aria-hidden />
              {c.categories(formatNumber(RELIGIOUS_CATEGORIES.length))}
            </p>
          </div>
        </div>
      </header>

      <section className="mt-8" aria-label={c.courses(formatNumber(religiousCourses.length))}>
        <ReligiousCoursesExplorer courses={religiousCourses} />
      </section>

      <section className="mt-10" aria-labelledby="religious-how-title">
        <h2 id="religious-how-title" className="text-xl font-black text-white">
          {c.howTitle}
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {c.how.map((item, index) => {
            const Icon = howIcons[index] ?? BookOpenCheck;
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-ink-950">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-3 text-sm font-black text-white">{item.title}</h3>
                <p className="mt-1 text-xs leading-6 text-slate-400">{item.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="flex items-center gap-2 text-sm font-black text-white">
          <ShieldCheck className="h-5 w-5 text-emerald-400" aria-hidden />
          {c.honestyTitle}
        </h2>
        <p className="mt-2 text-xs leading-6 text-slate-400">{c.honestyBody}</p>
      </section>
    </div>
  );
}
