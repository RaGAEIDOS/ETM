import type { Metadata } from "next";
import Cs50xReviewSession from "@/components/cs50x/Cs50xReviewSession";
import Cs50xCredit from "@/components/cs50x/Cs50xCredit";
import { localeFromParams, pageMetadata } from "@/lib/i18n/server";

const COPY = {
  ar: {
    metaTitle: "المراجعة المتباعدة — مسار CS50x",
    metaDescription:
      "راجع مصطلحات CS50x بالتكرار المتباعد (طريقة Leitner): البطاقات المستحقة مشتقة من إجاباتك السابقة على هذا الجهاز.",
  },
  en: {
    metaTitle: "Spaced review — CS50x track",
    metaDescription:
      "Review CS50x terms with Leitner spaced repetition: due cards are derived from your past answers on this device.",
  },
} as const;

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = localeFromParams(params);
  const c = COPY[locale];
  return pageMetadata({
    locale,
    path: "/cs50x/review",
    title: c.metaTitle,
    description: c.metaDescription,
  });
}

export default function Cs50xReviewPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <Cs50xReviewSession />
      <Cs50xCredit />
    </div>
  );
}
