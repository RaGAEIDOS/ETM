"use client";

/**
 * Click-to-load YouTube facade for Programming Advices lessons.
 *
 * - Nothing is requested from YouTube until the learner clicks the poster.
 * - Playback uses the official IFrame Player API on youtube-nocookie.com and
 *   starts PAUSED (`autoplay: 0`); there is no autoplay at any point.
 * - Resume position comes from the learner's own video_progress events and is
 *   upserted every ~5 s. No separate storage key.
 * - Non-embeddable videos never silently disappear: the lesson page renders
 *   this component with `embeddable={false}` and gets a "Watch on YouTube"
 *   fallback instead.
 */

import { useEffect, useRef, useState } from "react";
import { Play, AlertCircle, ExternalLink, Loader2, Ban } from "lucide-react";
import { useCopy } from "@/lib/i18n/context";
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

let ytApiPromise: Promise<boolean> | null = null;

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

const COPY = {
  ar: {
    play: "حمّل الفيديو من YouTube",
    resume: (time: string) => `استئناف من ${time}`,
    loading: "جاري تحميل المشغّل…",
    pausedNote: "لا يبدأ التشغيل تلقائيًا — اضغط زر التشغيل داخل المشغّل.",
    saved: (pct: number) => `يُحفظ موضعك تلقائيًا (${pct}%)`,
    saving: "يُحفظ موضعك تلقائيًا",
    speed: "سرعة التشغيل",
    errorTitle: "تعذر تشغيل الفيديو داخل المنصة",
    errorBody: "قد يكون صاحب القناة قد عطّل التضمين، أو أن الاتصال بـYouTube غير متاح الآن.",
    openYouTube: "افتح على YouTube",
    unavailableTitle: "هذا الفيديو غير متاح للتضمين",
    unavailableBody:
      "صاحب القناة لم يسمح بتشغيل هذا الفيديو داخل مواقع أخرى. الدرس موجود كاملًا هنا، والمشاهدة متاحة من خلال YouTube الرسمي.",
    unavailableCta: "شاهد على YouTube",
    keyboard: "اختصارات: [ أبطأ · ] أسرع · 0 طبيعي",
  },
  en: {
    play: "Load the video from YouTube",
    resume: (time: string) => `Resume from ${time}`,
    loading: "Loading the player…",
    pausedNote: "Playback never starts automatically — press play inside the player.",
    saved: (pct: number) => `Your position saves automatically (${pct}%)`,
    saving: "Your position saves automatically",
    speed: "Playback speed",
    errorTitle: "The video could not start inside the platform",
    errorBody: "The channel may have disabled embedding, or YouTube is unreachable right now.",
    openYouTube: "Open on YouTube",
    unavailableTitle: "This video is not available for embedding",
    unavailableBody:
      "The channel has not allowed this video to play on other sites. The full lesson still exists here, and watching is available through official YouTube.",
    unavailableCta: "Watch on YouTube",
    keyboard: "Shortcuts: [ slower · ] faster · 0 reset",
  },
} as const;

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function PAVideoFacade({
  youtubeId,
  title,
  videoId,
  courseId,
  watchUrl,
  embeddable = true,
}: {
  youtubeId: string;
  /** Original published title, used for a11y labels. */
  title: string;
  /** ETM lesson id ("pa1-01") — key for progress events. */
  videoId: string;
  courseId: string;
  /** Official watch URL for the fallback link. */
  watchUrl: string;
  /** False renders the "Watch on YouTube" lesson fallback. */
  embeddable?: boolean;
}) {
  const c = useCopy(COPY);
  const { ready, file, saveVideoProgress } = useProgressStore();
  const [stage, setStage] = useState<"facade" | "loading" | "playing" | "error">("facade");
  const [apiFallback, setApiFallback] = useState(false);
  const [rate, setRate] = useState<number>(1);
  const [savedPercent, setSavedPercent] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const lastSavedAtRef = useRef(0);

  const resumeSeconds = file.events
    .filter((e) => e.track === "programmingadvices" && e.type === "video_progress" && e.itemId === videoId)
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
        if (seconds - lastSavedAtRef.current < 5) return;
        lastSavedAtRef.current = seconds;
        const percent = duration > 0 ? Math.min(100, Math.round((seconds / duration) * 100)) : 0;
        saveVideoProgress("programmingadvices", videoId, courseId, {
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

  useEffect(() => {
    return () => {
      try {
        playerRef.current?.destroy();
      } catch {
        /* ignore */
      }
    };
  }, []);

  const mountPlainEmbed = () => {
    if (!containerRef.current) return;
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1&playsinline=1&autoplay=0`;
    iframe.title = title;
    iframe.allow = "accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    iframe.className = "absolute inset-0 h-full w-full";
    containerRef.current.appendChild(iframe);
  };

  const start = async () => {
    setStage("loading");
    const apiReady = await loadYouTubeIframeApi();
    if (!apiReady || !containerRef.current) {
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
          autoplay: 0,
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
    const nextIndex = Math.min(
      RATES.length - 1,
      Math.max(0, (currentIndex === -1 ? 1 : currentIndex) + direction),
    );
    applyRate(RATES[nextIndex]);
  };

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

  if (!embeddable) {
    return (
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/[0.08] p-6 text-center">
        <Ban className="mx-auto h-8 w-8 text-amber-400" />
        <p className="mt-3 font-bold text-white">{c.unavailableTitle}</p>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-slate-400">{c.unavailableBody}</p>
        <a
          href={watchUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-amber-500/20 px-4 py-2.5 text-sm font-bold text-amber-200 hover:bg-amber-500/30"
        >
          <ExternalLink className="h-4 w-4" />
          {c.unavailableCta}
        </a>
      </div>
    );
  }

  if (stage === "error") {
    return (
      <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-center">
        <AlertCircle className="mx-auto h-8 w-8 text-rose-400" />
        <p className="mt-3 font-bold text-white">{c.errorTitle}</p>
        <p className="mt-2 text-sm text-slate-400">{c.errorBody}</p>
        <a
          href={watchUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-rose-500/20 px-4 py-2 text-sm font-bold text-rose-200 hover:bg-rose-500/30"
        >
          <ExternalLink className="h-4 w-4" />
          {c.openYouTube}
        </a>
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
        <YouTubeThumbnail
          youtubeId={youtubeId}
          alt={title}
          width={640}
          height={360}
          className="absolute inset-0 h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
        />
        <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        <span aria-hidden className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6">
          <span
            dir="auto"
            className="line-clamp-2 max-w-[85%] text-start text-sm font-semibold leading-6 text-slate-200 sm:text-base"
          >
            {title}
          </span>
        </span>
        <span
          aria-hidden
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 via-black/10 to-transparent"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-400 text-ink-950 shadow-2xl transition-transform group-hover:scale-110 sm:h-20 sm:w-20">
            <Play className="h-8 w-8 fill-current sm:h-9 sm:w-9" />
          </span>
        </span>
        {ready && resumeSeconds > 10 && (
          <span
            aria-hidden="true"
            className="absolute bottom-3 start-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-amber-300"
          >
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
            <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
            <p className="text-sm">{c.loading}</p>
          </div>
        )}
        <div ref={containerRef} className="absolute inset-0" />
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2" role="group" aria-label={c.speed}>
          <span className="text-xs text-slate-400">{c.speed}:</span>
          {RATES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => applyRate(r)}
              aria-pressed={rate === r}
              className={`rounded-lg border px-2.5 py-1.5 text-xs font-bold transition-colors ${
                rate === r
                  ? "border-amber-400 bg-amber-500/20 text-amber-300"
                  : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
              }`}
              dir="ltr"
            >
              {r}×
            </button>
          ))}
        </div>
        <span dir="ltr" className="hidden text-[10px] text-slate-600 md:inline">
          {c.keyboard}
        </span>
        <span className="text-xs text-slate-500">
          {savedPercent > 0 ? c.saved(savedPercent) : c.saving}
        </span>
      </div>
      <p className="mt-2 text-[11px] text-slate-500">{c.pausedNote}</p>
    </div>
  );
}
