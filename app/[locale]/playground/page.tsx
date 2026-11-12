import type { Metadata } from "next";
import { Suspense } from "react";
import { Zap, ShieldCheck, Globe } from "lucide-react";
import Playground from "@/components/Playground";
import { localeFromParams, pageMetadata } from "@/lib/i18n/server";

const COPY = {
  ar: {
    metaTitle: "محرك C++ التفاعلي",
    metaDescription:
      "شغّل كود C++ حقيقي مباشرة في متصفحك: اكتب، ترجم، ونفّذ — بدون أي تركيب أو إعداد.",
    eyebrow: "محرك C++ التفاعلي",
    titleLead: "اكتب. ترجم.",
    titleHighlight: "شغّل.",
    instant: "فوري",
    instantDesc: "ترجمة وتشغيل خلال ثوانٍ",
    inBrowser: "داخل المتصفح",
    inBrowserDesc: "لا حاجة لأي برنامج",
    safe: "آمن",
    safeDesc: "كل تشغيل في بيئة معزولة",
    loading: "جارٍ تحميل المحرك...",
  },
  en: {
    metaTitle: "C++ Playground",
    metaDescription:
      "Run real C++ code directly in your browser: write, compile and execute — no installs required.",
    eyebrow: "C++ Playground",
    titleLead: "Write. Compile.",
    titleHighlight: "Run.",
    instant: "Instant",
    instantDesc: "Compile and run in seconds",
    inBrowser: "In-browser",
    inBrowserDesc: "No software required",
    safe: "Safe",
    safeDesc: "Every run in an isolated sandbox",
    loading: "Loading the playground...",
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
    path: "/playground",
    title: COPY[locale].metaTitle,
    description: COPY[locale].metaDescription,
  });
}

export default function PlaygroundPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = localeFromParams(params);
  const c = COPY[locale];
  const features = [
    { icon: Zap, title: c.instant, desc: c.instantDesc },
    { icon: Globe, title: c.inBrowser, desc: c.inBrowserDesc },
    { icon: ShieldCheck, title: c.safe, desc: c.safeDesc },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-sm font-bold text-cyan-400">{c.eyebrow}</span>
        <h1 className="mt-3 text-4xl sm:text-5xl font-black text-white">
          {c.titleLead} <span className="gradient-text">{c.titleHighlight}</span>
        </h1>
        <p className="mt-4 text-lg text-slate-400 leading-8">
          {locale === "ar" ? (
            <>
              مترجم <bdi dir="ltr" className="font-mono text-cyan-300">C++</bdi> حقيقي في متصفحك — بدون تركيب — جرّب كل مثال من الدرس، أو اكتب كودك الخاص.
            </>
          ) : (
            <>
              A real <bdi dir="ltr" className="font-mono text-cyan-300">C++</bdi> compiler in your browser — no installs, nothing to set up. Try every lesson example, or write your own code.
            </>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {features.map((f) => (
          <div
            key={f.title}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
              <f.icon className="h-5 w-5" />
            </span>
            <div>
              <div className="font-bold text-white text-sm">{f.title}</div>
              <div className="text-xs text-slate-500">{f.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <Suspense
        fallback={
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-10 text-center text-slate-400">
            {c.loading}
          </div>
        }
      >
        <Playground />
      </Suspense>
    </div>
  );
}
