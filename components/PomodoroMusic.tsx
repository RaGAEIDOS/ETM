"use client";

/**
 * Pomodoro music layer — Lofi Girl (YouTube) / Spotify / Off.
 *
 * Behaviour contract:
 * - Nothing is requested from YouTube or Spotify until the learner picks a
 *   source; Lofi Girl additionally needs a click on its facade before the
 *   IFrame API is loaded (no autoplay before interaction).
 * - Music follows the timer: starts on focus, pauses on breaks, resumes with
 *   the next focus. The learner can always override with play/pause.
 * - Volume is stored per theme (cozy 40, terminal 25, others 30 by default).
 * - "Mute during quizzes" watches `[data-quiz]` elements in the viewport.
 * - While a focus session runs, the page title carries a now-playing badge.
 * - Cozy mode enables Lofi Girl once and raises a one-time tooltip.
 *
 * The component never unmounts when the Pomodoro panel collapses (the panel is
 * hidden with CSS), so audio keeps playing and the timer state survives.
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AlertCircle,
  ExternalLink,
  Headphones,
  Loader2,
  Music2,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useCopy } from "@/lib/i18n/context";
import { formatNumber } from "@/lib/i18n/config";
import { readAppliedTheme, THEME_EVENT, THEME_STORAGE_KEY, type ThemeId } from "@/lib/theme";
import {
  clampVolume,
  DEFAULT_MUSIC_VOLUME,
  formatClock,
  LOFI_LIVE_URL,
  LOFI_LIVE_VIDEO_ID,
  LOFI_UPLOADS_PLAYLIST_URL,
  markCozyTipSeen,
  persistQuizMute,
  persistSource,
  persistVolumes,
  readCozyTipSeen,
  readQuizMute,
  readStoredSource,
  readStoredVolumes,
  SPOTIFY_EMBED_URL,
  SPOTIFY_PLAYLIST_URL,
  volumeForTheme,
  type MusicSource,
} from "@/lib/music";
import {
  loadYouTubeIframeApi,
  type YouTubeNamespace,
  type YouTubePlayer,
} from "@/lib/youtube-iframe";

export type PomodoroMode = "focus" | "short" | "long";

type PlayerStatus = "idle" | "loading" | "ready" | "error";

interface PomodoroMusicProps {
  mode: PomodoroMode;
  running: boolean;
  secondsLeft: number;
  /** Raises the one-time cozy + lofi tooltip in the Pomodoro shell. */
  onCozyTip: () => void;
}

const COPY = {
  ar: {
    title: "موسيقى التركيز",
    sourceLabel: "مصدر الموسيقى",
    off: "بدون",
    lofi: "Lofi Girl",
    spotify: "Spotify",
    hint: "تبدأ مع التركيز، تتوقف في الاستراحة، وتعود مع التركيز التالي.",
    lofiFacadeNote: "البث الرسمي 24/7 — اضغط للتشغيل. لا تشغيل تلقائي.",
    lofiLoad: "تشغيل Lofi Girl",
    loading: "جارٍ التحميل...",
    lofiError: "تعذّر تشغيل البث داخل الصفحة.",
    watchOnYoutube: "افتح البث على YouTube",
    latestMix: "أحدث ميكس على القناة",
    retry: "إعادة المحاولة",
    playMusic: "تشغيل",
    pauseMusic: "إيقاف مؤقت",
    playingNow: "يعمل الآن",
    pausedMusic: "متوقف",
    pausedForQuiz: "متوقف أثناء الاختبار",
    volume: "مستوى الموسيقى",
    quizMute: "كتم الموسيقى أثناء الاختبارات",
    quizMuteNote: "تتوقف تلقائياً عند ظهور اختبار أو مراجعة على الشاشة.",
    spotifyNote:
      "التحكم الكامل داخل مشغّل Spotify؛ زر التشغيل هنا أفضل جهد.",
    spotifyEmbedTitle: "قائمة Spotify — لوفي للتركيز",
    creditLofi: "Music by Lofi Girl on YouTube",
    creditSpotify: "Playlist on Spotify",
  },
  en: {
    title: "Focus music",
    sourceLabel: "Music source",
    off: "Off",
    lofi: "Lofi Girl",
    spotify: "Spotify",
    hint: "Starts with focus, pauses on breaks, resumes with the next focus.",
    lofiFacadeNote: "Official 24/7 stream — click to play. Never autoplays.",
    lofiLoad: "Play Lofi Girl",
    loading: "Loading...",
    lofiError: "The stream could not be embedded here.",
    watchOnYoutube: "Open the stream on YouTube",
    latestMix: "Latest mix on the channel",
    retry: "Retry",
    playMusic: "Play",
    pauseMusic: "Pause",
    playingNow: "Playing now",
    pausedMusic: "Paused",
    pausedForQuiz: "Paused for the quiz",
    volume: "Music volume",
    quizMute: "Mute music during quizzes",
    quizMuteNote: "Pauses automatically while a quiz or review is on screen.",
    spotifyNote:
      "Full control lives inside the Spotify player; the button here is best-effort.",
    spotifyEmbedTitle: "Spotify playlist — focus lofi",
    creditLofi: "Music by Lofi Girl on YouTube",
    creditSpotify: "Playlist on Spotify",
  },
} as const;

