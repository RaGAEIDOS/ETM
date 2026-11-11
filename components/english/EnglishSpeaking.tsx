"use client";

/**
 * Speaking tab (optional): browser speech recognition (en-US) when the
 * platform supports it, pronunciation check against the video's key
 * terms. Nothing is recorded, uploaded or stored — all processing is
 * local to the browser. Graceful "not supported" card elsewhere.
 */

import { useEffect, useRef, useState } from "react";
import { useCopy, useLocale } from "@/lib/i18n/context";
import { normalizePracticeAnswer } from "@/lib/english-videos";
import type { EnglishKeyTerm } from "@/lib/english-videos";
import { Mic, Volume2, Square, CheckCircle2, XCircle, Info } from "lucide-react";

type RecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: { results: { [k: number]: { [j: number]: { transcript: string } } } }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
};
type RecognitionCtor = new () => RecognitionLike;

const COPY = {
  ar: {
    title: "تحدث — تدريب النطق",
    intro: "اختر مصطلحًا، استمع إليه، ثم انطقه. يعمل كل شيء داخل متصفحك — لا يُسجَّل شيء ولا يُرسل.",
    notSupported: "التعرف على الصوت غير مدعوم في هذا المتصفح. جرّب Chrome أو Edge، أو تخطَّ هذه الخطوة.",
    listenFirst: "استمع",
    tapToSpeak: "انطق الآن",
    stop: "إيقاف",
    listening: "يستمع إليك…",
    heard: "سمعناك تقول",
    good: "نطق ممتاز!",
    tryAgain: "قريب — حاول مرة أخرى",
    pickTerm: "اختر مصطلحًا لتتدربه",
  },
  en: {
    title: "Speak — pronunciation drill",
    intro: "Pick a term, listen to it, then say it. Everything stays inside your browser — nothing is recorded or sent anywhere.",
    notSupported: "Speech recognition is not supported in this browser. Try Chrome or Edge, or skip this step.",
    listenFirst: "Listen",
    tapToSpeak: "Speak now",
    stop: "Stop",
    listening: "Listening…",
    heard: "We heard you say",
    good: "Great pronunciation!",
    tryAgain: "Close — try again",
    pickTerm: "Pick a term to drill",
  },
} as const;

export default function EnglishSpeaking({ terms }: { terms: EnglishKeyTerm[] }) {
  const c = useCopy(COPY);
  const locale = useLocale();
  const isAr = locale === "ar";
  const [selected, setSelected] = useState(0);
  const [supported, setSupported] = useState<boolean | null>(null);
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState<string | null>(null);
  const recognitionRef = useRef<RecognitionLike | null>(null);

  useEffect(() => {
    const w = window as unknown as {
      SpeechRecognition?: RecognitionCtor;
      webkitSpeechRecognition?: RecognitionCtor;
    };
    setSupported(Boolean(w.SpeechRecognition ?? w.webkitSpeechRecognition));
    return () => {
      try {
        recognitionRef.current?.stop();
      } catch {
        /* ignore */
      }
    };
  }, []);

  const speak = (text: string) => {
    try {
      const synth = window.speechSynthesis;
      if (!synth) return;
      synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US";
      u.rate = 0.9;
      synth.speak(u);
    } catch {
      /* ignore */
    }
  };

  const listen = () => {
    const w = window as unknown as {
      SpeechRecognition?: RecognitionCtor;
      webkitSpeechRecognition?: RecognitionCtor;
    };
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Ctor) return;
    const recognition = new Ctor();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    setHeard(null);
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript ?? "";
      setHeard(transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  };

  const stop = () => {
    try {
      recognitionRef.current?.stop();
    } catch {
      /* ignore */
    }
    setListening(false);
  };

  const current = terms[selected];
  const normalizedTarget = current ? normalizePracticeAnswer(current.en) : "";
  const normalizedHeard = heard ? normalizePracticeAnswer(heard) : null;
  const verdict =
    normalizedHeard === null || !current
      ? null
      : normalizedHeard === normalizedTarget ||
          normalizedHeard.split(" ").includes(normalizedTarget) ||
          normalizedTarget.split(" ").every((w) => normalizedHeard.includes(w))
        ? "good"
        : "close";

  if (terms.length === 0) return null;

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <h3 className="flex items-center gap-2 text-lg font-bold text-white">
          <Mic className="h-5 w-5 text-emerald-400" />
          {c.title}
        </h3>
        <p className="text-xs text-slate-500">{isAr ? "اختياري" : "Optional"}</p>
      </div>
      <p className="mb-4 text-sm text-slate-400 leading-7">{c.intro}</p>

      {supported === false && (
        <div className="mb-4 flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200 leading-7">
          <Info className="mt-0.5 h-5 w-5 shrink-0" />
          {c.notSupported}
        </div>
      )}

      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">{c.pickTerm}</p>
      <div dir="ltr" className="mb-4 flex flex-wrap gap-2">
        {terms.map((term, i) => (
          <button
            key={`${term.en}-${i}`}
            type="button"
            onClick={() => {
              setSelected(i);
              setHeard(null);
            }}
            aria-pressed={selected === i}
            className={`rounded-lg border px-3 py-1.5 text-sm font-semibold transition-colors ${
              selected === i
                ? "border-emerald-400 bg-emerald-500/20 text-emerald-300"
                : "border-white/10 bg-white/[0.04] text-slate-300 hover:text-white"
            }`}
          >
            {term.en}
          </button>
        ))}
      </div>

      {current && (
        <div dir="ltr" className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-3xl font-black text-white">{current.en}</p>
          <p dir="rtl" className="mt-1 text-sm text-slate-400">{current.ar}</p>
          {current.example && (
            <p className="mt-3 text-sm text-slate-300">“{current.example.en}”</p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => speak(current.en)}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-slate-200 hover:text-white"
            >
              <Volume2 className="h-4 w-4" />
              {c.listenFirst}
            </button>
            {supported !== false && (
              <button
                type="button"
                onClick={listening ? stop : listen}
                className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-black transition-colors ${
                  listening
                    ? "bg-rose-500 text-white hover:bg-rose-400"
                    : "bg-emerald-500 text-ink-950 hover:bg-emerald-400"
                }`}
              >
                {listening ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                {listening ? c.stop : c.tapToSpeak}
              </button>
            )}
          </div>
          {listening && (
            <p className="mt-3 flex items-center gap-2 text-sm text-emerald-300">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />
              {c.listening}
            </p>
          )}
          {heard !== null && (
            <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">{c.heard}</p>
              <p dir="ltr" className="mt-1 text-lg font-bold text-white">{heard}</p>
              {verdict && (
                <p
                  className={`mt-2 flex items-center gap-2 text-sm font-bold ${
                    verdict === "good" ? "text-emerald-400" : "text-amber-300"
                  }`}
                >
                  {verdict === "good" ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      {c.good}
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4" />
                      {c.tryAgain}
                    </>
                  )}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
