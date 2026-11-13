"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Radio,
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
import { trackEvent } from "@/lib/progress/store";
import { POMODORO_MESSAGES } from "@/lib/miku";
import { useLocale, useCopy } from "@/lib/i18n/context";
import { formatNumber } from "@/lib/i18n/config";
import type { Locale } from "@/lib/i18n/config";
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
    studyRadio: "راديو الدراسة",
    toggleRadio: "تبديل راديو الدراسة",
    volume: "مستوى الصوت",
    radioVolume: "مستوى صوت الراديو",
    radioNote: "بثوث حية من ",
    radioNoteEnd:
      " — راديو مجاني يدعمه المستمعون. اختر المحطة التي تضعك في منطقة التركيز.",
    lofiTitle: "لوفي هادئ للتركيز",
    lofiNote:
      "يوتيوب يفتح في نافذة جديدة — سبوتيفاي يعمل هنا مباشرة. لا تشغيل تلقائي أبدًا.",
    lofiYoutube: "Lofi Girl · YouTube",
    spotifyEmbedTitle: "قائمة Spotify — لوفي للتركيز",
    ambientTitle: "أصوات محيطة",
    ambientVolume: "مستوى صوت المحيط",
    ambientNote:
      "تُولَّد هذه الأصوات في متصفحك مباشرة — لا ملفات خارجية ولا تحميل.",
    pomodoroTimer: "مؤقّت Pomodoro",
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
    studyRadio: "Study Radio",
    toggleRadio: "Toggle study radio",
    volume: "Volume",
    radioVolume: "Radio volume",
    radioNote: "Live streams by ",
    radioNoteEnd:
      " - free, listener-supported radio. Pick the one that gets you in the zone.",
    lofiTitle: "Calm lofi for focus",
    lofiNote:
      "YouTube opens in a new tab — Spotify plays inline here. Nothing ever autoplays.",
    lofiYoutube: "Lofi Girl · YouTube",
    spotifyEmbedTitle: "Spotify playlist — focus lofi",
    ambientTitle: "Ambient sounds",
    ambientVolume: "Ambient volume",
    ambientNote:
      "These sounds are generated live in your browser - no external files, no downloads.",
    pomodoroTimer: "Pomodoro timer",
  },
} as const;

const STORAGE_KEY = "etm-pomodoro-v1";
const RADIO_KEY = "etm-radio-v1";
const AMBIENT_KEY = "etm-ambient-v1";
const FOCUS_PRESETS = [15, 25, 50];

interface RadioStation {
  id: string;
  name: string;
  desc: Record<Locale, string>;
  url: string;
}

