import type { Metadata } from "next";
import type { ReactNode } from "react";
import { FlaskConical } from "lucide-react";
import { localeFromParams, pageMetadata } from "@/lib/i18n/server";
import type { Locale } from "@/lib/i18n/config";

const COPY = {
  ar: {
    metaTitle: "اختبار اتجاه النص",
    metaDescription:
      "صفحة داخلية تعرض أصعب حالات مزج العربية مع الإنجليزية والكود والأرقام للتأكد من عزل الاتجاه بشكل صحيح.",
    title: "مختبر اتجاه النص (BiDi)",
    intro:
      "حالات اختبر فيها اتجاه النص المختلط: عربية مع إنجليزية، كود داخل جمل عربية، روابط وأرقام ورموز. كل سطر يجب أن يعرض بالترتيب الصحيح.",
    rtlSection: "داخل سياق عربي (RTL)",
    ltrSection: "داخل سياق إنجليزي (LTR)",
    noteTitle: "كيف تتحقق",
    note1: "كل نص إنجليزي/كود/رابط داخل الجملة العربية يجب أن يظهر معزولاً باتجاهه الصحيح.",
    note2: "الأقواس والعلامات يجب أن تلتصق بمحتواها وليس بالجهة الخاطئة.",
    note3: "الأرقام تستخدم الخانات الغربية (0-9) في كل اللغات.",
  },
  en: {
    metaTitle: "Bidirectional text test",
    metaDescription:
      "Internal page rendering the toughest Arabic/English/code/number mixing cases to verify direction isolation.",
    title: "BiDi Laboratory",
    intro:
      "Cases for mixed-direction text: Arabic with English, code inside Arabic sentences, URLs, digits and symbols. Every line must render in the correct order.",
    rtlSection: "Inside an Arabic (RTL) context",
    ltrSection: "Inside an English (LTR) context",
    noteTitle: "How to verify",
    note1: "Every English/code/URL span inside an Arabic sentence must appear isolated, in its own direction.",
    note2: "Parentheses and punctuation must hug their own content, not the wrong edge.",
    note3: "Digits must use Western numerals (0-9) in both languages.",
  },
} as const;

// The mixed-content test lines. Keys are stable ids; rendering adds isolation explicitly.
const RTL_LINES: { id: string; content: ReactNode }[] = [
  {
    id: "term",
    content: (
      <>
        المتغير <code dir="ltr">counter</code> يُستخدم لعدّ التكرارات داخل الحلقة.
      </>
    ),
  },
  {
    id: "parens",
    content: (
      <>
        اضغط <bdi dir="ltr">Run</bdi> (أو <bdi dir="ltr">Ctrl + Enter</bdi>) للتنفيذ.
      </>
    ),
  },
  {
    id: "url",
    content: (
      <>
        اذهب إلى <bdi dir="ltr">https://ossu.github.io/computer-science</bdi> — المنهج الأساسي.
      </>
    ),
  },
  {
    id: "email",
    content: (
      <>
        للمساعدة راسلنا على <bdi dir="ltr">support@etm.dev</bdi> في أي وقت.
      </>
    ),
  },
  {
    id: "progress",
    content: <>أكملت 47 من 128 درساً (37%) — ممتاز، واصل!</>,
  },
  {
    id: "code",
    content: (
      <code dir="ltr" className="block text-start">
        std::cout &lt;&lt; &quot;مرحبا بالعالم&quot; &lt;&lt; std::endl;
      </code>
    ),
  },
  {
    id: "quote",
    content: <>النجاح هو أن تكون <bdi dir="ltr">&quot;consistent&quot;</bdi> كل يوم، لا أن تكون <bdi dir="ltr">&quot;perfect&quot;</bdi> يوماً واحداً.</>,
  },
  {
    id: "percent",
    content: <>التقدم هذا الأسبوع: +25% — و−3% في الكورسات الفرعية.</>,
  },
  {
    id: "signed",
    content: <>الرصيد: <bdi dir="ltr">+1,250 XP</bdi> وأفضل سلسلة <bdi dir="ltr">17 يوم</bdi>.</>,
  },
  {
    id: "path",
    content: (
      <>
        الملف المسؤول هو <code dir="ltr">app/[locale]/page.tsx</code> وليس غيره.
      </>
    ),
  },
  {
    id: "counts",
    content: <>4 مراحل · 19 كورساً · 128 درساً · 75 مصطلحاً</>,
  },
  {
    id: "nesting",
    content: (
      <>
        راجع درس <bdi dir="ltr">&quot;Pointers &amp; References&quot;</bdi> (المؤشرات) في مرحلة Foundations (الأولية).
      </>
    ),
  },
  {
    id: "glosses",
    content: (
      <>
        مصطلح اليوم: <bdi dir="ltr">segmentation fault</bdi> (خطأ تجزئة) — محاولة الوصول لذاكرة غير مسموح بها.
      </>
    ),
  },
  {
    id: "mixed-strong",
    content: (
      <>
        الإصدار الحالي <bdi dir="ltr">v2.4.1 (build 318)</bdi> يدعم <bdi dir="ltr">C++20</bdi> بالكامل.
      </>
    ),
  },
];

