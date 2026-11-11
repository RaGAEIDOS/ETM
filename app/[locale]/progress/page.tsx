import type { Metadata } from "next";
import { BarChart3 } from "lucide-react";
import ProgressDashboard from "@/components/ProgressDashboard";
import { localeFromParams, pageMetadata } from "@/lib/i18n/server";

const COPY = {
  ar: {
    metaTitle: "تقدمك",
    metaDescription:
      "تابع تقدمك في منهج ETM: عدد الدروس التي أكملتها، ونسبة الإنجاز لكل مستوى، والدروس التي أنهيتها.",
    titlePrefix: "تقدمك",
    titleHighlight: "في الرحلة",
    intro:
      "بياناتك محفوظة على جهازك — بلا حسابات ولا تسجيل. اعرف بالضبط أين وصلت وما تبقى.",
  },
  en: {
    metaTitle: "Your Progress",
    metaDescription:
      "Track your progress in the ETM curriculum: how many lessons you completed, completion percentage for every stage, and the lessons you finished.",
    titlePrefix: "Your progress",
    titleHighlight: "in the journey",
    intro:
      "Your data is saved on your device — no accounts, no sign-up. See exactly where you are and what is left.",
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
    path: "/progress",
    title: COPY[locale].metaTitle,
    description: COPY[locale].metaDescription,
  });
}

export default function ProgressPage({ params }: { params: { locale: string } }) {
  const locale = localeFromParams(params);
  const c = COPY[locale];
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400 mb-4">
          <BarChart3 className="h-7 w-7" />
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-white">
          {c.titlePrefix} <span className="gradient-text">{c.titleHighlight}</span>
        </h1>
        <p className="mt-4 text-lg text-slate-400 leading-8">{c.intro}</p>
      </div>

      <ProgressDashboard />
    </div>
  );
}
