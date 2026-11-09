import type { Metadata } from "next";
import { Suspense } from "react";
import { Code2, Zap, ShieldCheck, Globe } from "lucide-react";
import Playground from "@/components/Playground";

export const metadata: Metadata = {
  title: "ملعب C++",
  description:
    "جرّب كود C++ حقيقي مباشرة من المتصفح: اكتب، ترجم، وشغّل — من غير تثبيت أي برامج.",
};

export default function PlaygroundPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-sm font-bold text-cyan-400">ملعب C++</span>
        <h1 className="mt-3 text-4xl sm:text-5xl font-black text-white">
          اكتب. ترجم. <span className="gradient-text">شغّل.</span>
        </h1>
        <p className="mt-4 text-lg text-slate-400 leading-8">
          مترجم <bdi dir="ltr" className="font-mono text-cyan-300">C++</bdi>
          حقيقي في المتصفح — من غير تثبيت أي حاجة. جرّب كل أمثلة الدروس، أو
          اكتب كودك الخاص.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { icon: Zap, title: "فوري", desc: "الترجمة والتشغيل في ثوانٍ" },
          { icon: Globe, title: "من المتصفح", desc: "مفيش برامج مطلوبة" },
          { icon: ShieldCheck, title: "آمن", desc: "كل تشغة في بيئة معزولة" },
        ].map((f) => (
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
            جارٍ تحميل الملعب...
          </div>
        }
      >
        <Playground />
      </Suspense>
    </div>
  );
}
