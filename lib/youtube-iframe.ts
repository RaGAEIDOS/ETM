/**
 * Minimal typings + one-time loader for the YouTube IFrame Player API.
 *
 * The existing video facades each carry their own private loader; this helper
 * is for the Pomodoro music player. It never augments `Window` globally (the
 * facade modules already declare `Window.YT` with a narrower shape), so the
 * namespace is accessed through a local cast instead.
 */

export interface YouTubePlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  setVolume: (volume: number) => void;
  mute: () => void;
  unMute: () => void;
  getPlayerState: () => number;
  destroy: () => void;
}

export interface YouTubePlayerEvent {
  target: YouTubePlayer;
  data: number;
}

export interface YouTubePlayerOptions {
  videoId: string;
  /** Privacy-enhanced host, e.g. https://www.youtube-nocookie.com */
  host?: string;
  playerVars?: Record<string, number | string>;
  events?: {
    onReady?: (event: YouTubePlayerEvent) => void;
    onStateChange?: (event: YouTubePlayerEvent) => void;
    onError?: (event: YouTubePlayerEvent) => void;
  };
}

export interface YouTubeNamespace {
  Player: new (
    element: HTMLElement | string,
    options: YouTubePlayerOptions
  ) => YouTubePlayer;
}

type YouTubeWindow = {
  YT?: YouTubeNamespace;
  onYouTubeIframeAPIReady?: () => void;
};

let apiPromise: Promise<boolean> | null = null;

/**
 * Loads https://www.youtube.com/iframe_api once per page lifetime.
 * Resolves `false` when the environment cannot reach YouTube.
 */
export function loadYouTubeIframeApi(timeoutMs = 15000): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  const w = window as YouTubeWindow;
  if (w.YT?.Player) return Promise.resolve(true);
  if (apiPromise) return apiPromise;

  apiPromise = new Promise<boolean>((resolve) => {
    let settled = false;
    const finish = (ok: boolean) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      if (!ok) apiPromise = null;
      resolve(ok);
    };
    const timer = window.setTimeout(() => finish(false), timeoutMs);
    const previous = w.onYouTubeIframeAPIReady;
    w.onYouTubeIframeAPIReady = () => {
      previous?.();
      finish(Boolean(w.YT?.Player));
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => finish(false);
    document.head.appendChild(script);
  });

  return apiPromise;
}
