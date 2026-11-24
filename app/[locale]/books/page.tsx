import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  ExternalLink,
  FileText,
  Github,
  Info,
  Sparkles,
} from "lucide-react";
import { freeBooksByCategory, type FreeBook } from "@/lib/free-books";
import {
  SELF_DEVELOPMENT_BOOKS,
  type SelfDevelopmentAccent,
  type SelfDevelopmentBook,
} from "@/lib/self-development";
import { formatNumber, localePath, type Locale } from "@/lib/i18n/config";
import { localeFromParams, pageMetadata } from "@/lib/i18n/server";
import ContinueReading from "@/components/books/ContinueReading";

const LEVEL_COLORS: Record<number, string> = {
  1: "from-emerald-400 to-cyan-500 text-emerald-200",
  2: "from-cyan-400 to-blue-500 text-cyan-200",
  3: "from-violet-400 to-fuchsia-500 text-violet-200",
  4: "from-amber-400 to-rose-500 text-amber-200",
};

const SELF_DEVELOPMENT_ACCENTS: Record<
  SelfDevelopmentAccent,
  { border: string; gradient: string; chip: string; button: string }
> = {
  teal: {
    border: "border-cyan-500/25",
    gradient: "from-cyan-500/[0.10] via-white/[0.03] to-teal-500/[0.05]",
    chip: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
    button: "bg-cyan-500/15 text-cyan-200 hover:bg-cyan-500/25 border-cyan-500/30",
  },
  amber: {
    border: "border-amber-500/25",
    gradient: "from-amber-500/[0.10] via-white/[0.03] to-orange-500/[0.05]",
    chip: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    button: "bg-amber-500/15 text-amber-200 hover:bg-amber-500/25 border-amber-500/30",
  },
};

const COPY = {
  ar: {
    metaTitle: "الكتب والملخصات",
    metaDescription:
      "مكتبة ETM: كتب مجانية رسمياً لعلوم الحاسوب، وكتب تنمية ذاتية بملخصات أصلية وقارئ مدمج يتذكر آخر صفحة قرأتها.",
    eyebrow: "مكتبة ETM",
    titleLead: "اقرأ من",
    titleHighlight: "أفضل الكتب والملخصات",
    intro:
      "قسمان في مكتبة واحدة: كتب مجانية رسمياً يمكنك فتحها أونلاين، وكتب تنمية ذاتية بملخصات أصلية كتبناها خصيصاً لـ ETM مع قارئ مدمج يستأنف من آخر صفحة.",
    selfDev: {
      title: "تنمية ذاتية",
      description:
        "كتب مختارة عن الدماغ والعادات والقوة والعلاقات، مع ملخصات منظمة وأفكار قابلة للتطبيق وقارئ يحفظ مكانك تلقائياً.",
      count: (n: string) => `${n} كتاب`,
      badge: "ملخص أصلي + قارئ",
      pages: (n: string) => `${n} صفحة`,
      summaryCta: "اقرأ الملخص",
      note:
        "الملخصات مكتوبة خصيصاً لـ ETM وليست منسوخة من الكتاب. ملفات PDF مرفوعة للقراءة الشخصية داخل المنصة، وحقوق النشر محفوظة للمؤلفين والناشرين.",
    },
    free: {
      title: "الكتب المجانية",
      intro:
        "مكتبة برمجة وعلوم حاسوب مجانية رسمياً: وصول مفتوح، أو ترخيص المشاع الإبداعي، أو إصدار مجاني من المؤلف أو الناشر.",
      disclaimer1:
        "كل روابط الكتب رسمية وقانونية. لا يوجد قرصنة هنا — كل مصدر إما منشور كوصول مفتوح من ناشره، أو تحت ترخيص Creative Commons، أو متوفر مجاناً بإذن صريح من مؤلفه. إن وجدت رابطاً لا يعمل، افتح issue على مستودع ETM",
      disclaimerLink: "على GitHub",
      disclaimer2: ".",
    },
    levelLabels: { 1: "الفصل 1", 2: "الفصل 2", 3: "الفصل 3", 4: "الفصل 4" },
    openBook: "افتح الكتاب الرسمي",
    ctaTitle: "تريد إضافة كتاب؟",
    ctaBody:
      "افتح Pull Request أو Issue على GitHub باسم الكتاب ورابطه الرسمي المجاني.",
    contribute: "ساهم على GitHub",
  },
  en: {
    metaTitle: "Books & Summaries",
    metaDescription:
      "The ETM library: officially free computer-science books, plus self-development books with original summaries and a reader that remembers your last page.",
    eyebrow: "ETM library",
    titleLead: "Read from",
    titleHighlight: "the best books and summaries",
    intro:
      "Two collections in one library: officially free books you can open online, and self-development books with original summaries written for ETM, plus an in-app reader that resumes from your last page.",
    selfDev: {
      title: "Self-development",
      description:
        "Selected books on the brain, habits, power, and relationships, with structured summaries, practical ideas, and a reader that saves your place automatically.",
      count: (n: string) => `${n} books`,
      badge: "Original summary + reader",
      pages: (n: string) => `${n} pages`,
      summaryCta: "Read the summary",
      note:
        "Summaries are written specifically for ETM and are not copied from the books. The PDFs are hosted for personal reading inside the platform; copyright remains with the authors and publishers.",
    },
    free: {
      title: "Free books",
      intro:
        "An officially free programming and computer-science library: open access, Creative Commons, or released free by the author or publisher.",
      disclaimer1:
        "All book links are official and legal. There is no piracy here — every resource is either published as open access by its publisher, released under a Creative Commons license, or explicitly offered free by the author. If you spot a broken link, please open an issue on the ETM",
      disclaimerLink: "GitHub repository",
      disclaimer2: ".",
    },
    levelLabels: { 1: "Stage 1", 2: "Stage 2", 3: "Stage 3", 4: "Stage 4" },
    openBook: "Open official book",
    ctaTitle: "Want a book added?",
    ctaBody:
      "Open a pull request or issue on GitHub with the book name and its official free link.",
    contribute: "Contribute on GitHub",
  },
} as const;

