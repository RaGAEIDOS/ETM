import type { Metadata } from "next";
import { BookMarked } from "lucide-react";
import GlossarySearch from "@/components/GlossarySearch";
import { localeFromParams, pageMetadata } from "@/lib/i18n/server";

const COPY = {
  ar: {
    metaTitle: "دليل المصطلحات",
    metaDescription:
      "دليل شامل لمصطلحات البرمجة وعلوم الحاسوب بالإنجليزية والعربية — شرح مبسط لكل مصطلح.",
    title: "دليل المصطلحات",
    intro:
      "كل مصطلح إنجليزي في البرمجة وعلوم الحاسوب مشروح بالعربية — فلا يوجد حاجز لغوي يقف في طريقك.",
  },
  en: {
    metaTitle: "Glossary",
    metaDescription:
      "A comprehensive glossary of programming and computer science terms in English and Arabic — a simple explanation for every term.",
    title: "Glossary",
    intro:
      "Every English term in programming and computer science, explained in Arabic — so there is no language barrier in your way.",
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
    path: "/glossary",
    title: COPY[locale].metaTitle,
    description: COPY[locale].metaDescription,
  });
}

export default function GlossaryPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = localeFromParams(params);
  const c = COPY[locale];
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-400 mb-4">
          <BookMarked className="h-7 w-7" />
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-white">
          <span className="gradient-text">{c.title}</span>
        </h1>
        <p className="mt-4 text-lg text-slate-400 leading-8">{c.intro}</p>
      </div>

      <GlossarySearch />
    </div>
  );
}
