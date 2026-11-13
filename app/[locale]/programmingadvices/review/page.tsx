import type { Metadata } from "next";
import PAReviewSession from "@/components/programmingadvices/PAReviewSession";
import PACredit from "@/components/programmingadvices/PACredit";
import { localeFromParams, pageMetadata } from "@/lib/i18n/server";

const COPY = {
  ar: {
    metaTitle: "المراجعة المتباعدة — Programming Advices",
    metaDescription:
      "راجع مصطلحات Programming Advices بجدول التكرار المتباعد (Leitner): بطاقات اليوم تُبنى من إجاباتك السابقة.",
  },
  en: {
    metaTitle: "Spaced review — Programming Advices",
    metaDescription:
      "Review your Programming Advices key terms with Leitner spaced repetition: today's cards are derived from your past answers.",
  },
} as const;

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = localeFromParams(params);
  const c = COPY[locale];
  return pageMetadata({
    locale,
    path: "/programmingadvices/review",
    title: c.metaTitle,
    description: c.metaDescription,
  });
}

export default function PAReviewPage({ params }: { params: { locale: string } }) {
  localeFromParams(params);
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-10">
      <PAReviewSession />
      <PACredit />
    </div>
  );
}
