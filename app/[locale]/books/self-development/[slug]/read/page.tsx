import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, ShieldCheck } from "lucide-react";
import {
  SELF_DEVELOPMENT_BOOKS,
  findSelfDevelopmentBook,
} from "@/lib/self-development";
import { formatNumber, localePath } from "@/lib/i18n/config";
import { localeFromParams, pageMetadata } from "@/lib/i18n/server";
import PdfReader from "@/components/books/PdfReader";

const COPY = {
  ar: {
    back: "الملخص والتفاصيل",
    eyebrow: "قارئ الكتاب",
    hint: "استخدم الأسهم أو أدخل رقم الصفحة للتنقل. يُحفظ مكانك تلقائياً وتستأنف من نفس الصفحة في المرة القادمة.",
    privacy: "تُحفظ آخر صفحة محلياً على جهازك فقط، ولا تُرسل إلى أي خادم.",
    pages: (n: string) => `${n} صفحة`,
    notFound: "الكتاب غير موجود",
  },
  en: {
    back: "Summary & details",
    eyebrow: "Book reader",
    hint: "Use the arrows or type a page number to navigate. Your place is saved automatically and resumes on your next visit.",
    privacy: "The last page is stored locally on your device only and is never sent to a server.",
    pages: (n: string) => `${n} pages`,
    notFound: "Book not found",
  },
} as const;

export function generateStaticParams() {
  return SELF_DEVELOPMENT_BOOKS.map((book) => ({ slug: book.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Metadata {
  const locale = localeFromParams(params);
  const c = COPY[locale];
  const book = findSelfDevelopmentBook(params.slug);
  if (!book) return { title: c.notFound };
  return {
    ...pageMetadata({
      locale,
      path: `/books/self-development/${book.slug}/read`,
      title: `${book.title} — ${c.eyebrow}`,
      description: book.description,
    }),
    robots: { index: false, follow: true },
  };
}

export default function SelfDevelopmentReaderPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const locale = localeFromParams(params);
  const c = COPY[locale];
  const book = findSelfDevelopmentBook(params.slug);
  if (!book) notFound();

  const backArrow = locale === "ar" ? "rotate-180" : "";

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={localePath(locale, `/books/self-development/${book.slug}`)}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 transition-colors hover:text-cyan-300"
        >
          <ArrowLeft className={`h-4 w-4 ${backArrow}`} />
          {c.back}
        </Link>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-bold text-slate-400">
          <BookOpen className="h-3.5 w-3.5" />
          {c.pages(formatNumber(book.pages))}
        </span>
      </div>

      <header className="mt-5">
        <span className="text-xs font-bold text-cyan-400">{c.eyebrow}</span>
        <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl" dir="rtl">
          {book.title}
        </h1>
        <p className="mt-2 text-sm text-slate-400" dir="auto">
          {book.author} · {book.titleEn}
        </p>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">{c.hint}</p>
      </header>

      <PdfReader bookId={book.slug} pdfUrl={book.pdf} title={book.title} locale={locale} />

      <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-[10px] font-bold text-slate-600">
        <ShieldCheck className="h-3.5 w-3.5" />
        {c.privacy}
      </p>
    </div>
  );
}
