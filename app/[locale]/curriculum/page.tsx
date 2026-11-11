import type { Metadata } from "next";
import { formatNumber } from "@/lib/i18n/config";
import { localeFromParams, pageMetadata } from "@/lib/i18n/server";
import { stages, totalLessons, totalCourses } from "@/lib/data";
import CurriculumAccordion from "@/components/CurriculumAccordion";
import Reveal from "@/components/Reveal";

const COPY = {
  ar: {
    metaTitle: "المنهج الكامل",
    metaDescription:
      "منهج ETM الكامل لتعلم C++ من الصفر إلى أصعب المستويات — 4 مستويات و17 كورساً وأكثر من 100 درس تفاعلي، مبني على OSSU.",
    eyebrow: "المنهج الكامل",
    titleLead: "طريقك من الصفر إلى",
    titleHighlight: "الاحتراف",
    intro: (courses: string, lessons: string, levels: string) =>
      `${courses} كورساً · ${lessons} درساً تفاعلياً · ${levels} مستويات صعوبة. كل درس فيه شرح واضح، أمثلة قابلة للتشغيل، اختبار، وتمرين.`,
  },
  en: {
    metaTitle: "Full Curriculum",
    metaDescription:
      "The complete ETM curriculum for learning C++ from zero to extreme difficulty — 4 levels, 17 courses, over 100 interactive lessons, based on OSSU.",
    eyebrow: "Full Curriculum",
    titleLead: "Your path from zero to",
    titleHighlight: "mastery",
    intro: (courses: string, lessons: string, levels: string) =>
      `${courses} courses · ${lessons} interactive lessons · ${levels} difficulty levels. Every lesson has a clear explanation, runnable examples, a quiz, and an exercise.`,
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
    path: "/curriculum",
    title: c.metaTitle,
    description: c.metaDescription,
  });
}

export default function CurriculumPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = localeFromParams(params);
  const c = COPY[locale];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <Reveal>
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-sm font-bold text-cyan-400">{c.eyebrow}</span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-black text-white leading-tight">
            {c.titleLead}{" "}
            <span className="gradient-text">{c.titleHighlight}</span>
          </h1>
          <p className="mt-4 text-lg text-slate-400 leading-8">
            {c.intro(
              formatNumber(totalCourses()),
              formatNumber(totalLessons()),
              formatNumber(stages.length)
            )}
          </p>
        </div>
      </Reveal>

      <CurriculumAccordion stages={stages} />
    </div>
  );
}
