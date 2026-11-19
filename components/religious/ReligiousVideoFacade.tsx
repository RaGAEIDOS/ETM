"use client";

import { PlayCircle } from "lucide-react";
import { useState } from "react";

const COPY = {
  ar: {
    play: "شغّل الفيديو من YouTube",
    note: "لا يُحمّل أي شيء من YouTube قبل الضغط.",
  },
  en: {
    play: "Load the video from YouTube",
    note: "Nothing is loaded from YouTube before you click.",
  },
} as const;

/**
 * Click-to-load facade for verified official videos. Lesson data currently has
 * no youtubeId, so this component is dormant until real videos are supplied.
 */
export default function ReligiousVideoFacade({
  youtubeId,
  title,
  locale,
}: {
  youtubeId: string;
  title: string;
  locale: "ar" | "en";
}) {
  const [started, setStarted] = useState(false);
  const c = COPY[locale];

  if (started) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1&playsinline=1&autoplay=0`}
          title={title}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-ink-900/60 p-6 text-center">
      <PlayCircle className="mx-auto h-10 w-10 text-amber-400" aria-hidden />
      <button
        type="button"
        onClick={() => setStarted(true)}
        className="mt-3 inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-amber-400 to-orange-500 px-5 py-2.5 text-sm font-black text-ink-950 hover:opacity-90"
      >
        {c.play}
      </button>
      <p className="mt-2 text-xs text-slate-500">{c.note}</p>
    </div>
  );
}
