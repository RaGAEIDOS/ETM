"use client";

/**
 * Click-to-load YouTube facade for the Islamic Studies track.
 *
 * - Nothing is requested from YouTube until the learner clicks the thumbnail.
 * - Playback uses the official IFrame Player API on youtube-nocookie.com
 *   (lazy-loaded after the click). If the API cannot load (offline / blocked),
 *   we degrade to a plain nocookie embed without resume or speed controls.
 * - Resume position is derived from the learner's own `video_progress` events
 *   (upserted every ~5s) under the `religious` track — the same mechanism the
 *   Linux and Programming Advices tracks use.
 * - No autoplay before the click; after the click the embed starts because the
 *   click itself is the gesture. playsinline for iOS.
 */

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Play, AlertCircle, ExternalLink, Loader2 } from "lucide-react";
import { useProgressStore } from "@/lib/progress/store";
import YouTubeThumbnail from "@/components/YouTubeThumbnail";

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

const COPY = {
  ar: {
    play: "شغّل المحاضرة",
    resume: (time: string) => `استئناف من ${time}`,
    loading: "جاري تحميل المشغّل…",
    speed: "السرعة",
    saved: (percent: number) =>
      percent > 0 ? `يُحفظ موضعك تلقائيًا (${percent}%)` : "يُحفظ موضعك تلقائيًا",
    shortcuts: "[ أبطأ ] أسرع 0 إعادة",
    errorTitle: "تعذر تشغيل الفيديو داخل المنصة",
    errorBody:
      "قد تكون القناة عطّلت التضمين أو أن الاتصال بموقع YouTube غير متاح الآن.",
    openYouTube: "افتح على YouTube",
    openPlaylist: "قائمة التشغيل",
  },
  en: {
    play: "Play the lecture",
    resume: (time: string) => `Resume from ${time}`,
    loading: "Loading the player…",
    speed: "Speed",
    saved: (percent: number) =>
      percent > 0 ? `Your position is saved automatically (${percent}%)` : "Your position is saved automatically",
    shortcuts: "[ slower ] faster 0 reset",
    errorTitle: "This video could not play inside the platform",
    errorBody:
      "The channel may have disabled embedding, or YouTube is unreachable right now.",
    openYouTube: "Open on YouTube",
    openPlaylist: "Playlist",
  },
} as const;

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

function formatTime(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const rest = safe % 60;
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
  }
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