// Free, listener-supported internet radio — SomaFM. Listen responsibly.
const RADIOS: RadioStation[] = [
  {
    id: "groove-salad",
    name: "Groove Salad",
    desc: {
      ar: "إيقاعات هادئة — إذاعة الدراسة الكلاسيكية",
      en: "Chill ambient beats — the classic study radio",
    },
    url: "https://stream.somafm.com/groovesalad-128-mp3",
  },
  {
    id: "beat-blender",
    name: "Beat Blender",
    desc: {
      ar: "موسيقى إلكترونية هادئة وبطيئة الإيقاع",
      en: "Downtempo and chill electronica",
    },
    url: "https://stream.somafm.com/beatblender-128-mp3",
  },
  {
    id: "deep-space-one",
    name: "Deep Space One",
    desc: {
      ar: "موسيقى ambient وفضاء عميق",
      en: "Deep ambient and space music",
    },
    url: "https://stream.somafm.com/deepspaceone-128-mp3",
  },
  {
    id: "space-station",
    name: "Space Station Soma",
    desc: {
      ar: "موسيقى فضائية بأسلوب ناسا",
      en: "Spaced-out ambient, NASA style",
    },
    url: "https://stream.somafm.com/spacestation-128-mp3",
  },
  {
    id: "drone-zone",
    name: "Drone Zone",
    desc: {
      ar: "موسيقى ambient ناعمة بطبقات ممتدة",
      en: "Mellow drone-based ambient",
    },
    url: "https://stream.somafm.com/dronezone-128-mp3",
  },
  {
    id: "mission-control",
    name: "Mission Control",
    desc: {
      ar: "أجواء مستوحاة من بعثات ناسا",
      en: "Ambience inspired by NASA missions",
    },
    url: "https://stream.somafm.com/missioncontrol-128-mp3",
  },
  {
    id: "cliqhop",
    name: "Cliqhop IDM",
    desc: {
      ar: "موسيقى رقص ذكية — تركيز إيقاعي",
      en: "Intelligent dance music — rhythmic focus",
    },
    url: "https://stream.somafm.com/cliqhop-128-mp3",
  },
  {
    id: "secret-agent",
    name: "Secret Agent",
    desc: {
      ar: "لاونج الجاسوس وأجواء السينما",
      en: "Spy lounge and exotica",
    },
    url: "https://stream.somafm.com/secretagent-128-mp3",
  },
];

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
  const [radioOn, setRadioOn] = useState(false);
  const [radioVol, setRadioVol] = useState(0.5);
  const [radioId, setRadioId] = useState(RADIOS[0].id);
  const [ambId, setAmbId] = useState<AmbientKind | null>(null);
  const [ambVol, setAmbVol] = useState(0.5);
  const [mounted, setMounted] = useState(false);

  const radioRef = useRef<HTMLAudioElement | null>(null);
  const ambRef = useRef<AmbientEngine | null>(null);
  const modeRef = useRef<Mode>("focus");
  const focusLenRef = useRef(25);
  const hiddenAtRef = useRef<number | null>(null);
  const overtimeSaidRef = useRef(false);
  const focusCountRef = useRef(0);
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
        };
        setMode(s.mode);
        modeRef.current = s.mode;
        setFocusLen(s.focusLen);
        focusLenRef.current = s.focusLen;
        setSecondsLeft(s.secondsLeft);
        setRunning(s.running);
        runningRef.current = s.running;
        setEndAt(s.endAt);
      }
      try {
        const saved = localStorage.getItem(RADIO_KEY);
        if (saved) {
          const s = JSON.parse(saved) as {
            on?: boolean;
            id?: string;
            vol?: number;
          };
          if (s.id && RADIOS.some((r) => r.id === s.id)) setRadioId(s.id);
          if (typeof s.vol === "number")
            setRadioVol(Math.min(1, Math.max(0, s.vol)));
          if (s.on) setRadioOn(true);
        }
      } catch {}
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
        JSON.stringify({ mode, focusLen, secondsLeft, running, endAt })
      );
    } catch {}
  }, [mounted, mode, focusLen, secondsLeft, running, endAt]);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(
        RADIO_KEY,
        JSON.stringify({ on: radioOn, id: radioId, vol: radioVol })
      );
    } catch {}
  }, [mounted, radioOn, radioId, radioVol]);

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
    },
    []
  );

  const handleFocusComplete = useCallback(() => {
    trackEvent("playground", "focus_session", {
      payload: { minutes: focusLenRef.current },
    });
    focusCountRef.current += 1;
    chime();
    say(messages.focusDone);
    const next: Mode = focusCountRef.current % 4 === 0 ? "long" : "short";
    switchMode(next, true);
  }, [say, switchMode]);

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
      } else if (m !== "focus" && left < 0) {
        if (!overtimeSaidRef.current && -left >= 60) {
          overtimeSaidRef.current = true;
          say(messages.longBreakOvertime);
        }
      }
    }, 250);
    return () => clearInterval(id);
  }, [running, endAt, handleFocusComplete, say]);

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

  // ---- radio engine ----
  useEffect(() => {
    if (!mounted) return;
    if (radioOn) {
      if (!radioRef.current) {
        const audio = new Audio();
        audio.preload = "none";
        audio.loop = true;
        radioRef.current = audio;
      }
      const station = RADIOS.find((r) => r.id === radioId) ?? RADIOS[0];
      if (radioRef.current.src !== station.url) {
        radioRef.current.src = station.url;
      }
      radioRef.current.volume = radioVol;
      radioRef.current.play().catch(() => {
        // Autoplay or network issue — user can tap the toggle again
      });
    } else {
      radioRef.current?.pause();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, radioOn, radioId]);

  useEffect(() => {
    if (radioRef.current) radioRef.current.volume = radioVol;
  }, [radioVol]);

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
      radioRef.current?.pause();
      radioRef.current = null;
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

  const progress = 1 - Math.max(0, secondsLeft) / duration;
  const isOvertime = secondsLeft < 0;
  const Icon = MODE_ICONS[mode];

  if (!mounted) return null;

  return (
    <div className="fixed bottom-4 end-4 z-40 flex flex-col items-end gap-2">
      {open && (
        <div className="w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-white/10 bg-ink-900/95 p-4 shadow-2xl backdrop-blur">
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

          {/* study radio */}
          <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Radio className="h-4 w-4 text-cyan-400" />
                {c.studyRadio}
              </div>
              <button
                onClick={() => setRadioOn((v) => !v)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                  radioOn ? "bg-cyan-500" : "bg-white/15"
                }`}
                aria-label={c.toggleRadio}
                aria-pressed={radioOn}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
                    radioOn ? "start-5" : "start-0.5"
                  }`}
                />
              </button>
            </div>
            {radioOn && (
              <div className="mt-3">
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pe-0.5">
                  {RADIOS.map((r) => {
                    const active = radioId === r.id;
                    return (
                      <button
                        key={r.id}
                        onClick={() => setRadioId(r.id)}
                        className={`rounded-lg border px-2.5 py-2 text-start transition-colors ${
                          active
                            ? "border-cyan-500/40 bg-cyan-500/10"
                            : "border-white/10 bg-white/5 hover:bg-white/10"
                        }`}
                        aria-pressed={active}
                      >
                        <span className="block text-[11px] font-bold leading-4 text-white">
                          {active && (
                            <span className="me-1 text-cyan-400">●</span>
                          )}
                          {r.name}
                        </span>
                        <span className="mt-1 block text-[10px] font-normal leading-3 text-slate-500">
                          {r.desc[locale]}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-xs text-slate-500">{c.volume}</span>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={radioVol}
                    onChange={(e) => setRadioVol(Number(e.target.value))}
                    className="flex-1 accent-cyan-400"
                    dir="ltr"
                    aria-label={c.radioVolume}
                  />
                </div>
                <p className="mt-2 text-[10px] leading-4 text-slate-600">
                  {c.radioNote}
                  <a
                    href="https://somafm.com"
                    target="_blank"
                    rel="noreferrer"
                    className="underline hover:text-slate-400"
                  >
                    SomaFM
                  </a>
                  {c.radioNoteEnd}
                </p>
                <div className="mt-3 rounded-lg border border-violet-500/20 bg-violet-500/[0.06] p-2.5">
                  <p className="text-[11px] font-bold text-violet-200">{c.lofiTitle}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <a
                      href="https://www.youtube.com/watch?v=jfKfPfyJRdk"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 text-[11px] font-bold text-slate-200 hover:bg-white/10"
                    >
                      <Radio className="h-3 w-3 text-rose-400" />
                      {c.lofiYoutube}
                    </a>
                  </div>
                  <iframe
                    src="https://open.spotify.com/embed/playlist/2lbGxqs4WSMxVmMuIsolNr?utm_source=generator&theme=0"
                    width="100%"
                    height="152"
                    className="mt-2 rounded-xl border-0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    title={c.spotifyEmbedTitle}
                  />
                  <p className="mt-2 text-[10px] leading-4 text-slate-500">{c.lofiNote}</p>
                </div>
              </div>
            )}
          </div>

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
      )}

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
  );
}
