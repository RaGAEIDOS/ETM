import type { Metadata } from "next";
import { localeFromParams, pageMetadata } from "@/lib/i18n/server";
import LeaderboardClient from "@/components/LeaderboardClient";

const COPY = {
  ar: {
    title: "صدارة المتعلمين — لوحة المنافسة الشخصية",
    description:
      "صدارة المتعلمين على ETM: تقدّمك الحقيقي — نقاط الخبرة، المستوى، السلاسل، المراحل والشهادات — كل شيء محلي على جهازك وبشفافية كاملة، مع توضيح متى ستصل لوحة المنافسة العامة.",
  },
  en: {
    title: "ETM Learners' Front-Runners — your personal rankings",
    description:
      "ETM Learners' Front-Runners: your real progress — XP, level, streaks, milestones and certificates — fully local on your device, with an honest note on when the global board arrives.",
  },
} as const;

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = localeFromParams(params);
  const c = COPY[locale];
  return pageMetadata({
    locale,
    path: "/leaderboard",
    title: c.title,
    description: c.description,
  });
}

export default function LeaderboardPage({ params }: { params: { locale: string } }) {
  return <LeaderboardClient />;
}
