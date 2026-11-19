"use client";

/**
 * Search + category filter for the Islamic Studies hub. This reuses the
 * site's category vocabulary (RELIGIOUS_CATEGORIES) and filters the same
 * course cards the rest of the platform uses — no separate design system.
 */

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useCopy, useLocale } from "@/lib/i18n/context";
import { formatNumber } from "@/lib/i18n/config";
import {
  RELIGIOUS_CATEGORIES,
  type ReligiousCategoryId,
  type ReligiousCourse,
} from "@/lib/religious";
import ReligiousCourseCard from "./ReligiousCourseCard";

const COPY = {
  ar: {
    searchLabel: "ابحث في الدورات الدينية",
    searchPlaceholder: "ابحث باسم الدورة أو المحاضر…",
    categories: "التصنيفات",
    all: "الكل",
    results: (n: string) => `${n} دورة`,
    empty: "لا توجد دورة تطابق بحثك. جرّب كلمة أخرى أو اختر «الكل».",
    clear: "مسح البحث",
  },
  en: {
    searchLabel: "Search religious courses",
    searchPlaceholder: "Search by course or instructor…",
    categories: "Categories",
    all: "All",
    results: (n: string) => `${n} courses`,
    empty: "No course matches your search. Try another word or choose “All”.",
    clear: "Clear search",
  },
} as const;

export default function ReligiousCoursesExplorer({
  courses,
}: {
  courses: ReligiousCourse[];
}) {
  const c = useCopy(COPY);
  const locale = useLocale();
  const isAr = locale === "ar";
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ReligiousCategoryId | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses.filter((course) => {
      if (category && course.category !== category) return false;
      if (!q) return true;
      const haystack = [
        course.title,
        course.titleEn,
        course.instructor,
        course.instructorEn,
        course.description,
        course.descriptionEn,
        ...course.tags,
        ...course.tagsEn,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [courses, query, category]);

  return (
    <div>
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search
              className="pointer-events-none absolute inset-y-0 start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
              aria-hidden
            />
            <label htmlFor="religious-course-search" className="sr-only">
              {c.searchLabel}
            </label>
            <input
              id="religious-course-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={c.searchPlaceholder}
              className="w-full rounded-xl border border-white/10 bg-ink-950/60 py-2.5 pe-3 ps-10 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500">
              <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden />
              {c.categories}
            </span>
            <button
              type="button"
              onClick={() => setCategory(null)}
              aria-pressed={category === null}
              className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
                category === null
                  ? "border-cyan-400/40 bg-cyan-500/15 text-cyan-100"
                  : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
              }`}
            >
              {c.all}
            </button>
            {RELIGIOUS_CATEGORIES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setCategory(category === item.id ? null : item.id)}
                aria-pressed={category === item.id}
                className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
                  category === item.id
                    ? "border-amber-400/40 bg-amber-500/15 text-amber-100"
                    : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
                }`}
              >
                {isAr ? item.label : item.labelEn}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-3 text-[11px] text-slate-500" aria-live="polite">
          {c.results(formatNumber(filtered.length))}
        </p>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {filtered.map((course) => (
            <ReligiousCourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-8 text-center">
          <p className="text-sm text-slate-400">{c.empty}</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory(null);
            }}
            className="mt-3 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold text-white hover:bg-white/10"
          >
            {c.clear}
          </button>
        </div>
      )}
    </div>
  );
}
