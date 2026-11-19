import type { Metadata } from "next";
import {
  BookOpenCheck,
  FileText,
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
  religiousResourcesOfCourse,
} from "@/lib/religious";
import ReligiousCoursesExplorer from "@/components/religious/ReligiousCoursesExplorer";

const COPY = {
  ar: {
    metaTitle: "الدورات الدينية — علوم شرعية بمنهج منظم",
    metaDescription:
      "دورتان في أصول الدين والوعي المعاصر: «ما لا يسع المسلم جهله» للدكتور سامح الجنداوي، و«سلسلة تأسيس وعي المسلم المعاصر» للدكتور أيمن عبد الرحيم — مع تتبع التقدم داخل ETM.",
    badge: "علوم شرعية · منهجان كاملان",
    titleLead: "الدورات",
    titleAccent: "الدينية",
    intro:
      "دورتان كاملتان في أصول الدين والوعي المعاصر، بنفس تجربة ETM: صفحة مستقلة لكل دورة، المحاضرات كاملة بالمدد الرسمية، ملفات PDF ملحقة، ومشغّل يحفظ موضعك وتقدمك.",
    courses: (n: string) => `${n} دورات`,
    lessons: (n: string) => `${n} محاضرة كاملة`,
    categories: (n: string) => `${n} تصنيفات`,
    pdfs: (n: string) => `${n} ملفات PDF`,
    soon: "لا توجد دروس منشورة بعد",
    howTitle: "كيف يعمل هذا المسار؟",
    how: [
      {
        title: "اختر الدورة",
        body: "كل دورة لها صفحة مستقلة تعرض المحاضر والوصف والتصنيف، مع بحث وتصفية داخل القسم.",
      },
      {
        title: "تعلّم بالوحدات",
        body: "كل دورة مقسمة إلى وحدات ومحاضرات مرقّمة، وكل محاضرة في صفحتها الخاصة مع مدة الفيديو ومصادر مستواها.",
      },
      {
        title: "تابع تقدمك",
        body: "إتمام المحاضرات وموضع المشاهدة يُحفظان في نفس نظام التقدم الموحّد في ETM، ويظهران على بطاقة الدورة وصفحتها.",
      },
    ],
    honestyTitle: "مصادر موثّقة",
    honestyBody:
      "الفيديوهات والمدد مأخوذة من قوائم التشغيل الرسمية للمحاضرين. ملفات الـPDF مرفقة من مصادرها المنشورة، وكتاب دورة الدكتور سامح متاح عبر منشور قناته الرسمية على تيليجرام.",
  },
  en: {
    metaTitle: "Religious courses — structured Islamic studies",
    metaDescription:
      "Two courses in faith foundations and contemporary awareness: “What a Muslim Cannot Afford to Ignore” by Dr. Sameh El-Gendawy, and “Building the Contemporary Muslim's Awareness” by Dr. Ayman Abdel-Rahman — with progress tracking inside ETM.",
    badge: "Islamic studies · two complete curricula",
    titleLead: "Religious",
    titleAccent: "courses",
    intro:
      "Two complete courses in faith foundations and contemporary awareness, with the same ETM experience: a dedicated page per course, every lecture with its official duration, attached PDFs, and a player that remembers your position and progress.",
    courses: (n: string) => `${n} courses`,
    lessons: (n: string) => `${n} complete lectures`,
    categories: (n: string) => `${n} categories`,
    pdfs: (n: string) => `${n} PDF files`,
    soon: "No lessons published yet",
    howTitle: "How this track works",
    how: [
      {
        title: "Choose a course",
        body: "Every course has a dedicated page with its instructor, description and category, plus search and filters inside the section.",
      },
      {
        title: "Learn by modules",
        body: "Each course is split into numbered modules and lectures, and every lecture has its own page with the video duration and its level's resources.",
      },
      {
        title: "Track your progress",
        body: "Completed lectures and your playback position are stored in ETM's unified progress system and appear on the course card and course page.",
      },
    ],
    honestyTitle: "Verified sources",
    honestyBody:
      "Videos and durations come from the instructors' official playlists. PDFs are attached from their published sources, and Dr. Sameh's course book is available through his official Telegram channel post.",
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
  const pdfCount = religiousCourses.reduce(
    (total, course) =>
      total +
      religiousResourcesOfCourse(course).filter((resource) => resource.kind === "pdf").length,
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
            {pdfCount > 0 && (
              <p className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-200">
                <FileText className="h-3.5 w-3.5" aria-hidden />
                {c.pdfs(formatNumber(pdfCount))}
              </p>
            )}
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
