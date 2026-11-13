import type { Metadata } from "next";
import {
  GraduationCap,
  ShieldCheck,
  ExternalLink,
  ListChecks,
  Route,
  BookOpenCheck,
} from "lucide-react";
import { paCourses, paVideos, ETM_PA_ROADMAP } from "@/lib/programmingadvices-videos";
import { localeFromParams, pageMetadata } from "@/lib/i18n/server";
import { formatNumber, localePath } from "@/lib/i18n/config";
import PACredit from "@/components/programmingadvices/PACredit";
import PACourseCard from "@/components/programmingadvices/PACourseCard";
import PAReviewDueCard from "@/components/programmingadvices/PAReviewDueCard";

const COPY = {
  ar: {
    metaTitle: "Programming Advices — دورتان مجانيتان بملخصات وتمارين أصلية",
    metaDescription:
      "دورتان مجانيتان للدكتور محمد أبو هدهود من قناة Programming Advices: أساسيات الحاسوب والخوارزميات، مع ملخصات وتمارين أصلية في ETM وروابط رسمية فقط.",
    badge: "مسار جديد · محتوى خارجي",
    title: "Programming Advices",
    subtitle: "دورات د. محمد أبو هدهود — بملخصات وتمارين أصلية من ETM",
    intro:
      "مسار موجّه يضم دورتين مجانيتين فقط من قناة Programming Advices على YouTube: أساسيات الحاسوب للمبرمج المبتدئ، والخوارزميات وحل المشاكل. نشاهد الفيديوهات من خلال YouTube الرسمي، ونضيف ملخصًا عربيًا وتمارين من إعداد ETM — دون نسخ محتوى المؤلف أو إعادة رفع أي وسائط.",
    coursesTitle: "الدورتان",
    coursesNote: (n: string) => `${n} فيديو عامًا في القائمتين الرسميتين`,
    legalTitle: "حدود الاستخدام",
    legal1:
      "المحتوى للاستخدام الشخصي غير التجاري فقط. لا تنزّل ETM الفيديوهات أو النصوص المفرّغة أو الشرائح أو التمارين، ولا تعيد رفعها أو تنشرها.",
    legal2:
      "روابط ملفات PDF الرسمية تبقى على منصة المؤلف. لا نلمس أي محتوى يتطلب تسجيل دخول أو تسجيلًا في الدورة.",
    legal3:
      "الملخصات والمصطلحات والتمارين في ETM أصلية، وقد كُتبت من عنوان الفيديو ووصفه عندما لا تتوفر نصوص مفرّغة.",
    officialTitle: "المصدر الرسمي",
    officialBody:
      "القناة والمنصة الرسمية هما المرجع دائمًا. يمكنك متابعة خريطة الطريق الكاملة هناك.",
    roadmap: "تابع خريطة الطريق الرسمية",
    pilotTitle: "المرحلة التجريبية",
    pilotBody:
      "الدروس المتاحة الآن من الكورس الأول فقط. تُضاف بقية دروس الكورس الأول ثم الكورس الثاني على دفعات بعد اعتماد المرحلة التجريبية.",
    available: (n: string) => `${n} درسًا متاحًا الآن`,
    reviewTitle: "المراجعة المتباعدة",
  },
  en: {
    metaTitle: "Programming Advices — two free courses with original summaries and drills",
    metaDescription:
      "Two free Dr. Mohammed Abu-Hadhoud courses from the Programming Advices channel: computing foundations and algorithms, with original ETM summaries, drills and official links only.",
    badge: "New track · external content",
    title: "Programming Advices",
    subtitle: "Dr. Mohammed Abu-Hadhoud's courses — with original ETM summaries and drills",
    intro:
      "A guided track with exactly two free courses from the Programming Advices YouTube channel: computing foundations for new programmers, and algorithms with problem solving. Videos are watched through official YouTube, while ETM adds its own Arabic summaries and drills — without copying the author's content or re-hosting any media.",
    coursesTitle: "The two courses",
    coursesNote: (n: string) => `${n} public videos across the two official playlists`,
    legalTitle: "Usage boundaries",
    legal1:
      "Content is for personal, non-commercial use only. ETM never downloads, re-hosts or publishes the videos, transcripts, slides or exercises.",
    legal2:
      "Official PDF links stay on the author's platform. ETM never touches any content that requires login or course enrolment.",
    legal3:
      "ETM's summaries, terms and drills are original; when no captions exist they are written conservatively from the video title and description.",
    officialTitle: "The official source",
    officialBody:
      "The official channel and platform are always the reference. You can follow the full roadmap there.",
    roadmap: "Continue the official roadmap",
    pilotTitle: "Pilot stage",
    pilotBody:
      "Only Course 1 lessons are available right now. The rest of Course 1 and then Course 2 are added in batches after the pilot is approved.",
    available: (n: string) => `${n} lessons available now`,
    reviewTitle: "Spaced review",
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
    path: "/programmingadvices",
    title: c.metaTitle,
    description: c.metaDescription,
  });
}

export default function ProgrammingAdvicesPage({ params }: { params: { locale: string } }) {
  const locale = localeFromParams(params);
  const c = COPY[locale];
  const totalVideos = paCourses.reduce((sum, course) => sum + course.videoCount, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-10">
      {/* Hero */}
      <header className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.08] via-ink-900/60 to-cyan-500/[0.06] p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-black text-amber-200">
              <GraduationCap className="h-3.5 w-3.5" />
              {c.badge}
            </span>
            <h1 className="mt-4 text-3xl font-black text-white sm:text-4xl" dir="auto">
              {c.title}
            </h1>
            <p className="mt-1 text-sm font-semibold text-amber-300" dir="auto">
              {c.subtitle}
            </p>
            <p className="mt-4 text-sm leading-8 text-slate-300" dir="auto">
              {c.intro}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center">
            <p dir="ltr" className="font-mono text-3xl font-black text-white">
              {formatNumber(totalVideos)}
            </p>
            <p className="mt-1 text-xs text-slate-400">{c.coursesNote(formatNumber(totalVideos))}</p>
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-bold text-amber-200">
              <ListChecks className="h-3.5 w-3.5" />
              {c.available(formatNumber(paVideos.length))}
            </p>
          </div>
        </div>
      </header>

      {/* Course cards */}
      <section className="mt-8">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-black text-white">
          <BookOpenCheck className="h-5 w-5 text-amber-400" />
          {c.coursesTitle}
        </h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {paCourses.map((course) => (
            <PACourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* Review */}
      <section className="mt-6">
        <PAReviewDueCard />
      </section>

      {/* Legal + official */}
      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="flex items-center gap-2 text-lg font-black text-white">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            {c.legalTitle}
          </h2>
          <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-400">
            <li>{c.legal1}</li>
            <li>{c.legal2}</li>
            <li>{c.legal3}</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="flex items-center gap-2 text-lg font-black text-white">
            <Route className="h-5 w-5 text-cyan-400" />
            {c.officialTitle}
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-400">{c.officialBody}</p>
          <p className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-3 text-xs leading-6 text-amber-100">
            <span className="font-bold">{c.pilotTitle}: </span>
            {c.pilotBody}
          </p>
          <a
            href={ETM_PA_ROADMAP}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-sm font-black text-amber-200 hover:bg-amber-500/20"
          >
            <ExternalLink className="h-4 w-4" />
            {c.roadmap}
          </a>
        </div>
      </section>

      <PACredit />
    </div>
  );
}
