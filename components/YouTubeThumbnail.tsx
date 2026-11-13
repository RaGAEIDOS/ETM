"use client";

/**
 * Official YouTube thumbnail for a video id.
 *
 * - Uses the public i.ytimg.com pattern only (hqdefault, then mqdefault as a
 *   fallback for videos that have no HQ frame) — never re-hosts an image.
 * - Lazily loaded everywhere, as required for the track thumbnails.
 * - The fallback runs once, so a missing thumbnail cannot loop.
 */

import { useState } from "react";
import { youtubeThumbnailUrl } from "@/lib/youtube";

export default function YouTubeThumbnail({
  youtubeId,
  alt,
  className = "",
  width = 480,
  height = 360,
  fallbackToMq = true,
}: {
  youtubeId: string;
  /** Meaningful description of the video, not the play-button action. */
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fallbackToMq?: boolean;
}) {
  const [quality, setQuality] = useState<"hq" | "mq">("hq");

  if (!/^[\w-]{11}$/.test(youtubeId)) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element -- remote YouTube CDN image, not a local asset
    <img
      src={youtubeThumbnailUrl(youtubeId, quality)}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      className={className}
      onError={() => {
        if (quality === "hq" && fallbackToMq) setQuality("mq");
      }}
    />
  );
}
