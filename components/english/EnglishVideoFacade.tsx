"use client";

/**
 * Click-to-load YouTube facade for the English track.
 *
 * - Nothing is requested from YouTube until the learner clicks the poster.
 * - Playback uses the official IFrame Player API on youtube-nocookie.com
 *   (lazy-loaded after the click). If the API cannot load (offline / blocked),
 *   we degrade to a plain nocookie embed without resume or speed controls.
 * - Resume position is derived from the learner's own video_progress events
 *   (upserted every ~5s) — no separate localStorage key.
 * - No autoplay before the click; after the click the embed starts because
 *   the click itself is the gesture. playsinline for iOS.
 */

import { useEffect, useRef, useState } from "react";
import { Play, AlertCircle, ExternalLink, Loader2 } from "lucide-react";
import { useProgressStore } from "@/lib/progress/store";

type YTPlayer = {
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  setPlaybackRate: (rate: number) => void;
  destroy: () => void;
};

type YTNamespace = {
  Player: new (
    element: HTMLElement | string,
    options: {
      videoId: string;
      playerVars?: Record<string, number | string>;
      events?: {
        onReady?: () => void;
        onError?: () => void;
      };
    },
  ) => YTPlayer;
};

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const RATES = [0.75, 1, 1.25, 1.5, 2] as const;

let ytApiPromise: Promise<boolean> | null = null;

/** Load the IFrame API once per page lifetime; resolves false when unreachable. */
function loadYouTubeIframeApi(timeoutMs = 10000): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.YT?.Player) return Promise.resolve(true);
  if (ytApiPromise) return ytApiPromise;

  ytApiPromise = new Promise<boolean>((resolve) => {
    const finish = (ok: boolean) => {
      window.clearTimeout(timer);
      resolve(ok);
    };
    const timer = window.setTimeout(() => finish(false), timeoutMs);
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      finish(true);
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => finish(false);
    document.head.appendChild(script);
  });
  return ytApiPromise;
}

