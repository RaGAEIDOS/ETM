"use client";

/**
 * Local-first CS50x Certificate checklist — 10 problem sets + final project.
 *
 * This tracks the learner's OWN claim progress toward the free CS50
 * Certificate (cs50.harvard.edu/certificates). Nothing is submitted by this
 * platform; checkmarks persist on this device only (etm-cs50x-certificate-v1).
 */

import { useEffect, useState } from "react";
import { useCopy } from "@/lib/i18n/context";
import { formatNumber } from "@/lib/i18n/config";
import {
  CS50X_PSETS,
  CS50X_EDX_URL,
  CS50X_GRADEBOOK_URL,
  CS50X_CERTIFICATE_URL,
  CS50X_CERTIFICATE_INFO_URL,
} from "@/lib/cs50x";
import { loadCs50xCertificate, toggleCs50xCertificateItem, type Cs50xPsetId } from "@/lib/cs50x-notes";
import { CheckCircle2, Circle, ExternalLink, GraduationCap, Info } from "lucide-react";

const COPY = {
  ar: {
    title: "رحلة الشهادة — CS50 Certificate (مجانية)",
    subtitle:
      "أشّر التكليفات التي أنهيتها بدرجة ≥ ٧٠٪ — تُحفظ العلامات على هذا الجهاز فقط ولا تُرسل إلى Harvard.",
    done: "أُنجز",
    progress: (done: string, total: string) => `${done} من ${total}`,
    ready: "أكملت كل شيء (١٠ تكاليف + المشروع النهائي)! الخطوة الأخيرة: قدّم طلب الشهادة.",
    claim: "قدّم طلب الشهادة على cs50.harvard.edu/certificates",
    verify: "تحقق من درجاتك في cs50.me/cs50x",
    edx: "منصة الدورة على edX",
    info: "شروط الشهادة الرسمية",
    note: "هذه قائمة متابعة شخصية — التقدير الفعلي يتم عبر edX و cs50.dev، والشهادة تصدرها Harvard.",
  },
  en: {
    title: "Certificate journey — free CS50 Certificate",
    subtitle:
      "Tick the assignments you finished with ≥ 70% — marks are saved on this device only and never sent to Harvard.",
    done: "Done",
    progress: (done: string, total: string) => `${done} of ${total}`,
    ready: "Everything is done (10 psets + final project)! Final step: claim the certificate.",
    claim: "Claim the certificate at cs50.harvard.edu/certificates",
    verify: "Check your scores at cs50.me/cs50x",
    edx: "Course on edX",
    info: "Official certificate requirements",
    note: "This is a personal tracker — grading happens via edX & cs50.dev; Harvard issues the certificate.",
  },
} as const;

export default function Cs50xCertificateCard() {
  const c = useCopy(COPY);
  const [done, setDone] = useState<Set<Cs50xPsetId>>(new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setDone(new Set(loadCs50xCertificate().done));
    setReady(true);
  }, []);

  const toggle = (id: Cs50xPsetId) => {
    const next = toggleCs50xCertificateItem(id);
    setDone(new Set(next.done));
  };

  const complete = done.size;
  const total = CS50X_PSETS.length;
  const pct = Math.round((complete / total) * 100);
  const allDone = complete === total;

  return (
    <div className="overflow-hidden rounded-2xl border border-rose-500/25 bg-gradient-to-br from-rose-500/[0.08] to-orange-500/[0.05]">
      <div className="border-b border-rose-500/15 p-6">
        <h3 className="flex items-center gap-3 text-xl font-black text-white">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-500/15 text-rose-300">
            <GraduationCap className="h-6 w-6" />
          </span>
          {c.title}
        </h3>
        <p className="mt-3 text-sm leading-7 text-slate-400">{c.subtitle}</p>
        <div className="mt-4 flex items-center gap-3">
          <div
            className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/10"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-gradient-to-l from-rose-400 to-orange-400 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="font-mono text-xs font-bold text-rose-300">
            {c.progress(formatNumber(complete), formatNumber(total))}
          </span>
        </div>
      </div>

      <ul className="grid gap-1.5 p-4 sm:grid-cols-2">
        {CS50X_PSETS.map((pset) => {
          const checked = ready && done.has(pset.id as Cs50xPsetId);
          return (
            <li
              key={pset.id}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition-colors ${
                checked ? "border-emerald-500/25 bg-emerald-500/[0.06]" : "border-white/5 bg-white/[0.02]"
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(pset.id as Cs50xPsetId)}
                aria-pressed={checked}
                className="flex min-h-[2.25rem] min-w-[2.25rem] shrink-0 items-center justify-center rounded-lg"
                aria-label={checked ? c.done : pset.title}
              >
                {checked ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                ) : (
                  <Circle className="h-5 w-5 text-slate-600" />
                )}
              </button>
              <a
                href={pset.url}
                target="_blank"
                rel="noreferrer"
                className={`min-w-0 flex-1 leading-6 hover:text-white ${
                  checked ? "text-emerald-200" : "text-slate-300"
                }`}
                dir="auto"
              >
                {pset.title}
              </a>
              <a
                href={pset.url}
                target="_blank"
                rel="noreferrer"
                aria-hidden="true"
                tabIndex={-1}
                className="shrink-0 text-slate-600 hover:text-slate-300"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </li>
          );
        })}
      </ul>

      <div className="border-t border-rose-500/15 p-5">
        {allDone && (
          <p className="mb-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-300">
            {c.ready}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={CS50X_CERTIFICATE_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-rose-400 to-orange-500 px-4 py-2.5 text-sm font-black text-ink-950 hover:opacity-90"
          >
            <GraduationCap className="h-4 w-4" />
            {c.claim}
          </a>
          <a
            href={CS50X_GRADEBOOK_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:text-white"
          >
            {c.verify}
            <ExternalLink className="h-4 w-4" />
          </a>
          <a
            href={CS50X_EDX_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:text-white"
          >
            {c.edx}
            <ExternalLink className="h-4 w-4" />
          </a>
          <a
            href={CS50X_CERTIFICATE_INFO_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-300"
          >
            <Info className="h-4 w-4" />
            {c.info}
          </a>
        </div>
        <p className="mt-3 text-xs leading-6 text-slate-500">{c.note}</p>
      </div>
    </div>
  );
}