function SelfDevelopmentCard({
  book,
  locale,
}: {
  book: SelfDevelopmentBook;
  locale: Locale;
}) {
  const c = COPY[locale];
  const accent = SELF_DEVELOPMENT_ACCENTS[book.accent];
  const arrowClass = locale === "ar" ? "" : "rotate-180";

  return (
    <article
      className={`flex flex-col overflow-hidden rounded-2xl border ${accent.border} bg-gradient-to-br ${accent.gradient} p-6`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span
          className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${accent.chip}`}
        >
          {c.selfDev.badge}
        </span>
        <span className="text-[11px] font-bold text-slate-400">
          {c.selfDev.pages(formatNumber(book.pages))}
        </span>
      </div>

      <h3 className="mt-5 text-2xl font-black leading-9 text-white" dir="auto">
        {book.title}
      </h3>
      <p className="mt-1 text-sm text-slate-400" dir="auto">
        {book.author} · {book.year}
      </p>
      <p className="mt-4 flex-1 text-sm leading-7 text-slate-300" dir="rtl">
        {book.tagline}
      </p>

      <div className="mt-5 flex flex-wrap items-stretch gap-2">
        <Link
          href={localePath(locale, `/books/self-development/${book.slug}`)}
          className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition-colors ${accent.button}`}
        >
          <FileText className="h-4 w-4" />
          {c.selfDev.summaryCta}
          <ArrowLeft className={`h-4 w-4 ${arrowClass}`} />
        </Link>
        <ContinueReading
          slug={book.slug}
          locale={locale}
          className="!border-white/10 !bg-white/5 !text-slate-200 hover:!border-white/20 hover:!bg-white/10"
        />
      </div>
    </article>
  );
}

