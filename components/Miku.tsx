"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  X,
  GraduationCap,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import MikuAvatar from "./MikuAvatar";
import { MIKU, ONBOARDING_STEPS, tipForPath } from "@/lib/miku";

interface MikuContextValue {
  say: (message: string) => void;
  message: string | null;
  open: boolean;
  setOpen: (v: boolean) => void;
}

const MikuContext = createContext<MikuContextValue | null>(null);

export function useMiku() {
  const ctx = useContext(MikuContext);
  if (!ctx) throw new Error("useMiku must be used within MikuProvider");
  return ctx;
}

const ONBOARDING_KEY = "etm-miku-onboarding-done";
const MESSAGE_DURATION = 7000;

export function MikuProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [message, setMessage] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      if (!localStorage.getItem(ONBOARDING_KEY)) setTourOpen(true);
    } catch {}
  }, []);

  const say = useCallback((msg: string) => setMessage(msg), []);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), MESSAGE_DURATION);
    return () => clearTimeout(t);
  }, [message]);

  const tip = tipForPath(pathname);

  function finishTour() {
    setTourOpen(false);
    try {
      localStorage.setItem(ONBOARDING_KEY, "1");
    } catch {}
  }

  return (
    <MikuContext.Provider value={{ say, message, open, setOpen }}>
      {children}

      {/* ===== Onboarding tour ===== */}
      {tourOpen && mounted && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-ink-900 p-6 shadow-2xl">
            <div className="flex items-center gap-3">
              <MikuAvatar size={56} />
              <div className="flex-1">
                <h2 className="text-lg font-black text-white" dir="rtl">
                  {ONBOARDING_STEPS[step].title}
                </h2>
                <p className="text-xs text-slate-300">
                  Miku · step {step + 1} of {ONBOARDING_STEPS.length}
                </p>
              </div>
            </div>
            <p className="mt-4 min-h-[84px] text-slate-300 leading-7" dir="rtl">
              {ONBOARDING_STEPS[step].body}
            </p>
            <div className="mt-5 flex items-center justify-between gap-3">
              <div className="flex gap-1.5">
                {ONBOARDING_STEPS.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${
                      i === step ? "w-5 bg-cyan-400" : "w-1.5 bg-white/15"
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                {step > 0 && (
                  <button
                    onClick={() => setStep((s) => s - 1)}
                    className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-bold text-white hover:bg-white/10"
                  >
                    <ChevronRight className="h-4 w-4" /> Back
                  </button>
                )}
                <button
                  onClick={finishTour}
                  className="rounded-lg px-3 py-2 text-sm text-slate-400 hover:text-white"
                >
                  Skip
                </button>
                {step < ONBOARDING_STEPS.length - 1 ? (
                  <button
                    onClick={() => setStep((s) => s + 1)}
                    className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-l from-cyan-400 to-violet-500 px-4 py-2 text-sm font-bold text-ink-950"
                  >
                    Next <ChevronLeft className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={finishTour}
                    className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-l from-cyan-400 to-violet-500 px-4 py-2 text-sm font-bold text-ink-950"
                  >
                    Let&apos;s go! 🚀
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== Floating widget ===== */}
      {!hidden && (
        <div className="fixed bottom-4 left-4 z-40 flex flex-col items-start gap-2">
          {message && !open && (
            <div className="max-w-[270px] rounded-2xl rounded-bl-sm border border-cyan-500/30 bg-ink-900/95 px-4 py-3 text-sm text-white shadow-xl shadow-cyan-500/10">
              <div className="flex items-start gap-2">
                <MikuAvatar size={22} className="mt-0.5 shrink-0" />
                <p className="leading-6" dir="rtl">{message}</p>
              </div>
            </div>
          )}

          {open && (
            <div className="w-72 sm:w-80 rounded-2xl border border-white/10 bg-ink-900/95 p-4 shadow-2xl backdrop-blur">
              <div className="flex items-center gap-3">
                <MikuAvatar size={44} />
                <div className="flex-1">
                  <div className="font-black text-white">{MIKU.fullName}</div>
                  <div className="text-xs text-slate-400">{MIKU.tagline}</div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 text-slate-400 hover:text-white"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <div className="text-xs font-bold text-cyan-400 mb-1" dir="auto">
                  {tip.title}
                </div>
                <p className="text-sm text-slate-300 leading-6" dir="auto">{tip.body}</p>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link
                  href="/guide"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 px-3 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20"
                >
                  <GraduationCap className="h-3.5 w-3.5" /> Tutorials
                </Link>
                <button
                  onClick={() => {
                    setTourOpen(true);
                    setStep(0);
                    setOpen(false);
                  }}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs font-bold text-white hover:bg-white/10"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Replay tour
                </button>
              </div>

              <button
                onClick={() => setHidden(true)}
                className="mt-3 w-full text-center text-xs text-slate-500 hover:text-slate-300"
              >
                Hide Miku for this session
              </button>
            </div>
          )}

          <button
            onClick={() => setOpen((o) => !o)}
            className="group relative flex h-14 w-14 items-center justify-center rounded-full border border-cyan-500/40 bg-ink-900 shadow-lg shadow-cyan-500/20 transition-transform hover:scale-105"
            aria-label="Miku assistant"
          >
            <MikuAvatar size={52} />
            <span className="absolute top-0 end-0 h-3.5 w-3.5 rounded-full border-2 border-ink-950 bg-emerald-400" />
          </button>
        </div>
      )}
    </MikuContext.Provider>
  );
}