const LTR_LINES: { id: string; content: ReactNode }[] = [
  {
    id: "term-en",
    content: (
      <>
        The variable <code dir="ltr">counter</code> is used to count loop iterations (العدّ).
      </>
    ),
  },
  {
    id: "parens-en",
    content: (
      <>
        Press <bdi dir="ltr">Run</bdi> (أو <bdi dir="ltr">Ctrl + Enter</bdi>) to execute.
      </>
    ),
  },
  {
    id: "url-en",
    content: (
      <>
        See <bdi dir="ltr">https://ossu.github.io/computer-science</bdi> — the core curriculum.
      </>
    ),
  },
  {
    id: "email-en",
    content: (
      <>
        Questions? Email us at <bdi dir="ltr">support@etm.dev</bdi> أي وقت.
      </>
    ),
  },
  {
    id: "progress-en",
    content: <>Completed 47 of 128 lessons (37%) — great pace, keep going!</>,
  },
  {
    id: "code-en",
    content: (
      <code dir="ltr" className="block text-start">
        std::cout &lt;&lt; &quot;مرحبا بالعالم&quot; &lt;&lt; std::endl;
      </code>
    ),
  },
  {
    id: "quote-en",
    content: <>Consistency beats intensity — <bdi dir="rtl">الاستمرارية تتفوق على الحدة</bdi> — every day.</>,
  },
  {
    id: "percent-en",
    content: <>Weekly progress: +25% overall, −3% on side courses (الدورات الجانبية).</>,
  },
  {
    id: "signed-en",
    content: <>Balance: <bdi dir="ltr">+1,250 XP</bdi> with a best streak of <bdi dir="rtl">17 يوماً</bdi>.</>,
  },
  {
    id: "path-en",
    content: (
      <>
        The responsible file is <code dir="ltr">app/[locale]/page.tsx</code> — وليس غيره.
      </>
    ),
  },
  {
    id: "counts-en",
    content: <>4 stages · 19 courses · 128 lessons · 75 terms</>,
  },
  {
    id: "nesting-en",
    content: (
      <>
        Review <bdi dir="ltr">&quot;Pointers &amp; References&quot;</bdi> (<bdi dir="rtl">المؤشرات</bdi>) in the Foundations stage (<bdi dir="rtl">الأولية</bdi>).
      </>
    ),
  },
  {
    id: "glosses-en",
    content: (
      <>
        Term of the day: <bdi dir="ltr">segmentation fault</bdi> (<bdi dir="rtl">خطأ تجزئة</bdi>) — accessing unauthorized memory.
      </>
    ),
  },
  {
    id: "mixed-strong-en",
    content: (
      <>
        Current release <bdi dir="ltr">v2.4.1 (build 318)</bdi> — يدعم <bdi dir="ltr">C++20</bdi> بالكامل.
      </>
    ),
  },
];

function LineList({
  dir,
  lines,
}: {
  dir: "rtl" | "ltr";
  lines: typeof RTL_LINES;
}) {
  return (
    <div dir={dir} className="space-y-3">
      {lines.map((line) => (
        <div
          key={line.id}
          className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-base leading-8 text-slate-200"
        >
          <span className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-slate-600" dir="ltr">
            {line.id}
          </span>
          {line.content}
        </div>
      ))}
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = localeFromParams(params) as Locale;
  return {
    ...pageMetadata({
      locale,
      path: "/dev/bidi",
      title: COPY[locale].metaTitle,
      description: COPY[locale].metaDescription,
    }),
    robots: { index: false, follow: false },
  };
}

export default function BidiDevPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = localeFromParams(params);
  const c = COPY[locale];

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
          <FlaskConical className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {c.title}
          </h1>
          <p className="text-xs font-mono text-slate-500" dir="ltr">
            /dev/bidi
          </p>
        </div>
      </div>

      <p className="mt-4 text-slate-400 leading-7">{c.intro}</p>

      <h2 className="mt-10 text-lg font-black text-cyan-300" dir="rtl">
        {c.rtlSection}
      </h2>
      <div className="mt-3">
        <LineList dir="rtl" lines={RTL_LINES} />
      </div>

      <h2 className="mt-10 text-lg font-black text-cyan-300" dir="ltr">
        {c.ltrSection}
      </h2>
      <div className="mt-3">
        <LineList dir="ltr" lines={LTR_LINES} />
      </div>

      <div className="mt-10 rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] p-5">
        <h2 className="font-black text-amber-200">{c.noteTitle}</h2>
        <ul className="mt-2 list-disc space-y-1.5 ps-6 text-sm text-amber-100/80 leading-7">
          <li>{c.note1}</li>
          <li>{c.note2}</li>
          <li>{c.note3}</li>
        </ul>
      </div>
    </div>
  );
}
