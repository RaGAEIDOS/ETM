"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Music,
  X,
  Brain,
  Coffee,
  Moon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useMiku } from "./Miku";
import { addFocusSession } from "@/lib/stats";
import { POMODORO_MESSAGES } from "@/lib/miku";

type Mode = "focus" | "short" | "long";

const MODE_META: Record<
  Mode,
  { label: string; duration: number; icon: typeof Brain }
> = {
  focus: { label: "Focus", duration: 25 * 60, icon: Brain },
  short: { label: "Short Break", duration: 5 * 60, icon: Coffee },
  long: { label: "Long Break", duration: 15 * 60, icon: Moon },
};

const STORAGE_KEY = "etm-pomodoro-v1";
const LOFI_KEY = "etm-lofi";
const FOCUS_PRESETS = [15, 25, 50];

interface LofiEngine {
  start(): void;
  stop(): void;
  setVolume(v: number): void;
  dispose(): void;
}

function createLofiEngine(): LofiEngine {
  const Ctor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext;
  const ctx = new Ctor();
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  // --- Warm pad ---
  const padFilter = ctx.createBiquadFilter();
  padFilter.type = "lowpass";
  padFilter.frequency.value = 820;
  padFilter.Q.value = 0.6;
  const padGain = ctx.createGain();
  padGain.gain.value = 0.55;
  padGain.connect(padFilter);
  padFilter.connect(master);

  const chords = [
    [130.81, 164.81, 196.0, 246.94], // Cmaj7
    [110.0, 130.81, 164.81, 196.0], // Am7
    [87.31, 130.81, 174.61, 220.0], // Fmaj7
    [98.0, 146.83, 196.0, 246.94], // G
  ];
  let chordIdx = 0;
  const oscs: OscillatorNode[] = [];
  chords[0].forEach((f, i) => {
    const o = ctx.createOscillator();
    o.type = i % 2 === 0 ? "sine" : "triangle";
    o.frequency.value = f;
    const g = ctx.createGain();
    g.gain.value = 0.16;
    o.connect(g);
    g.connect(padGain);
    o.start();
    oscs.push(o);
  });

  const chordTimer = setInterval(() => {
    chordIdx = (chordIdx + 1) % chords.length;
    chords[chordIdx].forEach((f, i) => {
      try {
        oscs[i].frequency.setTargetAtTime(f, ctx.currentTime, 1.6);
      } catch {}
    });
  }, 9000);

  // --- Slow breathing LFO ---
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.07;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.16;
  lfo.connect(lfoGain);
  lfoGain.connect(padGain.gain);
  lfo.start();

  // --- Rain / brown noise ---
  const len = 2 * ctx.sampleRate;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i++) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    data[i] = last * 3.2;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buf;
  noise.loop = true;
  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = "lowpass";
  noiseFilter.frequency.value = 1300;
  const noiseGain = ctx.createGain();
  noiseGain.gain.value = 0.05;
  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(master);
  noise.start();

  return {
    start() {
      if (ctx.state === "suspended") ctx.resume().catch(() => {});
      master.gain.setTargetAtTime(0.42, ctx.currentTime, 1.2);
    },
    stop() {
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.5);
    },
    setVolume(v: number) {
      master.gain.setTargetAtTime(v * 0.5, ctx.currentTime, 0.3);
    },
    dispose() {
      clearInterval(chordTimer);
      ctx.close().catch(() => {});
    },
  };
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
  const [mode, setMode] = useState<Mode>("focus");
  const [focusLen, setFocusLen] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [endAt, setEndAt] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [lofiOn, setLofiOn] = useState(false);
  const [lofiVol, setLofiVol] = useState(0.5);
  const [mounted, setMounted] = useState(false);

  const engineRef = useRef<LofiEngine | null>(null);
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
      const lofi = localStorage.getItem(LOFI_KEY);
      if (lofi) setLofiOn(lofi === "on");
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

  const duration =
    mode === "focus" ? focusLen * 60 : MODE_META[mode].duration;

  const switchMode = useCallback(
    (m: Mode, autostart = false) => {
      const dur = m === "focus" ? focusLenRef.current * 60 : MODE_META[m].duration;
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
    addFocusSession(focusLenRef.current);
    focusCountRef.current += 1;
    chime();
    say(POMODORO_MESSAGES.focusDone);
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
          say(POMODORO_MESSAGES.longBreakOvertime);
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
          say(POMODORO_MESSAGES.welcomeBack);
        }
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [say]);

  // ---- lofi engine lifecycle ----
  useEffect(() => {
    if (!mounted) return;
    if (lofiOn) {
      if (!engineRef.current) {
        try {
          engineRef.current = createLofiEngine();
        } catch {
          return;
        }
      }
      engineRef.current.start();
      engineRef.current.setVolume(lofiVol);
    } else {
      engineRef.current?.stop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, lofiOn]);

  useEffect(() => {
    if (engineRef.current) engineRef.current.setVolume(lofiVol);
  }, [lofiVol]);

  useEffect(() => {
    return () => engineRef.current?.dispose();
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
          ? POMODORO_MESSAGES.focusStart
          : POMODORO_MESSAGES.breakStart
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
    say(POMODORO_MESSAGES.breakDone);
  }

  const progress = 1 - Math.max(0, secondsLeft) / duration;
  const isOvertime = secondsLeft < 0;
  const Icon = MODE_META[mode].icon;

  if (!mounted) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2">
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
                  Focus with Miku 🎵
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-2 text-slate-400 hover:text-white"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* mode tabs */}
          <div className="mt-3 grid grid-cols-3 gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1">
            {(Object.keys(MODE_META) as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`rounded-lg px-2 py-2 text-xs font-bold transition-colors ${
                  mode === m
                    ? "bg-gradient-to-l from-cyan-400 to-violet-500 text-ink-950"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {MODE_META[m].label}
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
                ? "Overtime — Miku is waiting!"
                : running
                ? mode === "focus"
                  ? "Focusing..."
                  : "Resting..."
                : "Paused"}
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
              aria-label="Reset"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              onClick={toggle}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-cyan-400 to-violet-500 px-6 py-3 font-bold text-ink-950"
            >
              {running ? (
                <>
                  <Pause className="h-4 w-4" /> Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" /> Start
                </>
              )}
            </button>
            <button
              onClick={skip}
              className="p-3 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
              aria-label="Skip"
            >
              <SkipForward className="h-4 w-4" />
            </button>
          </div>

          {isOvertime && (
            <button
              onClick={backToFocus}
              className="mt-3 w-full rounded-xl bg-amber-500/15 border border-amber-500/30 py-2.5 text-sm font-bold text-amber-300 hover:bg-amber-500/25"
            >
              Back to focus
            </button>
          )}

          {/* focus length presets */}
          <div className="mt-4">
            <div className="text-xs text-slate-500 mb-2">Focus length</div>
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
                  {p} min
                </button>
              ))}
            </div>
          </div>

          {/* lofi */}
          <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Music className="h-4 w-4 text-cyan-400" />
                Lofi study music
              </div>
              <button
                onClick={() => {
                  const next = !lofiOn;
                  setLofiOn(next);
                  try {
                    localStorage.setItem(LOFI_KEY, next ? "on" : "off");
                  } catch {}
                }}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  lofiOn ? "bg-cyan-500" : "bg-white/15"
                }`}
                aria-label="Toggle lofi music"
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
                    lofiOn ? "start-5" : "start-0.5"
                  }`}
                />
              </button>
            </div>
            {lofiOn && (
              <div className="mt-3 flex items-center gap-3">
                <span className="text-xs text-slate-500">Volume</span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={lofiVol}
                  onChange={(e) => setLofiVol(Number(e.target.value))}
                  className="flex-1 accent-cyan-400"
                  dir="ltr"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* collapsed button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-white/10 bg-ink-900/95 py-2 ps-2 pe-4 shadow-xl backdrop-blur hover:border-cyan-500/40 transition-colors"
        aria-label="Pomodoro timer"
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