const TITLE_PREFIX =
  /^(?:(?:🎧\s(?:Lofi Girl|Spotify)\s·)|⏳)\s\d{1,3}:\d{2}\s·\s/;

export default function PomodoroMusic({
  mode,
  running,
  secondsLeft,
  onCozyTip,
}: PomodoroMusicProps) {
  const c = useCopy(COPY);
  const [mounted, setMounted] = useState(false);
  const [source, setSource] = useState<MusicSource>("off");
  const [theme, setTheme] = useState<ThemeId>("dark");
  const [volume, setVolume] = useState(DEFAULT_MUSIC_VOLUME);
  const [quizMute, setQuizMute] = useState(true);
  const [quizActive, setQuizActive] = useState(false);
  const [wantPlay, setWantPlay] = useState(false);
  const [playerMounted, setPlayerMounted] = useState(false);
  const [status, setStatus] = useState<PlayerStatus>("idle");
  const [ytPlaying, setYtPlaying] = useState(false);
  const [spotifyReady, setSpotifyReady] = useState(false);

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const spotifyRef = useRef<HTMLIFrameElement | null>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const loadingRef = useRef(false);
  const autoplayAfterLoadRef = useRef(false);

  const sourceRef = useRef<MusicSource>("off");
  const volumeRef = useRef(DEFAULT_MUSIC_VOLUME);
  const quizMuteRef = useRef(true);
  const quizActiveRef = useRef(false);
  const wantPlayRef = useRef(false);
  const themeRef = useRef<ThemeId>("dark");
  const prevModeRef = useRef<PomodoroMode | null>(null);
  const prevRunningRef = useRef<boolean | null>(null);

  // ---- restore (client only: the shell renders this after mount) ----
  useEffect(() => {
    setMounted(true);
    const themeNow = readAppliedTheme();
    const storedSource = readStoredSource();
    const storedVolumes = readStoredVolumes();
    const storedQuizMute = readQuizMute();

    themeRef.current = themeNow;
    setTheme(themeNow);
    setVolume(volumeForTheme(themeNow, storedVolumes));
    volumeRef.current = volumeForTheme(themeNow, storedVolumes);
    setQuizMute(storedQuizMute);
    quizMuteRef.current = storedQuizMute;

    let nextSource: MusicSource = storedSource ?? "off";
    if (
      themeNow === "cozy" &&
      storedSource === null &&
      !readCozyTipSeen()
    ) {
      nextSource = "lofi";
      persistSource("lofi");
      markCozyTipSeen();
      onCozyTip();
    }
    setSource(nextSource);
    sourceRef.current = nextSource;
  }, [onCozyTip]);

  // ---- per-theme volume + cozy first-use ----
  useEffect(() => {
    if (!mounted) return;
    const applyTheme = () => {
      const next = readAppliedTheme();
      if (next === themeRef.current) return;
      themeRef.current = next;
      setTheme(next);
      const stored = readStoredVolumes();
      const nextVolume = volumeForTheme(next, stored);
      setVolume(nextVolume);
      volumeRef.current = nextVolume;

      if (
        next === "cozy" &&
        readStoredSource() === null &&
        !readCozyTipSeen()
      ) {
        persistSource("lofi");
        markCozyTipSeen();
        setSource("lofi");
        sourceRef.current = "lofi";
        onCozyTip();
      }
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY) applyTheme();
    };
    document.addEventListener(THEME_EVENT, applyTheme);
    window.addEventListener("storage", onStorage);
    return () => {
      document.removeEventListener(THEME_EVENT, applyTheme);
      window.removeEventListener("storage", onStorage);
    };
  }, [mounted, onCozyTip]);

  const spotifyPost = useCallback(
    (command: "play" | "pause" | "volume", value?: number) => {
      const target = spotifyRef.current?.contentWindow;
      if (!target) return;
      try {
        if (command === "volume") {
          target.postMessage({ command: "volume", value }, "*");
          target.postMessage({ command: "setVolume", value }, "*");
        } else {
          target.postMessage({ command }, "*");
          target.postMessage({ action: command }, "*");
        }
      } catch {
        /* cross-origin player refused the message — best effort only */
      }
    },
    []
  );

  // ---- YouTube IFrame player (loaded only after a click) ----
  const mountLofiPlayer = useCallback(
    async (autoplay: boolean) => {
      if (typeof window === "undefined") return;
      setPlayerMounted(true);
      autoplayAfterLoadRef.current = autoplay;

      if (playerRef.current) {
        if (autoplay) playerRef.current.playVideo();
        return;
      }
      if (loadingRef.current) return;

      const wrap = wrapRef.current;
      if (!wrap) {
        setStatus("error");
        return;
      }

      loadingRef.current = true;
      setStatus("loading");
      const ok = await loadYouTubeIframeApi();
      if (!ok) {
        loadingRef.current = false;
        setStatus("error");
        return;
      }

      const w = window as unknown as { YT?: YouTubeNamespace };
      if (!w.YT?.Player) {
        loadingRef.current = false;
        setStatus("error");
        return;
      }

      try {
        wrap.innerHTML = "";
        const mount = document.createElement("div");
        mount.className = "h-full w-full";
        wrap.appendChild(mount);
        const player = new w.YT.Player(mount, {
          videoId: LOFI_LIVE_VIDEO_ID,
          host: "https://www.youtube-nocookie.com",
          playerVars: {
            autoplay: 0,
            playsinline: 1,
            rel: 0,
            modestbranding: 1,
            controls: 1,
          },
          events: {
            onReady: (event) => {
              playerRef.current = event.target;
              event.target.setVolume(volumeRef.current);
              loadingRef.current = false;
              setStatus("ready");
              if (autoplayAfterLoadRef.current) {
                event.target.playVideo();
                setWantPlay(true);
                wantPlayRef.current = true;
              }
            },
            onStateChange: (event) => {
              setYtPlaying(event.data === 1);
            },
            onError: () => {
              loadingRef.current = false;
              setYtPlaying(false);
              setStatus("error");
            },
          },
        });
        playerRef.current = player;
      } catch {
        loadingRef.current = false;
        setStatus("error");
      }
    },
    []
  );

  const retryLofi = useCallback(() => {
    try {
      playerRef.current?.destroy();
    } catch {
      /* already gone */
    }
    playerRef.current = null;
    loadingRef.current = false;
    setStatus("idle");
    setPlayerMounted(false);
    void mountLofiPlayer(true);
  }, [mountLofiPlayer]);

  useEffect(() => {
    return () => {
      try {
        playerRef.current?.destroy();
      } catch {
        /* already gone */
      }
      playerRef.current = null;
    };
  }, []);

  // ---- source selection ----
  const chooseSource = useCallback(
    (next: MusicSource) => {
      setSource(next);
      sourceRef.current = next;
      persistSource(next);

      if (next === "off") {
        setWantPlay(false);
        wantPlayRef.current = false;
        playerRef.current?.pauseVideo();
        setYtPlaying(false);
        spotifyPost("pause");
        return;
      }
      if (next === "lofi") {
        spotifyPost("pause");
        if (mode === "focus" && running && playerRef.current) {
          setWantPlay(true);
          wantPlayRef.current = true;
        }
        return;
      }
      playerRef.current?.pauseVideo();
      setYtPlaying(false);
      if (mode === "focus" && running) {
        setWantPlay(true);
        wantPlayRef.current = true;
      }
    },
    [mode, running, spotifyPost]
  );

  const toggleMusic = useCallback(() => {
    if (sourceRef.current === "off") return;
    if (sourceRef.current === "lofi" && !playerRef.current) {
      void mountLofiPlayer(true);
      return;
    }
    const next = !wantPlayRef.current;
    setWantPlay(next);
    wantPlayRef.current = next;
  }, [mountLofiPlayer]);

  const changeVolume = useCallback(
    (value: number) => {
      const next = clampVolume(value);
      setVolume(next);
      volumeRef.current = next;
      const stored = readStoredVolumes();
      stored[themeRef.current] = next;
      persistVolumes(stored);
    },
    []
  );

  const changeQuizMute = useCallback((value: boolean) => {
    setQuizMute(value);
    quizMuteRef.current = value;
    persistQuizMute(value);
  }, []);

  // ---- music follows the timer (mode changes and focus starts) ----
  useEffect(() => {
    if (!mounted) return;
    if (prevModeRef.current === null) {
      prevModeRef.current = mode;
      return;
    }
    if (prevModeRef.current === mode) return;
    prevModeRef.current = mode;
    const shouldPlay = mode === "focus" && sourceRef.current !== "off";
    setWantPlay(shouldPlay);
    wantPlayRef.current = shouldPlay;
  }, [mode, mounted]);

  useEffect(() => {
    if (!mounted) return;
    if (prevRunningRef.current === null) {
      prevRunningRef.current = running;
      return;
    }
    const started = running && !prevRunningRef.current;
    prevRunningRef.current = running;
    if (!started || mode !== "focus" || sourceRef.current === "off") return;
    setWantPlay(true);
    wantPlayRef.current = true;
  }, [running, mode, mounted]);

  // ---- mute during quizzes: watch visible [data-quiz] roots ----
  useEffect(() => {
    if (!mounted || source === "off" || !quizMute) {
      quizActiveRef.current = false;
      setQuizActive(false);
      return;
    }
    const check = () => {
      let visible = false;
      document.querySelectorAll("[data-quiz]").forEach((node) => {
        const rect = node.getBoundingClientRect();
        if (
          rect.width > 0 &&
          rect.height > 0 &&
          rect.bottom > 0 &&
          rect.top < window.innerHeight
        ) {
          visible = true;
        }
      });
      if (visible !== quizActiveRef.current) {
        quizActiveRef.current = visible;
        setQuizActive(visible);
      }
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    const id = window.setInterval(check, 1200);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
      window.clearInterval(id);
    };
  }, [mounted, source, quizMute]);

  // ---- playback engine ----
  const blockedByQuiz = quizMute && quizActive;
  const musicOn = wantPlay && !blockedByQuiz;

  useEffect(() => {
    if (!mounted || status !== "ready") return;
    const player = playerRef.current;
    if (!player) return;
    if (source === "lofi" && musicOn) {
      player.setVolume(volumeRef.current);
      player.playVideo();
    } else {
      player.pauseVideo();
    }
  }, [mounted, status, source, musicOn]);

  useEffect(() => {
    if (!mounted || source !== "spotify") return;
    spotifyPost(musicOn ? "play" : "pause");
  }, [mounted, source, musicOn, spotifyReady, spotifyPost]);

  useEffect(() => {
    volumeRef.current = volume;
    if (source === "lofi" && playerRef.current) {
      playerRef.current.setVolume(volume);
    }
    if (source === "spotify") spotifyPost("volume", volume);
  }, [volume, source, spotifyPost]);

  // ---- now-playing badge in the page title during focus ----
  const focusRunning = mode === "focus" && running;
  const nowPlaying =
    source === "spotify"
      ? musicOn
      : source === "lofi"
      ? musicOn && ytPlaying
      : false;

  useEffect(() => {
    if (typeof document === "undefined") return;
    const base = document.title.replace(TITLE_PREFIX, "");
    if (!focusRunning) {
      if (base !== document.title) document.title = base;
      return;
    }
    const badge = nowPlaying
      ? `🎧 ${source === "lofi" ? "Lofi Girl" : "Spotify"} ·`
      : "⏳";
    document.title = `${badge} ${formatClock(secondsLeft)} · ${base}`;
  }, [focusRunning, secondsLeft, nowPlaying, source]);

  useEffect(() => {
    return () => {
      if (typeof document !== "undefined") {
        document.title = document.title.replace(TITLE_PREFIX, "");
      }
    };
  }, []);

  if (!mounted) return null;

  const playingLabel = blockedByQuiz && wantPlay
    ? c.pausedForQuiz
    : musicOn
    ? c.playingNow
    : c.pausedMusic;

  return (
    <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <div className="flex items-center gap-2 text-sm font-bold text-white">
        <Music2 className="h-4 w-4 text-cyan-400" />
        <span>{c.title}</span>
        {musicOn && (
          <span className="ms-auto inline-flex items-center gap-1 rounded-full border border-cyan-500/25 bg-cyan-500/10 px-2 py-0.5 text-[9px] font-bold text-cyan-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
            {c.playingNow}
          </span>
        )}
      </div>
      <p className="mt-1 text-[10px] leading-4 text-slate-500">{c.hint}</p>

      {/* source picker */}
      <div
        role="group"
        aria-label={c.sourceLabel}
        className="mt-2 grid grid-cols-3 gap-1 rounded-lg border border-white/10 bg-white/[0.03] p-1"
      >
        {(["off", "lofi", "spotify"] as const).map((id) => {
          const active = source === id;
          const Icon =
            id === "off" ? VolumeX : id === "lofi" ? Headphones : Music2;
          return (
            <button
              key={id}
              type="button"
              onClick={() => chooseSource(id)}
              aria-pressed={active}
              className={`inline-flex items-center justify-center gap-1 rounded-md px-1.5 py-2 text-[11px] font-bold transition-colors ${
                active
                  ? "bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-500/30"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden />
              {c[id]}
            </button>
          );
        })}
      </div>

      {/* Lofi Girl — click-to-load facade / player */}
      {source === "lofi" && (
        <div className="mt-3">
          {status === "error" ? (
            <div className="rounded-xl border border-amber-500/25 bg-amber-500/[0.06] p-3">
              <p className="flex items-start gap-2 text-[11px] font-bold leading-4 text-amber-200">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {c.lofiError}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <a
                  href={LOFI_LIVE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-1.5 text-[10px] font-bold text-slate-200 hover:bg-white/10"
                >
                  <ExternalLink className="h-3 w-3" />
                  {c.watchOnYoutube}
                </a>
                <a
                  href={LOFI_UPLOADS_PLAYLIST_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-1.5 text-[10px] font-bold text-slate-200 hover:bg-white/10"
                >
                  {c.latestMix}
                </a>
                <button
                  type="button"
                  onClick={retryLofi}
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-[10px] font-bold text-amber-300 hover:text-amber-200"
                >
                  <RotateCcw className="h-3 w-3" />
                  {c.retry}
                </button>
              </div>
            </div>
          ) : (
            <>
              {!playerMounted && (
                <div className="rounded-xl border border-rose-500/20 bg-gradient-to-br from-rose-500/15 via-violet-500/10 to-amber-500/10 p-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white">
                      {status === "loading" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-black text-white">
                        Lofi Girl — 24/7
                      </p>
                      <p className="text-[10px] leading-4 text-slate-400">
                        {c.lofiFacadeNote}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => void mountLofiPlayer(true)}
                      disabled={status === "loading"}
                      className="shrink-0 rounded-lg bg-rose-500 px-2.5 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-rose-400 disabled:opacity-60"
                    >
                      {status === "loading" ? c.loading : c.lofiLoad}
                    </button>
                  </div>
                </div>
              )}
              {playerMounted && (
                <div className="mt-2 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={toggleMusic}
                    disabled={status !== "ready"}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-[11px] font-bold text-slate-200 transition-colors hover:bg-white/10 disabled:opacity-60"
                  >
                    {musicOn ? (
                      <Pause className="h-3.5 w-3.5" />
                    ) : (
                      <Play className="h-3.5 w-3.5" />
                    )}
                    {musicOn ? c.pauseMusic : c.playMusic}
                  </button>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        ytPlaying ? "bg-rose-400" : "bg-slate-600"
                      }`}
                    />
                    {playingLabel}
                  </span>
                </div>
              )}
            </>
          )}
          {/* The mount node must exist even in the error state so Retry can
              rebuild the player without remounting the whole music section. */}
          <div
            ref={wrapRef}
            className={`mt-2 h-36 overflow-hidden rounded-xl border border-white/10 bg-black ${
              playerMounted && status !== "error" ? "" : "hidden"
            }`}
          />
        </div>
      )}

      {/* Spotify — compact 80px embed */}
      {source === "spotify" && (
        <div className="mt-3">
          <div className="overflow-hidden rounded-xl border border-white/10">
            <iframe
              ref={spotifyRef}
              src={`${SPOTIFY_EMBED_URL}&theme=${theme === "light" ? 1 : 0}`}
              width="100%"
              height={80}
              className="block border-0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title={c.spotifyEmbedTitle}
              onLoad={() => setSpotifyReady(true)}
            />
          </div>
          <div className="mt-2 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={toggleMusic}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-[11px] font-bold text-slate-200 transition-colors hover:bg-white/10"
            >
              {musicOn ? (
                <Pause className="h-3.5 w-3.5" />
              ) : (
                <Play className="h-3.5 w-3.5" />
              )}
              {musicOn ? c.pauseMusic : c.playMusic}
            </button>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  musicOn ? "bg-emerald-400" : "bg-slate-600"
                }`}
              />
              {playingLabel}
            </span>
          </div>
          <p className="mt-2 text-[10px] leading-4 text-slate-500">
            {c.spotifyNote}
          </p>
        </div>
      )}

      {/* volume — stored per theme */}
      {source !== "off" && (
        <div className="mt-3 flex items-center gap-2">
          <Volume2 className="h-3.5 w-3.5 shrink-0 text-slate-500" />
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={volume}
            onChange={(event) => changeVolume(Number(event.target.value))}
            className="min-w-0 flex-1 accent-cyan-400"
            dir="ltr"
            aria-label={c.volume}
          />
          <span
            className="w-9 shrink-0 text-end text-[10px] font-bold tabular-nums text-slate-400"
            dir="ltr"
          >
            {formatNumber(volume)}%
          </span>
        </div>
      )}

      {/* quiz mute */}
      <label className="mt-3 flex cursor-pointer items-start gap-2">
        <input
          type="checkbox"
          checked={quizMute}
          onChange={(event) => changeQuizMute(event.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-cyan-400"
        />
        <span>
          <span className="block text-[11px] font-bold text-slate-200">
            {c.quizMute}
          </span>
          <span className="block text-[10px] leading-4 text-slate-500">
            {c.quizMuteNote}
          </span>
        </span>
      </label>

      {/* credits */}
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-500">
        <a
          href={LOFI_LIVE_URL}
          target="_blank"
          rel="noreferrer"
          className="underline decoration-white/20 hover:text-slate-300"
        >
          {c.creditLofi}
        </a>
        <a
          href={SPOTIFY_PLAYLIST_URL}
          target="_blank"
          rel="noreferrer"
          className="underline decoration-white/20 hover:text-slate-300"
        >
          {c.creditSpotify}
        </a>
      </div>
    </div>
  );
}
