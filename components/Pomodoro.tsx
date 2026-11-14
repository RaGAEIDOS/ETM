"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  X,
  Brain,
  Coffee,
  Moon,
  ChevronDown,
  ChevronUp,
  AudioLines,
  CloudRain,
  MoonStar,
  Waves,
  Rocket,
  Flame,
} from "lucide-react";
import { useMiku } from "./Miku";
import PomodoroMusic from "./PomodoroMusic";
import { trackEvent } from "@/lib/progress/store";
import { POMODORO_MESSAGES } from "@/lib/miku";
import { useLocale, useCopy } from "@/lib/i18n/context";
import { formatNumber } from "@/lib/i18n/config";
import {
  AMBIENTS,
  AmbientEngine,
  isAmbientKind,
  type AmbientKind,
} from "@/lib/ambient-sounds";

type Mode = "focus" | "short" | "long";

const MODE_DURATIONS: Record<Mode, number> = {
  focus: 25 * 60,
  short: 5 * 60,
  long: 15 * 60,
};

const MODE_ICONS: Record<Mode, typeof Brain> = {
  focus: Brain,
  short: Coffee,
  long: Moon,
};

const AMBIENT_ICONS: Record<AmbientKind, typeof Brain> = {
  rain: CloudRain,
  night: MoonStar,
  ocean: Waves,
  space: Rocket,
  fire: Flame,
};

const COPY = {
  ar: {
    modes: { focus: "تركيز", short: "استراحة قصيرة", long: "استراحة طويلة" },
    tagline: "ركّز مع Miku 🎵",
    close: "إغلاق",
    overtime: "تجاوزت الوقت — Miku تنتظرك!",
    focusing: "تركيز...",
    resting: "استراحة...",
    paused: "متوقف مؤقتاً",
    reset: "إعادة الضبط",
    skip: "تخطي",
    pause: "إيقاف مؤقت",
    start: "ابدأ",
    backToFocus: "العودة إلى التركيز",
    focusLength: "مدة التركيز",
    minutes: (n: number) => `${formatNumber(n)} دقيقة`,
    volume: "مستوى الصوت",
    ambientTitle: "أصوات محيطة",
    ambientVolume: "مستوى صوت المحيط",
    ambientNote:
      "تُولَّد هذه الأصوات في متصفحك مباشرة — لا ملفات خارجية ولا تحميل.",
    pomodoroTimer: "مؤقّت Pomodoro",
    sessionsToday: (n: number) => `${formatNumber(n)} جلسات مكتملة اليوم`,
    sessionsHint: "كل 4 جلسات تفتح استراحة طويلة",
    notifyFocusTitle: "انتهت جلسة التركيز",
    notifyFocusBody: "خذ استراحة قصيرة — أنت تستحقها.",
    notifyBreakTitle: "انتهت الاستراحة",
    notifyBreakBody: "جاهز للتركيز من جديد؟",
  },
  en: {
    modes: { focus: "Focus", short: "Short Break", long: "Long Break" },
    tagline: "Focus with Miku 🎵",
    close: "Close",
    overtime: "Overtime — Miku is waiting!",
    focusing: "Focusing...",
    resting: "Resting...",
    paused: "Paused",
    reset: "Reset",
    skip: "Skip",
    pause: "Pause",
    start: "Start",
    backToFocus: "Back to focus",
    focusLength: "Focus length",
    minutes: (n: number) => `${n} min`,
    volume: "Volume",
    ambientTitle: "Ambient sounds",
    ambientVolume: "Ambient volume",
    ambientNote:
      "These sounds are generated live in your browser - no external files, no downloads.",
    pomodoroTimer: "Pomodoro timer",
    sessionsToday: (n: number) => `${formatNumber(n)} sessions completed today`,
    sessionsHint: "Every 4 sessions unlocks a long break",
    notifyFocusTitle: "Focus session complete",
    notifyFocusBody: "Take a short break — you earned it.",
    notifyBreakTitle: "Break over",
    notifyBreakBody: "Ready to focus again?",
  },
} as const;