export default function EnglishVideoFacade({
  youtubeId,
  title,
  videoId,
  courseId,
  playlistUrl,
}: {
  /** YouTube video id (embedded via youtube-nocookie). */
  youtubeId: string;
  /** Original English title — used for a11y labels. */
  title: string;
  /** ETM video id ("001") — the key used in progress events. */
  videoId: string;
  /** Topic for stats: the course id (e.g. "en-zero"). */
  courseId: string;
  /** Original watch URL incl. &list= for the fallback link. */
  playlistUrl: string;
}) {
  const { ready, file, saveVideoProgress } = useProgressStore();
  const [stage, setStage] = useState<"facade" | "loading" | "playing" | "error">("facade");
  const [apiFallback, setApiFallback] = useState(false);
  const [rate, setRate] = useState<number>(1);
  const [savedPercent, setSavedPercent] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const lastSavedAtRef = useRef(0);

  const resumeSeconds = file.events
    .filter((e) => e.track === "english" && e.type === "video_progress" && e.itemId === videoId)
    .map((e) => Number(e.payload?.seconds ?? 0))
    .reduce((a, b) => (b > a ? b : a), 0);

  useEffect(() => {
    if (stage !== "playing" || apiFallback) return;
    const interval = window.setInterval(() => {
      const player = playerRef.current;
      if (!player) return;
      try {
        const seconds = player.getCurrentTime();
        const duration = player.getDuration();
        if (!Number.isFinite(seconds)) return;
        // Persist about every 5 s of playback.
        if (seconds - lastSavedAtRef.current < 5) return;
        lastSavedAtRef.current = seconds;
        const percent = duration > 0 ? Math.min(100, Math.round((seconds / duration) * 100)) : 0;
        saveVideoProgress("english", videoId, courseId, {
          seconds: Math.round(seconds),
          duration: Math.round(duration),
          percent,
        });
        setSavedPercent(percent);
      } catch {
        /* player not ready — try again next tick */
      }
    }, 1000);
    return () => window.clearInterval(interval);
  }, [stage, apiFallback, videoId, courseId, saveVideoProgress]);

  const mountPlainEmbed = () => {
    if (!containerRef.current) return;
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1&playsinline=1`;
    iframe.title = title;
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    iframe.className = "absolute inset-0 h-full w-full";
    containerRef.current.appendChild(iframe);
  };

  const start = async () => {
    setStage("loading");
    const apiReady = await loadYouTubeIframeApi();
    if (!apiReady || !containerRef.current) {
      // Degradation path: plain embed, no resume/speed controls.
      setApiFallback(true);
      setStage("playing");
      mountPlainEmbed();
      return;
    }
    try {
      playerRef.current = new window.YT!.Player(containerRef.current, {
        videoId: youtubeId,
        playerVars: {
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          autoplay: 1,
        },
        events: {
          onReady: () => {
            setStage("playing");
            const resume = Math.max(0, Math.floor(resumeSeconds));
            if (resume > 10) {
              try {
                playerRef.current?.seekTo(resume, true);
                lastSavedAtRef.current = resume;
              } catch {
                /* resume is best-effort */
              }
            }
          },
          onError: () => setStage("error"),
        },
      });
      setStage("playing");
    } catch {
      setStage("error");
    }
  };

  const applyRate = (next: number) => {
    setRate(next);
    try {
      playerRef.current?.setPlaybackRate(next);
    } catch {
      /* ignore */
    }
  };

  const stepRate = (direction: 1 | -1) => {
    const currentIndex = RATES.findIndex((r) => r === rate);
    const nextIndex = Math.min(RATES.length - 1, Math.max(0, (currentIndex === -1 ? 1 : currentIndex) + direction));
    applyRate(RATES[nextIndex]);
  };

  /** Keyboard: [ slower · ] faster · 0 reset (when focus is outside the iframe). */
  const onKeyDown = (event: React.KeyboardEvent) => {
    const target = event.target as HTMLElement;
    if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
    if (event.key === "[") {
      event.preventDefault();
      stepRate(-1);
    } else if (event.key === "]") {
      event.preventDefault();
      stepRate(1);
    } else if (event.key === "0") {
      event.preventDefault();
      applyRate(1);
    }
  };

  if (stage === "error") {
    return (
      <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-center">
        <AlertCircle className="mx-auto h-8 w-8 text-rose-400" />
        <p className="mt-3 font-bold text-white">تعذر تشغيل الفيديو داخل المنصة</p>
        <p className="mt-2 text-sm text-slate-400">
          القناة قد تكون عطلت التضمين أو أن الاتصال بموقع YouTube غير متاح الآن.
        </p>
        <a
          href={playlistUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-rose-500/20 px-4 py-2 text-sm font-bold text-rose-200 hover:bg-rose-500/30"
        >
          <ExternalLink className="h-4 w-4" />
          افتح على YouTube
        </a>
      </div>
    );
  }

  if (stage === "facade") {
    return (
      <button
        type="button"
        onClick={start}
        aria-label={`شغّل الفيديو: ${title}`}
        className="group relative block aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black text-start focus:outline-none focus:ring-2 focus:ring-emerald-400"
      >
        {/* Local poster — nothing is requested from YouTube until the learner clicks. */}
        <span
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_30%_15%,rgba(52,211,153,0.20),transparent_55%),radial-gradient(circle_at_78%_85%,rgba(34,211,238,0.16),transparent_55%),linear-gradient(160deg,#0b0f19_0%,#0d1b1a_100%)]"
        />
        <span aria-hidden className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-emerald-300">
            @ZAmericanEnglish · English
          </span>
          <span
            dir="auto"
            className="max-w-[85%] text-start text-sm sm:text-base font-semibold leading-6 text-slate-300 line-clamp-2 opacity-80"
          >
            {title}
          </span>
        </span>
        <span
          aria-hidden
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 via-black/10 to-transparent"
        >
          <span className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-emerald-500 text-ink-950 shadow-2xl transition-transform group-hover:scale-110">
            <Play className="h-8 w-8 sm:h-9 sm:w-9 fill-current" />
          </span>
        </span>
        {ready && resumeSeconds > 10 && (
          <span className="absolute bottom-3 start-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-emerald-300">
            استئناف من {Math.floor(resumeSeconds / 60)}:{String(Math.floor(resumeSeconds % 60)).padStart(2, "0")}
          </span>
        )}
      </button>
    );
  }

  return (
    <div onKeyDown={onKeyDown}>
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black">
        {stage === "loading" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-300">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
            <p className="text-sm">جاري تحميل المشغّل…</p>
          </div>
        )}
        <div ref={containerRef} className="absolute inset-0" />
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2" role="group" aria-label="سرعة التشغيل">
          <span className="text-xs text-slate-400">السرعة:</span>
          {RATES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => applyRate(r)}
              aria-pressed={rate === r}
              className={`rounded-lg border px-2.5 py-1.5 text-xs font-bold transition-colors ${
                rate === r
                  ? "border-emerald-400 bg-emerald-500/20 text-emerald-300"
                  : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
              }`}
              dir="ltr"
            >
              {r}×
            </button>
          ))}
        </div>
        <span dir="ltr" className="hidden text-[10px] text-slate-600 md:inline" title="اختصارات لوحة المفاتيح">
          [ slower ] faster 0 reset
        </span>
        <span className="text-xs text-slate-500">
          {savedPercent > 0 ? `يُحفظ موضعك تلقائيًا (${savedPercent}%)` : "يُحفظ موضعك تلقائيًا"}
        </span>
      </div>
    </div>
  );
}
