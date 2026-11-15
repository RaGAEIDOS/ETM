import type { Metadata } from "next";
import Link from "@/lib/i18n/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import { MASCOT_ASSETS } from "@/lib/mascot-assets";
import { localeFromParams, pageMetadata } from "@/lib/i18n/server";
import { type Locale } from "@/lib/i18n/config";

const COPY: Record<
  Locale,
  {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    title: string;
    lead: string;
    ar: { title: string; body: string };
    en: { title: string; body: string };
    principles: { title: string; body: string }[];
    cta: string;
  }
> = {
  ar: {
    metaTitle: "مريم — رفيقة رحلتك",
    metaDescription:
      "تعرّف على مريم، رفيقة التعلم في ETM: مهندسة ذكاء اصطناعي تشرح بلغتك، وتقدّم تلميحات سقراطية دون أن تحرق لك الإجابة.",
    eyebrow: "رفيقة رحلتك",
    title: "مريم — رفيقة رحلتك",
    lead: "مريم ليست آلة إجابات. هي رفيقة تعلّم تدفعك خطوة إلى الأمام في كل مرة.",
    ar: {
      title: "مين مريم؟",
      body: "مريم رفيقة تعلّمك في ETM — مهندسة ذكاء اصطناعي تشرح بلغتك، وتقدّم تلميحات سقراطية تُقرّبك من الحل بدل أن تحرقه عليك. لن تكشف لك الإجابة النهائية مباشرة؛ ستسألك وتوجّهك حتى تصل إليها بنفسك.",
    },
    en: {
      title: "Who is Maryam?",
      body: "Maryam is your learning companion at ETM — an AI engineering companion who speaks your language and gives Socratic hints that move you closer to the answer instead of spoiling it. She never hands you the final answer; she asks questions and guides you until you get there yourself.",
    },
    principles: [
      {
        title: "تلميحات سقراطية",
        body: "أسئلة صغيرة تقودك إلى الفكرة بدل أن تسلّمك الحل جاهزاً.",
      },
      {
        title: "من غير حرق إجابات",
        body: "الحل النهائي لك أنت — مريم تساعدك على اكتشافه خطوة بخطوة.",
      },
      {
        title: "بلسانك",
        body: "عربي أو إنجليزي، البطولة واحدة: أن تفهم وتطبّق بنفسك.",
      },
    ],
    cta: "ابدأ التعلم مع مريم",
  },
  en: {
    metaTitle: "Meet Maryam — your learning companion",
    metaDescription:
      "Meet Maryam, your ETM learning companion: an AI engineering companion who speaks your language and gives Socratic hints that never spoil the answer.",
    eyebrow: "Your companion",
    title: "Meet Maryam — your learning companion",
    lead: "Maryam is not an answer machine. She is a learning companion who moves you one step forward at a time.",
    ar: {
      title: "من مريم؟",
      body: "مريم رفيقة تعلّمك في ETM — مهندسة ذكاء اصطناعي تشرح بلغتك، وتقدّم تلميحات سقراطية تُقرّبك من الحل بدل أن تحرقه عليك. لن تكشف لك الإجابة النهائية مباشرة؛ ستسألك وتوجّهك حتى تصل إليها بنفسك.",
    },
    en: {
      title: "Who is Maryam?",
      body: "Maryam is your learning companion at ETM — an AI engineering companion who speaks your language and gives Socratic hints that move you closer to the answer instead of spoiling it. She never hands you the final answer; she asks questions and guides you until you get there yourself.",
    },
    principles: [
      {
        title: "Socratic hints",
        body: "Small questions that lead you to the idea instead of handing you the solution.",
      },
      {
        title: "No spoilers",
        body: "The final answer is yours to discover — Maryam helps you get there step by step.",
      },
      {
        title: "Your language",
        body: "Arabic or English, the goal is the same: understand it and build it yourself.",
      },
    ],
    cta: "Start learning with Maryam",
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
    path: "/about",
    title: COPY[locale].metaTitle,
    description: COPY[locale].metaDescription,
  });
}

function MaryamCutout({ className = "" }: { className?: string }) {
  const asset = MASCOT_ASSETS.cutout;
  const sourceSet = asset.srcSet ?? asset.webp;
  const fallback = asset.png ?? asset.webp ?? asset.placeholder;

  return (
    <picture className={className}>
      {sourceSet ? (
        <source type="image/webp" srcSet={sourceSet} sizes="(min-width: 768px) 420px, 70vw" />
      ) : null}
      <img
        src={fallback}
        alt="مريم — رفيقة رحلتك"
        loading="eager"
        decoding="async"
        className="h-full w-full object-contain object-bottom drop-shadow-[0_28px_48px_rgb(var(--color-accent)/0.3)]"
      />
    </picture>
  );
}

export default function AboutPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = localeFromParams(params);
  const c = COPY[locale];
  const isAr = locale === "ar";

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-20">
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-14">
        <div>
          <span className="text-sm font-bold text-cyan-400">{c.eyebrow}</span>
          <h1 className="mt-3 text-4xl font-black leading-tight text-white sm:text-5xl">
            {c.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-400">{c.lead}</p>

          <div className="mt-8 max-w-2xl space-y-5">
            <div
              dir="rtl"
              lang="ar"
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <h2 className="text-lg font-black text-white">{c.ar.title}</h2>
              <p className="mt-2 leading-8 text-slate-300">{c.ar.body}</p>
            </div>
            <div
              dir="ltr"
              lang="en"
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <h2 className="text-lg font-black text-white">{c.en.title}</h2>
              <p className="mt-2 leading-8 text-slate-300">{c.en.body}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {c.principles.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-white/10 bg-white/[0.02] p-4"
              >
                <div className="text-sm font-bold text-cyan-300">{item.title}</div>
                <p className="mt-1 text-sm leading-6 text-slate-400">{item.body}</p>
              </div>
            ))}
          </div>

          <Link
            href="/curriculum"
            className="group mt-9 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3.5 font-bold text-ink-950 shadow-lg shadow-cyan-500/20 transition-colors hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950"
          >
            {c.cta}
            <ArrowLeft
              className={`h-5 w-5 transition-transform ${
                isAr
                  ? "group-hover:-translate-x-1"
                  : "rotate-180 group-hover:translate-x-1"
              }`}
            />
          </Link>
        </div>

        <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
          <div className="hero-banner-glow pointer-events-none absolute inset-0 rounded-full" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-4">
            <div className="aspect-[4/5] w-full">
              <MaryamCutout className="block h-full w-full" />
            </div>
            <div className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.06] px-3 py-2 text-sm font-bold text-cyan-300">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {isAr ? "مريم — رفيقة رحلتك" : "Maryam — your learning companion"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
