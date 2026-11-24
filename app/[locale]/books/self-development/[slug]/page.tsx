import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  FileText,
  Lightbulb,
  Quote,
  Sparkles,
} from "lucide-react";
import {
  SELF_DEVELOPMENT_BOOKS,
  findSelfDevelopmentBook,
  type SelfDevelopmentAccent,
} from "@/lib/self-development";
import { formatNumber, localePath } from "@/lib/i18n/config";
import { localeFromParams, pageMetadata } from "@/lib/i18n/server";
import ContinueReading from "@/components/books/ContinueReading";

const ACCENTS: Record<
  SelfDevelopmentAccent,
  { border: string; gradient: string; chip: string; icon: string }
> = {
  teal: {
    border: "border-cyan-500/25",
    gradient: "from-cyan-500/[0.10] via-ink-900/60 to-teal-500/[0.05]",
    chip: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
    icon: "text-cyan-300",
  },
  amber: {
    border: "border-amber-500/25",
    gradient: "from-amber-500/[0.10] via-ink-900/60 to-orange-500/[0.05]",
    chip: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    icon: "text-amber-300",
  },
};

const COPY = {
  ar: {
    back: "كل الكتب",
    original: "ملخص أصلي لـ ETM",
    pages: (n: string) => `${n} صفحة`,
    sections: (n: string) => `${n} أقسام`,
    keyIdeas: "أهم الأفكار",
    summaryTitle: "ملخص الكتاب",
    summaryIntro:
      "ملخص منظم بأسلوبنا، يركز على الأفكار الأساسية والتطبيق العملي بدل نقل النص.",
    takeaway: "الخلاصة في سطر",
    openPdf: "فتح ملف PDF",
    readNow: "اقرأ النسخة الكاملة داخل ETM",
    note:
      "هذا الملخص قراءة منظمة للكتاب وليس بديلاً عن النص الكامل. حقوق النص الأصلي محفوظة للمؤلف والناشر.",
    notFound: "الكتاب غير موجود",
    metaSuffix: "ملخص الكتاب",
  },
  en: {
    back: "All books",
    original: "Original ETM summary",
    pages: (n: string) => `${n} pages`,
    sections: (n: string) => `${n} sections`,
    keyIdeas: "Key ideas",
    summaryTitle: "Book summary",
    summaryIntro:
      "A structured summary in our own words, focused on the core ideas and practical application instead of copying the text.",
    takeaway: "The takeaway",
    openPdf: "Open the PDF",
    readNow: "Read the full version inside ETM",
    note:
      "This summary is an organised reading of the book, not a substitute for the full text. Copyright remains with the author and publisher.",
    notFound: "Book not found",
    metaSuffix: "book summary",
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
  return pageMetadata({
    locale,
    path: `/books/self-development/${book.slug}`,
    title: `${book.title} — ${c.metaSuffix}`,
    description: book.description,
  });
}

export default function SelfDevelopmentBookPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const locale = localeFromParams(params);
  const c = COPY[locale];
  const book = findSelfDevelopmentBook(params.slug);
  if (!book) notFound();

  const accent = ACCENTS[book.accent];
  const backArrow = locale === "ar" ? "rotate-180" : "";

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <Link
        href={localePath(locale, "/books")}
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 transition-colors hover:text-cyan-300"
      >
        <ArrowLeft className={`h-4 w-4 ${backArrow}`} />
        {c.back}
      </Link>

      <header
        className={`mt-5 rounded-3xl border ${accent.border} bg-gradient-to-br ${accent.gradient} p-6 sm:p-8`}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${accent.chip}`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            {c.original}
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-bold text-slate-300">
            {c.pages(formatNumber(book.pages))}
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-bold text-slate-300">
            {c.sections(formatNumber(book.sections.length))}
          </span>
        </div>

        <h1 className="mt-5 text-3xl font-black leading-tight text-white sm:text-4xl" dir="rtl">
          {book.title}
        </h1>
        <p className="mt-2 text-sm text-slate-400" dir="auto">
          {book.titleEn} · {book.author} · {book.year}
        </p>
        <p className="mt-4 text-lg leading-8 text-slate-200" dir="rtl">
          {book.tagline}
        </p>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400" dir="rtl">
          {book.description}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <ContinueReading slug={book.slug} locale={locale} />
          <a
            href={book.pdf}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-white/10"
          >
            <ExternalLink className="h-4 w-4" />
            {c.openPdf}
          </a>
        </div>
      </header>

      <section className="mt-10 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <h2 className="flex items-center gap-2 text-xl font-black text-white">
          <Lightbulb className={`h-5 w-5 ${accent.icon}`} />
          {c.keyIdeas}
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {book.keyIdeas.map((idea) => (
            <li
              key={idea}
              className="flex items-start gap-2 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5"
            >
              <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${accent.icon}`} />
              <span className="text-sm leading-7 text-slate-300" dir="rtl">
                {idea}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-black text-white">
              <BookOpen className={`h-6 w-6 ${accent.icon}`} />
              {c.summaryTitle}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">
              {c.summaryIntro}
            </p>
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-bold text-slate-400">
            {c.sections(formatNumber(book.sections.length))}
          </span>
        </div>

        <div className="mt-6 space-y-5">
          {book.sections.map((section, index) => (
            <article
              key={section.title}
              id={`section-${index + 1}`}
              className="scroll-mt-24 rounded-2xl border border-white/10 bg-white/[0.02] p-6"
            >
              <h3 className="text-lg font-black leading-8 text-white" dir="rtl">
                {section.title}
              </h3>
              <div className="mt-3 space-y-3">
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 32)}
                    className="text-sm leading-8 text-slate-300"
                    dir="rtl"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
              {section.bullets && section.bullets.length > 0 && (
                <ul className="mt-4 space-y-2 border-t border-white/5 pt-4">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2">
                      <span
                        className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-current ${accent.icon}`}
                      />
                      <span className="text-sm leading-7 text-slate-400" dir="rtl">
                        {bullet}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </section>

      <div
        className={`mt-10 rounded-2xl border ${accent.border} bg-gradient-to-br ${accent.gradient} p-6`}
      >
        <Quote className={`h-6 w-6 ${accent.icon}`} />
        <p className="mt-3 text-base font-bold leading-8 text-white" dir="rtl">
          {book.takeaway}
        </p>
      </div>

      <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center">
        <FileText className={`h-7 w-7 ${accent.icon}`} />
        <h2 className="text-xl font-black text-white">{c.readNow}</h2>
        <ContinueReading slug={book.slug} locale={locale} align="center" />
        <p className="max-w-2xl text-[11px] leading-6 text-slate-500">{c.note}</p>
      </div>
    </div>
  );
}