function BookCard({
  book,
  locale,
}: {
  book: FreeBook;
  locale: Locale;
}) {
  const c = COPY[locale];
  return (
    <a
      href={book.url}
      target="_blank"
      rel="noreferrer"
      className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-cyan-500/30 hover:bg-white/[0.05] transition-all"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 text-xs font-bold text-cyan-300 uppercase tracking-wide">
          {book.format}
        </span>
        <span
          className={`rounded-full border border-white/10 bg-gradient-to-l ${
            LEVEL_COLORS[book.level]
          } bg-opacity-10 px-2.5 py-0.5 text-xs font-bold`}
        >
          {c.levelLabels[book.level as 1 | 2 | 3 | 4]}
        </span>
      </div>

      <h3
        className="mt-4 font-bold text-white group-hover:text-cyan-300 transition-colors leading-7"
        dir="auto"
      >
        {book.title}
      </h3>
      <p className="mt-1 text-sm text-slate-500" dir="auto">
        {book.author}
      </p>
      <p className="mt-3 flex-1 text-sm text-slate-400 leading-6" dir="auto">
        {book.desc}
      </p>

      <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 group-hover:underline">
        {c.openBook} <ExternalLink className="h-3.5 w-3.5" />
      </span>
    </a>
  );
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = localeFromParams(params);
  return pageMetadata({
    locale,
    path: "/books",
    title: COPY[locale].metaTitle,
    description: COPY[locale].metaDescription,
  });
}

export default function BooksPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = localeFromParams(params);
  const c = COPY[locale];
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-sm font-bold text-cyan-400">{c.eyebrow}</span>
        <h1 className="mt-3 text-4xl sm:text-5xl font-black text-white">
          {c.titleLead}{" "}
          <span className="gradient-text">{c.titleHighlight}</span>
        </h1>
        <p className="mt-4 text-lg text-slate-400 leading-8">{c.intro}</p>
      </div>

      {/* Self-development collection */}
      <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-5 sm:p-7">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-black text-white">
              <Sparkles className="h-6 w-6 text-cyan-400" />
              {c.selfDev.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">
              {c.selfDev.description}
            </p>
          </div>
          <span className="rounded-full border border-cyan-500/20 bg-cyan-500/[0.06] px-3 py-1 text-[11px] font-bold text-cyan-300">
            {c.selfDev.count(formatNumber(SELF_DEVELOPMENT_BOOKS.length))}
          </span>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {SELF_DEVELOPMENT_BOOKS.map((book) => (
            <SelfDevelopmentCard key={book.slug} book={book} locale={locale} />
          ))}
        </div>

        <p className="mt-4 text-[11px] leading-6 text-slate-500">
          {c.selfDev.note}
        </p>
      </section>

      {/* Free books collection */}
      <section className="mt-14">
        <div className="mb-5">
          <h2 className="flex items-center gap-2 text-2xl font-black text-white">
            <BookOpen className="h-6 w-6 text-cyan-400" />
            {c.free.title}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-400">
            {c.free.intro}
          </p>
        </div>

        {/* Disclaimer scoped to the external free catalogue only */}
        <div className="mb-8 rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-amber-300 mt-0.5 shrink-0" />
            <p className="text-sm text-amber-100/80 leading-7">
              {c.free.disclaimer1}{" "}
              <a
                href="https://github.com/RaGAEIDOS/ETM"
                target="_blank"
                rel="noreferrer"
                className="text-amber-200 hover:underline"
              >
                {c.free.disclaimerLink}
              </a>
              {c.free.disclaimer2}
            </p>
          </div>
        </div>

        {freeBooksByCategory.map((section) => (
          <section key={section.category} className="mt-10">
            <h3 className="mb-5 text-xl font-black text-white">
              {section.category}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {section.books.map((book) => (
                <BookCard key={book.url} book={book} locale={locale} />
              ))}
            </div>
          </section>
        ))}
      </section>

      {/* Footer CTA */}
      <div className="mt-14 rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center">
        <Github className="h-7 w-7 text-slate-500 mx-auto mb-3" />
        <h3 className="text-xl font-black text-white">{c.ctaTitle}</h3>
        <p className="mt-2 text-slate-400 leading-7">{c.ctaBody}</p>
        <a
          href="https://github.com/RaGAEIDOS/ETM"
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-bold text-white hover:bg-white/10 transition-colors"
        >
          <Github className="h-4 w-4" /> {c.contribute}
        </a>
      </div>
    </div>
  );
}
