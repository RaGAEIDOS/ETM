"use client";

import { useMemo, useState } from "react";
import { Search, BookMarked } from "lucide-react";
import { glossaryTerms, GLOSSARY_CATEGORIES } from "@/lib/glossary";

export default function GlossarySearch() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return glossaryTerms.filter((t) => {
      const matchesQuery =
        !q ||
        t.en.toLowerCase().includes(q) ||
        t.ar.includes(query.trim());
      const matchesCategory = !category || t.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [query, category]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث بمصطلح إنجليزي أو عربي... مثال: pointer، مؤشر"
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3.5 pr-12 pl-4 text-white placeholder:text-slate-500 outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
          />
        </div>
        <span className="text-sm text-slate-500 shrink-0">
          {filtered.length} مصطلح
        </span>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          onClick={() => setCategory(null)}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            category === null
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
              : "bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10"
          }`}
        >
          الكل
        </button>
        {GLOSSARY_CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(category === c ? null : c)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              category === c
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {filtered.map((t) => (
          <div
            key={t.en}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-5 hover:border-cyan-500/30 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="font-mono font-bold text-cyan-300" dir="ltr">
                  {t.en}
                </span>
                <span className="mr-2 text-lg font-bold text-white">{t.ar}</span>
              </div>
              <span className="shrink-0 rounded-full bg-white/5 px-2.5 py-1 text-xs text-slate-500">
                {t.category}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-400 leading-6">{t.description}</p>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] py-16 text-center">
          <BookMarked className="h-10 w-10 text-slate-600" />
          <p className="text-slate-400">
            مفيش نتائج مطابقة — جرّب كلمة تانية
          </p>
        </div>
      )}
    </div>
  );
}
