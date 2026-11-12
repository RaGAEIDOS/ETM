import { GraduationCap, ExternalLink, PlayCircle, ListVideo, Scale } from "lucide-react";
import {
  CS50X_CHANNEL,
  CS50X_CHANNEL_HANDLE,
  CS50X_CREDIT,
  CS50X_PLAYLIST_URL,
  CS50X_LICENSE_URL,
  CS50X_CC_URL,
} from "@/lib/cs50x";

export default function Cs50xCredit({
  videoUrl,
  videoLabel,
  playlistLabel,
}: {
  /** Direct link to the original video, when rendering a lecture page. */
  videoUrl?: string;
  videoLabel?: string;
  playlistLabel?: string;
}) {
  return (
    <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400">
          <GraduationCap className="h-4 w-4" />
        </span>
        <div className="text-sm leading-7 text-slate-400">
          {CS50X_CREDIT}{" "}
          <a
            href={CS50X_CHANNEL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-rose-300 hover:underline"
          >
            {CS50X_CHANNEL_HANDLE} <ExternalLink className="h-3 w-3" />
          </a>
          <span className="mt-2 flex flex-wrap items-center gap-3 border-t border-white/5 pt-2 text-xs">
            <a
              href={CS50X_LICENSE_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 font-semibold text-slate-300 hover:text-white"
            >
              <Scale className="h-4 w-4 text-rose-400" />
              CC BY-NC-SA 4.0 — changes: none to lecture videos <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href={CS50X_CC_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-300"
            >
              creativecommons.org <ExternalLink className="h-3 w-3" />
            </a>
          </span>
          <span className="mt-2 flex flex-wrap items-center gap-3 border-t border-white/5 pt-2 text-xs">
              {videoUrl && (
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-semibold text-slate-300 hover:text-white"
                >
                  <PlayCircle className="h-4 w-4 text-rose-400" />
                  {videoLabel ?? "Watch the original lecture on YouTube"}
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
              <a
                href={CS50X_PLAYLIST_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-semibold text-slate-300 hover:text-white"
              >
                <ListVideo className="h-4 w-4 text-rose-400" />
                {playlistLabel ?? "CS50x Lectures playlist on YouTube"}
                <ExternalLink className="h-3 w-3" />
              </a>
          </span>
        </div>
      </div>
    </div>
  );
}
