"use client";

import { useEffect, useRef, useState } from "react";
import { useCopy } from "@/lib/i18n/context";
import { formatNumber } from "@/lib/i18n/config";
import { useProgressStore } from "@/lib/progress/store";
import {
  Download,
  Upload,
  Trash2,
  Check,
  Hourglass,
  ShieldCheck,
} from "lucide-react";

const COPY = {
  ar: {
    goalTitle: "هدفك اليومي للتركيز",
    goalUnit: "دقيقة / يوم",
    save: "احفظ",
    saved: "تم الحفظ!",
    todayProgress: (a: number, b: number) => `اليوم: ${formatNumber(a)} من ${formatNumber(b)} دقيقة`,
    privacyTitle: "بياناتك",
    privacyBody:
      "كل تقدمك يُخزَّن على هذا الجهاز فقط. يمكنك تصديره أو حذفه في أي وقت.",
    exportBtn: "تصدير بياناتي",
    importBtn: "استيراد بيانات",
    deleteBtn: "حذف بياناتي",
    deleteConfirm:
      "سيتم حذف كل تقدمك نهائيًا من هذا الجهاز. لا يمكن التراجع عن هذا. هل أنت متأكد؟",
    importOk: "تم الاستيراد ودمج التقدم.",
    importFail: "الملف غير صالح — تأكد أنه ملف تصدير ETM.",
    deleted: "تم حذف بياناتك من هذا الجهاز.",
  },
  en: {
    goalTitle: "Your daily focus goal",
    goalUnit: "minutes / day",
    save: "Save",
    saved: "Saved!",
    todayProgress: (a: number, b: number) => `Today: ${formatNumber(a)} of ${formatNumber(b)} min`,
    privacyTitle: "Your data",
    privacyBody:
      "All your progress is stored on this device only. Export it or delete it anytime.",
    exportBtn: "Export my data",
    importBtn: "Import data",
    deleteBtn: "Delete my data",
    deleteConfirm:
      "This permanently deletes all progress on this device. This cannot be undone. Continue?",
    importOk: "Import complete — progress merged.",
    importFail: "That file doesn't look like an ETM export.",
    deleted: "Your data was deleted from this device.",
  },
} as const;

/** Daily focus goal editor + export/import/delete controls. */
export default function GoalAndData() {
  const c = useCopy(COPY);
  const { stats, file, todayKey, setDailyGoal, exportData, importData, deleteData } =
    useProgressStore();
  const goal = file.settings.dailyGoalMinutes;
  const focusToday = stats.minutesByDay[todayKey] ?? 0;
  const [value, setValue] = useState(String(goal));
  const [saved, setSaved] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(String(goal));
  }, [goal]);

  const save = () => {
    const n = Number(value);
    if (!Number.isFinite(n) || n < 1) return;
    setDailyGoal(Math.round(n));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1500);
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = importData(String(reader.result ?? ""));
      setMsg(result.ok ? c.importOk : c.importFail);
    };
    reader.readAsText(f);
  };

  const pct = goal > 0 ? Math.min(100, Math.round((focusToday / goal) * 100)) : 0;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl border border-white/10 bg-ink-900/60 p-6">
        <h2 className="flex items-center gap-2 font-black text-white">
          <Hourglass className="h-5 w-5 text-emerald-400" />
          {c.goalTitle}
        </h2>
        <div className="mt-4 flex items-center gap-3">
          <input
            type="number"
            min={1}
            max={600}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-24 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-lg font-bold text-white outline-none focus:border-emerald-500/50"
            aria-label={c.goalTitle}
          />
          <span className="text-sm text-slate-400">{c.goalUnit}</span>
          <button
            onClick={save}
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm font-bold text-emerald-300 hover:bg-emerald-500/20"
          >
            {saved ? <Check className="h-4 w-4" /> : null}
            {saved ? c.saved : c.save}
          </button>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          {c.todayProgress(focusToday, goal)}
        </p>
        <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-l from-emerald-400 to-teal-500 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-ink-900/60 p-6">
        <h2 className="flex items-center gap-2 font-black text-white">
          <ShieldCheck className="h-5 w-5 text-violet-400" />
          {c.privacyTitle}
        </h2>
        <p className="mt-3 text-sm text-slate-400 leading-7">{c.privacyBody}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            onClick={exportData}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold text-white hover:bg-white/10"
          >
            <Download className="h-4 w-4" />
            {c.exportBtn}
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold text-white hover:bg-white/10"
          >
            <Upload className="h-4 w-4" />
            {c.importBtn}
          </button>
          <button
            onClick={() => {
              if (window.confirm(c.deleteConfirm)) {
                deleteData();
                setMsg(c.deleted);
              }
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-bold text-rose-300 hover:bg-rose-500/20"
          >
            <Trash2 className="h-4 w-4" />
            {c.deleteBtn}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={onFile}
          />
        </div>
        {msg && <p className="mt-3 text-xs font-bold text-slate-300">{msg}</p>}
      </div>
    </div>
  );
}
