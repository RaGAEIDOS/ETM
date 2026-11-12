import type { Metadata } from "next";
import DashboardClient from "@/components/DashboardClient";
import { localeFromParams, pageMetadata } from "@/lib/i18n/server";

const COPY = {
  ar: {
    metaTitle: "لوحة التحكم",
    metaDescription:
      "تابع تقدمك في التعلم: الدروس المكتملة، فيديوهات ElZero المشاهدة، وقت التركيز، سلسلة الأيام، وما تبقى في المنهج.",
  },
  en: {
    metaTitle: "Dashboard",
    metaDescription:
      "Track your learning progress: lessons completed, ElZero videos watched, focus time, streaks, and what is left in the curriculum.",
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
    path: "/dashboard",
    title: COPY[locale].metaTitle,
    description: COPY[locale].metaDescription,
  });
}

export default function DashboardPage() {
  return <DashboardClient />;
}
