import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { stages, findStage } from "@/lib/data";
import { localeFromParams, pageMetadata } from "@/lib/i18n/server";
import StageView from "@/components/StageView";

const COPY = {
  ar: { notFound: "المرحلة غير موجودة" },
  en: { notFound: "Stage not found" },
} as const;

export function generateStaticParams() {
  return stages.map((s) => ({ stage: s.id }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; stage: string };
}): Promise<Metadata> {
  const locale = localeFromParams(params);
  const stage = findStage(params.stage);
  if (!stage) return { title: COPY[locale].notFound };
  return pageMetadata({
    locale,
    path: `/learn/${stage.id}`,
    title: locale === "ar" ? stage.name : stage.nameEn,
    description: stage.description,
  });
}

export default function StagePage({
  params,
}: {
  params: { locale: string; stage: string };
}) {
  const stage = findStage(params.stage);
  if (!stage) notFound();
  return <StageView stage={stage} />;
}
