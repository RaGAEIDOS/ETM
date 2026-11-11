import type { Metadata } from "next";
import { Target } from "lucide-react";
import ProjectsGrid from "@/components/ProjectsGrid";
import { localeFromParams, pageMetadata } from "@/lib/i18n/server";

const COPY = {
  ar: {
    metaTitle: "المشاريع",
    metaDescription:
      "مشاريع برمجة حقيقية بمستويات متدرجة — من آلة حاسبة بسيطة إلى لعبة Snake بمحركك ونواة نظام تشغيل.",
    titleLead: "مشاريع",
    titleHighlight: "حقيقية",
    intro:
      "التعلم الحقيقي يحدث عندما تبني. كل مشروع يجمع المفاهيم التي تعلمتها ويحولها إلى شيء ملموس تفتخر به.",
  },
  en: {
    metaTitle: "Projects",
    metaDescription:
      "Real programming projects at graduated levels — from a simple calculator to a Snake game with your own engine and an operating system kernel.",
    titleLead: "Real",
    titleHighlight: "projects",
    intro:
      "Real learning happens when you build. Every project brings together the concepts you learned and turns them into something tangible you can be proud of.",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = localeFromParams(params);
  return pageMetadata({
    locale,
    path: "/projects",
    title: COPY[locale].metaTitle,
    description: COPY[locale].metaDescription,
  });
}

export default function ProjectsPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = localeFromParams(params);
  const c = COPY[locale];
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-400 mb-4">
          <Target className="h-7 w-7" />
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-white">
          {c.titleLead} <span className="gradient-text">{c.titleHighlight}</span>
        </h1>
        <p className="mt-4 text-lg text-slate-400 leading-8">{c.intro}</p>
      </div>

      <ProjectsGrid />
    </div>
  );
}
