import type { Metadata } from "next";
import LinuxReviewSession from "@/components/linux/LinuxReviewSession";
import LinuxCredit from "@/components/linux/LinuxCredit";
import { localeFromParams, pageMetadata } from "@/lib/i18n/server";

const COPY = {
  ar: {
    metaTitle: "المراجعة المتباعدة — قسم لينكس",
    metaDescription:
      "راجع مصطلحاتك وأوامرك بجدول التكرار المتباعد (Leitner): بطاقات اليوم تُبنى من إجاباتك السابقة.",
  },
  en: {
    metaTitle: "Spaced review — Linux section",
    metaDescription:
      "Review your Linux terms and commands with Leitner spaced repetition: today's cards are derived from your past answers.",
  },
} as const;

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = localeFromParams(params);
  const c = COPY[locale];
  return pageMetadata({
    locale,
    path: "/linux/review",
    title: c.metaTitle,
    description: c.metaDescription,
  });
}

export default function LinuxReviewPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <LinuxReviewSession />
      <LinuxCredit />
    </div>
  );
}
