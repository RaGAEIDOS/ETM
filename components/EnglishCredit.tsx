import { GraduationCap, ChevronLeft } from "lucide-react";
import { ETM_ENGLISH_CREDIT } from "@/lib/english-videos";

export default function EnglishCredit() {
  return (
    <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.02] p-5 flex items-start gap-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
        <GraduationCap className="h-4 w-4" />
      </span>
      <div className="text-sm text-slate-400 leading-7">
        {ETM_ENGLISH_CREDIT}{" "}
        <a
          href="https://www.youtube.com/@ZAmericanEnglish"
          target="_blank"
          rel="noreferrer"
          className="text-emerald-400 hover:underline font-semibold inline-flex items-center gap-1"
        >
          @ZAmericanEnglish <ChevronLeft className="h-3 w-3 rotate-180" />
        </a>
      </div>
    </div>
  );
}
