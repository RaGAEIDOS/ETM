import type { Metadata } from "next";
import { Target } from "lucide-react";
import ProjectsGrid from "@/components/ProjectsGrid";

export const metadata: Metadata = {
  title: "المشاريع",
  description:
    "مشاريع برمجية حقيقية بمستويات متدرجة — من آلة حاسبة بسيطة لحد لعبة Snake بمحرك خاص ونواة نظام تشغيل.",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-400 mb-4">
          <Target className="h-7 w-7" />
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-white">
          مشاريع <span className="gradient-text">حقيقية</span>
        </h1>
        <p className="mt-4 text-lg text-slate-400 leading-8">
          التعلم الحقيقي بيحصل لما تبني. كل مشروع بيجمع المفاهيم اللي اتعلمتها
          ويضعها في منتج ملموس تقدر تفخر بيه.
        </p>
      </div>

      <ProjectsGrid />
    </div>
  );
}