export default function ReligiousVideoFacade({
  youtubeId,
  title,
  lessonId,
  courseId,
  locale,
  playlistUrl,
}: {
  /** YouTube video id (embedded via youtube-nocookie). */
  youtubeId: string;
  /** Original video title — used for a11y labels. */
  title: string;
  /** ETM lesson id ("islam-essentials-01") — the key used in progress events. */
  lessonId: string;
  /** Topic for stats: the course id ("islam-essentials"). */
  courseId: string;
  locale: "ar" | "en";
  /** Verified playlist for the lesson's module. */
  playlistUrl?: string;
}) {
  const c = COPY[locale];
  const { ready, file, saveVideoProgress } = useProgressStore();
  const [stage, setStage] = useState<"facade" | "loading" | "playing" | "error">("facade");
  const [apiFallback, setApiFallback] = useState(false);
  const [rate, setRate] = useState<number>(1);
  const [savedPercent, setSavedPercent] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const lastSavedAtRef = useRef(0);

  const watchUrl = `https://www.youtube.com/watch?v=${youtubeId}`;

  const resumeSeconds = file.events
    .filter(
      (event) =>
        event.track === "religious" &&
        event.type === "video_progress" &&
        event.itemId === lessonId
    )
    .map((event) => Number(event.payload?.seconds ?? 0))
    .reduce((a, b) => (b > a ? b : a), 0);

  useEffect(() => {
    if (stage !== "playing" || apiFallback) return;
    const interval = window.setInterval(() => {
      const player = playerRef.current;
      if (!player) return;
      try {
        const seconds = player.getCurrentTime();
        const duration = player.getDuration();
        if (!Number.isFinite(seconds) || seconds <= 0) return;
        // Persist about every 5 s of playback.
        if (seconds - lastSavedAtRef.current < 5) return;
        lastSavedAtRef.current = seconds;
        const percent = duration > 0 ? Math.min(100, Math.round((seconds / duration) * 100)) : 0;
        saveVideoProgress("religious", lessonId, courseId, {
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
  }, [stage, apiFallback, lessonId, courseId, saveVideoProgress]);

  const mountPlainEmbed = () => {
    if (!containerRef.current) return;
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1&playsinline=1`;
    iframe.title = title;
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
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
    const currentIndex = RATES.findIndex((value) => value === rate);
    const nextIndex = Math.min(
      RATES.length - 1,
      Math.max(0, (currentIndex === -1 ? 1 : currentIndex) + direction)
    );
    applyRate(RATES[nextIndex]);
  };

  /** Keyboard: [ slower · ] faster · 0 reset (when focus is outside the iframe). */
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
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
        <AlertCircle className="mx-auto h-8 w-8 text-rose-400" aria-hidden />
        <p className="mt-3 font-bold text-white">{c.errorTitle}</p>
        <p className="mt-2 text-sm text-slate-400">{c.errorBody}</p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <a
            href={watchUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-rose-500/20 px-4 py-2 text-sm font-bold text-rose-200 hover:bg-rose-500/30"
          >
            <ExternalLink className="h-4 w-4" aria-hidden />
            {c.openYouTube}
          </a>
          {playlistUrl && (
            <a
              href={playlistUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-bold text-slate-200 hover:bg-white/10"
            >
              <ExternalLink className="h-4 w-4" aria-hidden />
              {c.openPlaylist}
            </a>
          )}
        </div>
      </div>
    );
  }

  if (stage === "facade") {
    return (
      <button
        type="button"
        onClick={start}
        aria-label={`${c.play}: ${title}`}
        className="group relative block aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black text-start focus:outline-none focus:ring-2 focus:ring-amber-400"
      >
        {/* Official YouTube thumbnail; nothing is requested from YouTube's player until the learner clicks. */}
        <YouTubeThumbnail
          youtubeId={youtubeId}
          alt={title}
          width={640}
          height={360}
          className="absolute inset-0 h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
        />
        <span
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/5"
        />
        <span
          aria-hidden
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 via-black/10 to-transparent"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-400 text-ink-950 shadow-2xl transition-transform group-hover:scale-110 sm:h-20 sm:w-20">
            <Play className="h-8 w-8 fill-current sm:h-9 sm:w-9" aria-hidden />
          </span>
        </span>
        {ready && resumeSeconds > 10 && (
          <span className="absolute bottom-3 start-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-amber-200">
            {c.resume(formatTime(resumeSeconds))}
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
            <Loader2 className="h-8 w-8 animate-spin text-amber-400" aria-hidden />
            <p className="text-sm">{c.loading}</p>
          </div>
        )}
        <div ref={containerRef} className="absolute inset-0" />
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2" role="group" aria-label={c.speed}>
          <span className="text-xs text-slate-400">{c.speed}:</span>
          {RATES.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => applyRate(value)}
              aria-pressed={rate === value}
              className={`rounded-lg border px-2.5 py-1.5 text-xs font-bold transition-colors ${
                rate === value
                  ? "border-amber-400 bg-amber-500/20 text-amber-200"
                  : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
              }`}
              dir="ltr"
            >
              {value}×
            </button>
          ))}
        </div>
        <span
          dir="ltr"
          className="hidden text-[10px] text-slate-600 md:inline"
          title={c.shortcuts}
        >
          {c.shortcuts}
        </span>
        <span className="text-xs text-slate-500">{c.saved(savedPercent)}</span>
      </div>
    </div>
  );
}
