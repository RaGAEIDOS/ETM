"use client";

import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";
import { useCopy, useLocale } from "@/lib/i18n/context";
import { localePath } from "@/lib/i18n/config";

const COPY = {
  ar: {
    title: "الصفحة غير موجودة",
    body: "يبدو أنك حاولت الوصول إلى صفحة غير موجودة. لا تقلق — المنهج كامل هنا في انتظارك.",
    home: "الرئيسية",
    curriculum: "المنهج الكامل",
  },
  en: {
    title: "Page not found",
    body: "It looks like you tried to visit a page that does not exist. Do not worry — the full curriculum is right here waiting for you.",
    home: "Home",
    curriculum: "Full curriculum",
  },
} as const;

export default function NotFoundContent() {
  const locale = useLocale();
  const c = useCopy(COPY);
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <div className="text-8xl font-black gradient-text" dir="ltr">
        404
      </div>
      <h1 className="mt-6 text-3xl font-black text-white">{c.title}</h1>
      <p className="mt-4 text-lg text-slate-400 leading-8">{c.body}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href={localePath(locale, "/")}
          className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-bold text-white hover:bg-white/10 transition-colors"
        >
          <Home className="h-5 w-5" />
          {c.home}
        </Link>
        <Link
          href={localePath(locale, "/curriculum")}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-cyan-400 to-violet-500 px-6 py-3 font-bold text-ink-950"
        >
          <ArrowLeft className="h-5 w-5 ltr:rotate-180" />
          {c.curriculum}
        </Link>
      </div>
    </div>
  );
}
