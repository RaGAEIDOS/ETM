import { GraduationCap, ExternalLink, PlayCircle, ListVideo, Globe2 } from "lucide-react";
import {
  ETM_PA_CHANNEL,
  ETM_PA_CREDIT,
  ETM_PA_CREDIT_AR,
} from "@/lib/programmingadvices-videos";

/**
 * Required credit + non-affiliation notice for every Programming Advices page.
 * Links only to the official channel / playlist / video / course page — never
 * to re-hosted media or login-only material.
 */
export default function PACredit({
  videoUrl,
  videoLabel,
  playlistUrl,
  playlistLabel,
  officialPageUrl,
  officialPageLabel,
}: {
  videoUrl?: string;
  videoLabel?: string;
  playlistUrl?: string;
  playlistLabel?: string;
  officialPageUrl?: string;
  officialPageLabel?: string;
}) {
  return (
    <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
          <GraduationCap className="h-4 w-4" />
        </span>
        <div className="min-w-0 text-sm leading-7 text-slate-400">
          <p dir="ltr" className="text-start font-semibold text-slate-300">
            {ETM_PA_CREDIT}
          </p>
          <p className="mt-1" dir="rtl">
            {ETM_PA_CREDIT_AR}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-bold">
            <a
              href={ETM_PA_CHANNEL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-amber-300 hover:text-amber-200"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Programming Advices · YouTube
            </a>
            {playlistUrl && (
              <a
                href={playlistUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-amber-300 hover:text-amber-200"
              >
                <ListVideo className="h-3.5 w-3.5" />
                {playlistLabel ?? "Playlist"}
              </a>
            )}
            {videoUrl && (
              <a
                href={videoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-amber-300 hover:text-amber-200"
              >
                <PlayCircle className="h-3.5 w-3.5" />
                {videoLabel ?? "Watch on YouTube"}
              </a>
            )}
            {officialPageUrl && (
              <a
                href={officialPageUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-amber-300 hover:text-amber-200"
              >
                <Globe2 className="h-3.5 w-3.5" />
                {officialPageLabel ?? "Official course page"}
              </a>
            )}
          </div>
          <p className="mt-3 text-[11px] leading-5 text-slate-500">
            Personal, non-commercial learning only. ETM never downloads, mirrors,
            re-hosts or publishes the author&apos;s videos, transcripts, slides or
            exercises; official PDFs stay on the author&apos;s platform.
          </p>
          <p className="mt-1 text-[11px] leading-5 text-slate-500" dir="rtl">
            للاستخدام الشخصي غير التجاري فقط. لا تقوم ETM بتنزيل الفيديوهات أو
            إعادة رفعها أو نشر نصوصها أو شرائحها أو تمارينها، وتبقى ملفات PDF
            الرسمية على منصة المؤلف.
          </p>
        </div>
      </div>
    </div>
  );
}
