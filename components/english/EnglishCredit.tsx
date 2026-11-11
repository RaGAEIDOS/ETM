import { GraduationCap, ExternalLink, PlayCircle, ListVideo } from "lucide-react";
import { ETM_ENGLISH_CHANNEL, ETM_ENGLISH_CREDIT } from "@/lib/english-videos";

export default function EnglishCredit({
  videoUrl,
  videoLabel,
  playlistUrl,
  playlistLabel,
}: {
  /** Direct link to the original video, when rendering a video page. */
  videoUrl?: string;
  videoLabel?: string;
  /** Direct link to the playlist, when rendering a video page. */
  playlistUrl?: string;
  playlistLabel?: string;
}) {
  return (
    <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
          <GraduationCap className="h-4 w-4" />
        </span>
        <div className="text-sm leading-7 text-slate-400">
          {ETM_ENGLISH_CREDIT}{" "}
          <a
            href={ETM_ENGLISH_CHANNEL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-emerald-400 hover:underline"
          >
            @ZAmericanEnglish <ExternalLink className="h-3 w-3" />
          </a>
          {(videoUrl || playlistUrl) && (
            <span className="mt-2 flex flex-wrap items-center gap-3 border-t border-white/5 pt-2 text-xs">
              {videoUrl && (
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-semibold text-slate-300 hover:text-white"
                >
                  <PlayCircle className="h-4 w-4 text-emerald-400" />
                  {videoLabel ?? "شاهد الفيديو الأصلي"}
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
              {playlistUrl && (
                <a
                  href={playlistUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-semibold text-slate-300 hover:text-white"
                >
                  <ListVideo className="h-4 w-4 text-emerald-400" />
                  {playlistLabel ?? "قائمة التشغيل على YouTube"}
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
