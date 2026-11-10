import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { stages, findStage } from "@/lib/data";
import StageView from "@/components/StageView";

export function generateStaticParams() {
  return stages.map((s) => ({ stage: s.id }));
}

export async function generateMetadata({
  params,
}: {
  params: { stage: string };
}): Promise<Metadata> {
  const stage = findStage(params.stage);
  if (!stage) return { title: "Stage not found" };
  return { title: stage.name, description: stage.description };
}

export default function StagePage({
  params,
}: {
  params: { stage: string };
}) {
  const stage = findStage(params.stage);
  if (!stage) notFound();
  return <StageView stage={stage} />;
}
