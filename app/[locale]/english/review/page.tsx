import type { Metadata } from "next";
import EnglishReviewSession from "@/components/english/EnglishReviewSession";
import EnglishCredit from "@/components/english/EnglishCredit";
import { localeFromParams, pageMetadata } from "@/lib/i18n/server";

const COPY = {
  ar: {
    metaTitle: "المراجعة المتباعدة — قسم الإنجليزية",
    metaDescription:
      "راجع مصطلحاتك الإنجليزية بجدول التكرار المتباعد (Leitner): بطاقات اليوم تُبنى من إجاباتك السابقة.",
  },
  en: {
    metaTitle: "Spaced review — English section",
    metaDescription:
      "Review your English key terms with Leitner spaced repetition: today's cards are derived from your past answers.",
  },
} as const;

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = localeFromParams(params);
  const c = COPY[locale];
  return pageMetadata({
    locale,
    path: "/english/review",
    title: c.metaTitle,
    description: c.metaDescription,
  });
}

export default function EnglishReviewPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12">
      <EnglishReviewSession />
      <EnglishCredit />
    </div>
  );
}