const STORAGE_KEY = "etm-pomodoro-v1";
const AMBIENT_KEY = "etm-ambient-v1";
const NOTIF_ASKED_KEY = "etm-notif-asked-v1";
const FOCUS_PRESETS = [15, 25, 50];

function localDayKey(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
}

/** Ask for notification permission once, on the first Start gesture. */
function askNotificationsOnce() {
  try {
    if (typeof Notification === "undefined") return;
    if (Notification.permission !== "default") return;
    if (window.localStorage.getItem(NOTIF_ASKED_KEY)) return;
    window.localStorage.setItem(NOTIF_ASKED_KEY, "1");
    void Notification.requestPermission();
  } catch {
    /* notifications blocked or unsupported */
  }
}

function notifyPhaseChange(title: string, body: string) {
  try {
    if (typeof Notification === "undefined") return;
    if (Notification.permission !== "granted") return;
    const notification = new Notification(title, {
      body,
      tag: "etm-pomodoro",
    });
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  } catch {
    /* notifications blocked or unsupported */
  }
}

function chime() {
  try {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new Ctor();
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = freq;
      const g = ctx.createGain();
      const t = now + i * 0.16;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.22, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, t + 1.1);
      o.connect(g);
      g.connect(ctx.destination);
      o.start(t);
      o.stop(t + 1.2);
    });
    setTimeout(() => ctx.close().catch(() => {}), 2000);
  } catch {}
}

function fmt(s: number): string {
  const sign = s < 0 ? "+" : "";
  const abs = Math.abs(s);
  const m = Math.floor(abs / 60);
  const sec = abs % 60;
  return `${sign}${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export default function Pomodoro() {
  const { say } = useMiku();
  const locale = useLocale();
  const c = useCopy(COPY);
  const messages = POMODORO_MESSAGES[locale];
  const [mode, setMode] = useState<Mode>("focus");
  const [focusLen, setFocusLen] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [endAt, setEndAt] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [ambId, setAmbId] = useState<AmbientKind | null>(null);
  const [ambVol, setAmbVol] = useState(0.5);
  const [mounted, setMounted] = useState(false);
  const [focusCount, setFocusCount] = useState(0);
  const [focusDate, setFocusDate] = useState(() => localDayKey());
  const [cozyTip, setCozyTip] = useState(false);

  const ambRef = useRef<AmbientEngine | null>(null);
  const modeRef = useRef<Mode>("focus");
  const focusLenRef = useRef(25);
  const hiddenAtRef = useRef<number | null>(null);
  const overtimeSaidRef = useRef(false);
  const focusCountRef = useRef(0);
  const focusDateRef = useRef(localDayKey());
  const breakNotifiedRef = useRef(false);
  const runningRef = useRef(false);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);
  useEffect(() => {
    focusLenRef.current = focusLen;
  }, [focusLen]);
  useEffect(() => {
    runningRef.current = running;
  }, [running]);

  // ---- restore ----
  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw) as {
          mode: Mode;
          focusLen: number;
          secondsLeft: number;
          running: boolean;
          endAt: number | null;
          focusCount?: number;
          focusDate?: string;
        };
        setMode(s.mode);
        modeRef.current = s.mode;
        setFocusLen(s.focusLen);
        focusLenRef.current = s.focusLen;
        setSecondsLeft(s.secondsLeft);
        setRunning(s.running);
        runningRef.current = s.running;
        setEndAt(s.endAt);
        const today = localDayKey();
        const restoredCount =
          s.focusDate === today && typeof s.focusCount === "number"
            ? Math.max(0, s.focusCount)
            : 0;
        setFocusCount(restoredCount);
        focusCountRef.current = restoredCount;
        setFocusDate(today);
        focusDateRef.current = today;
      }
      try {
        const savedAmb = localStorage.getItem(AMBIENT_KEY);
        if (savedAmb) {
          const s = JSON.parse(savedAmb) as { id?: unknown; vol?: number };
          if (isAmbientKind(s.id)) setAmbId(s.id);
          if (typeof s.vol === "number")
            setAmbVol(Math.min(1, Math.max(0, s.vol)));
        }
      } catch {}
    } catch {}
  }, []);

  // ---- persist ----
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          mode,
          focusLen,
          secondsLeft,
          running,
          endAt,
          focusCount,
          focusDate,
        })
      );
    } catch {}
  }, [mounted, mode, focusLen, secondsLeft, running, endAt, focusCount, focusDate]);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(
        AMBIENT_KEY,
        JSON.stringify({ id: ambId, vol: ambVol })
      );
    } catch {}
  }, [mounted, ambId, ambVol]);

  const duration =
    mode === "focus" ? focusLen * 60 : MODE_DURATIONS[mode];

  const switchMode = useCallback(
    (m: Mode, autostart = false) => {
      const dur = m === "focus" ? focusLenRef.current * 60 : MODE_DURATIONS[m];
      setMode(m);
      modeRef.current = m;
      setSecondsLeft(dur);
      setRunning(autostart);
      runningRef.current = autostart;
      setEndAt(autostart ? Date.now() + dur * 1000 : null);
      overtimeSaidRef.current = false;
      breakNotifiedRef.current = false;
    },
    []
  );

  const handleFocusComplete = useCallback(() => {
    trackEvent("playground", "focus_session", {
      payload: { minutes: focusLenRef.current },
    });
    const today = localDayKey();
    const base =
      focusDateRef.current === today ? focusCountRef.current : 0;
    const nextCount = base + 1;
    focusCountRef.current = nextCount;
    focusDateRef.current = today;
    setFocusCount(nextCount);
    setFocusDate(today);
    chime();
    say(messages.focusDone);
    notifyPhaseChange(c.notifyFocusTitle, c.notifyFocusBody);
    const next: Mode = nextCount % 4 === 0 ? "long" : "short";
    switchMode(next, true);
  }, [say, switchMode, messages.focusDone, c.notifyFocusTitle, c.notifyFocusBody]);

  // ---- tick ----
  useEffect(() => {
    if (!running || !endAt) return;
    const id = setInterval(() => {
      const left = Math.round((endAt - Date.now()) / 1000);
      setSecondsLeft(left);
      const m = modeRef.current;
      if (m === "focus" && left <= 0) {
        setRunning(false);
        runningRef.current = false;
        setEndAt(null);
        handleFocusComplete();
      } else if (m !== "focus") {
        if (left <= 0 && !breakNotifiedRef.current) {
          breakNotifiedRef.current = true;
          notifyPhaseChange(c.notifyBreakTitle, c.notifyBreakBody);
        }
        if (!overtimeSaidRef.current && -left >= 60) {
          overtimeSaidRef.current = true;
          say(messages.longBreakOvertime);
        }
      }
    }, 250);
    return () => clearInterval(id);
  }, [
    running,
    endAt,
    handleFocusComplete,
    say,
    messages.longBreakOvertime,
    c.notifyBreakTitle,
    c.notifyBreakBody,
  ]);

  // ---- tab visibility (Miku notices when you leave) ----
  useEffect(() => {
    const onVis = () => {
      if (document.hidden) {
        hiddenAtRef.current = Date.now();
      } else {
        const away = hiddenAtRef.current
          ? Date.now() - hiddenAtRef.current
          : 0;
        hiddenAtRef.current = null;
        if (
          runningRef.current &&
          modeRef.current === "focus" &&
          away > 8000
        ) {
          say(messages.welcomeBack);
        }
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [say]);

  // ---- ambient sound engine ----
  useEffect(() => {
    if (!mounted) return;
    if (ambId) {
      if (!ambRef.current) ambRef.current = new AmbientEngine();
      ambRef.current.start(ambId);
    } else {
      ambRef.current?.stop();
    }
  }, [mounted, ambId]);

  useEffect(() => {
    ambRef.current?.setVolume(ambVol);
  }, [ambVol]);

  useEffect(() => {
    return () => {
      ambRef.current?.dispose();
      ambRef.current = null;
    };
  }, []);

  function toggle() {
    if (running) {
      setRunning(false);
      runningRef.current = false;
      setEndAt(null);
    } else {
      askNotificationsOnce();
      setEndAt(Date.now() + secondsLeft * 1000);
      setRunning(true);
      runningRef.current = true;
      say(
        mode === "focus"
          ? messages.focusStart
          : messages.breakStart
      );
    }
  }

  function reset() {
    setRunning(false);
    runningRef.current = false;
    setEndAt(null);
    setSecondsLeft(duration);
    overtimeSaidRef.current = false;
    breakNotifiedRef.current = false;
  }

  function skip() {
    if (mode === "focus") {
      switchMode("short");
    } else {
      switchMode("focus");
    }
  }

  function backToFocus() {
    switchMode("focus");
    say(messages.breakDone);
  }

  const handleCozyTip = useCallback(() => setCozyTip(true), []);

  useEffect(() => {
    if (!cozyTip) return;
    const id = window.setTimeout(() => setCozyTip(false), 10000);
    return () => window.clearTimeout(id);
  }, [cozyTip]);

  const cycleDots =
    focusCount > 0 && focusCount % 4 === 0 ? 4 : focusCount % 4;

  const progress = 1 - Math.max(0, secondsLeft) / duration;
  const isOvertime = secondsLeft < 0;
  const Icon = MODE_ICONS[mode];

  if (!mounted) return null;

  return (
    <>
      {cozyTip && (
        <div
          role="status"
          className="fixed bottom-24 end-4 z-50 flex w-72 max-w-[calc(100vw-2rem)] items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/15 px-3 py-2 text-[11px] font-bold leading-5 text-amber-100 shadow-xl backdrop-blur"
        >
          <span className="flex-1">Cozy mode + lofi = perfect combo 🎧</span>
          <button
            type="button"
            onClick={() => setCozyTip(false)}
            className="shrink-0 text-amber-200/70 hover:text-amber-100"
            aria-label={c.close}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="fixed bottom-4 end-4 z-40 flex flex-col items-end gap-2">
        <div
          className={`w-80 max-w-[calc(100vw-2rem)] max-h-[calc(100dvh-10rem)] overflow-y-auto overscroll-contain rounded-2xl border border-white/10 bg-ink-900/95 p-4 shadow-2xl backdrop-blur ${
            open ? "" : "hidden"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500 text-ink-950">
                <Timer className="h-4 w-4" />
              </span>
              <div>
                <div className="font-black text-white text-sm">Pomodoro</div>
                <div className="text-[11px] text-slate-500">
                  {c.tagline}
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-2 text-slate-400 hover:text-white"
              aria-label={c.close}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* mode tabs */}
          <div className="mt-3 grid grid-cols-3 gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1">
            {(Object.keys(MODE_DURATIONS) as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`rounded-lg px-2 py-2 text-xs font-bold transition-colors ${
                  mode === m
                    ? "bg-gradient-to-l from-cyan-400 to-violet-500 text-ink-950"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {c.modes[m]}
              </button>
            ))}
          </div>

          {/* time */}
          <div className="mt-4 text-center">
            <div
              className={`font-mono text-5xl font-black tracking-tight ${
                isOvertime
                  ? "text-amber-400"
                  : running
                  ? "text-white"
                  : "text-slate-300"
              }`}
              dir="ltr"
            >
              {fmt(secondsLeft)}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              {isOvertime
                ? c.overtime
                : running
                ? mode === "focus"
                  ? c.focusing
                  : c.resting
                : c.paused}
            </div>
            {/* progress bar */}
            <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className={`h-full transition-all ${
                  isOvertime
                    ? "bg-amber-400"
                    : "bg-gradient-to-l from-cyan-400 to-violet-500"
                }`}
                style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
              />
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11px] text-slate-500">
              <span className="inline-flex items-center gap-1">
                <Flame
                  className={`h-3.5 w-3.5 ${
                    focusCount > 0 ? "text-amber-400" : "text-slate-600"
                  }`}
                />
                {c.sessionsToday(focusCount)}
              </span>
              <span className="inline-flex items-center gap-1" aria-hidden>
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={`h-1.5 w-3 rounded-full ${
                      i < cycleDots ? "bg-cyan-400" : "bg-white/15"
                    }`}
                  />
                ))}
              </span>
              <span className="w-full text-center text-[10px] text-slate-600">
                {c.sessionsHint}
              </span>
            </div>
          </div>

          {/* controls */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              onClick={reset}
              className="p-3 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
              aria-label={c.reset}
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              onClick={toggle}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-cyan-400 to-violet-500 px-6 py-3 font-bold text-ink-950"
            >
              {running ? (
                <>
                  <Pause className="h-4 w-4" /> {c.pause}
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" /> {c.start}
                </>
              )}
            </button>
            <button
              onClick={skip}
              className="p-3 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
              aria-label={c.skip}
            >
              <SkipForward className="h-4 w-4" />
            </button>
          </div>

          {isOvertime && (
            <button
              onClick={backToFocus}
              className="mt-3 w-full rounded-xl bg-amber-500/15 border border-amber-500/30 py-2.5 text-sm font-bold text-amber-300 hover:bg-amber-500/25"
            >
              {c.backToFocus}
            </button>
          )}

          {/* focus length presets */}
          <div className="mt-4">
            <div className="text-xs text-slate-500 mb-2">{c.focusLength}</div>
            <div className="grid grid-cols-3 gap-2">
              {FOCUS_PRESETS.map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setFocusLen(p);
                    if (mode === "focus" && !running) setSecondsLeft(p * 60);
                  }}
                  className={`rounded-lg border py-2 text-xs font-bold transition-colors ${
                    focusLen === p
                      ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-300"
                      : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  {c.minutes(p)}
                </button>
              ))}
            </div>
          </div>

          {/* music layer: Lofi Girl / Spotify / Off */}
          <PomodoroMusic
            mode={mode}
            running={running}
            secondsLeft={secondsLeft}
            onCozyTip={handleCozyTip}
          />

          {/* ambient sounds */}
          <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <AudioLines className="h-4 w-4 text-cyan-400" />
              {c.ambientTitle}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {AMBIENTS.map((s) => {
                const AmbIcon = AMBIENT_ICONS[s.id];
                const active = ambId === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setAmbId((cur) => (cur === s.id ? null : s.id))}
                    className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 text-start transition-colors ${
                      active
                        ? "border-cyan-500/40 bg-cyan-500/10"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                    aria-pressed={active}
                    aria-label={s.name[locale]}
                  >
                    <AmbIcon
                      className={`h-4 w-4 shrink-0 ${
                        active ? "text-cyan-300" : "text-slate-400"
                      }`}
                    />
                    <span className="text-[11px] font-bold leading-4 text-white">
                      {s.name[locale]}
                    </span>
                  </button>
                );
              })}
            </div>
            {ambId && (
              <div className="mt-3 flex items-center gap-3">
                <span className="text-xs text-slate-500">{c.volume}</span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={ambVol}
                  onChange={(e) => setAmbVol(Number(e.target.value))}
                  className="flex-1 accent-cyan-400"
                  dir="ltr"
                  aria-label={c.ambientVolume}
                />
              </div>
            )}
            <p className="mt-2 text-[10px] leading-4 text-slate-600">{c.ambientNote}</p>
          </div>
        </div>

      {/* collapsed button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-white/10 bg-ink-900/95 py-2 ps-2 pe-4 shadow-xl backdrop-blur hover:border-cyan-500/40 transition-colors"
        aria-label={`${fmt(secondsLeft)} · ${c.pomodoroTimer}`}
      >
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-full ${
            running
              ? "bg-gradient-to-br from-cyan-400 to-violet-500 text-ink-950"
              : "bg-white/5 text-slate-300"
          }`}
        >
          <Icon className="h-4 w-4" />
        </span>
        <span
          className={`font-mono text-sm font-bold ${
            isOvertime ? "text-amber-400" : "text-white"
          }`}
          dir="ltr"
        >
          {fmt(secondsLeft)}
        </span>
        <span className="text-slate-500">
          {open ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronUp className="h-4 w-4" />
          )}
        </span>
      </button>
      </div>
    </>
  );
}
