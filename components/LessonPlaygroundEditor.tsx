"use client";

// Heavy child of <LessonPlayground> — imports Prism + Wandbox runner.
// Loaded ONLY via next/dynamic when the learner opens a Try-it block, so
// lesson pages do not pay for the editor until it is needed.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import {
  Play,
  RotateCcw,
  Copy,
  Check,
  Download,
  Terminal,
  AlertTriangle,
  Loader2,
  Lightbulb,
  Wand2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  compileCpp,
  outputsMatch,
} from "@/lib/wandbox";
import {
  loadSavedCode,
  saveCode,
  clearSavedCode,
  loadAttempts,
  bumpAttempts,
  loadHintsUnlocked,
  saveHintsUnlocked,
  type PlaygroundStorageContext,
} from "@/lib/lesson-playground";
import { loadProgress, saveProgress } from "@/lib/progress";

export interface LessonPlaygroundEditorProps {
  starterCode: string;
  title?: string;
  stdinDefault?: string;
  expectedOutput?: string;
  hints?: string[];
  solution?: string;
  exercise?: string;
  lessonTitle?: string;
  storage: PlaygroundStorageContext & { practiceLessonId?: string };
}

export default function LessonPlaygroundEditor({
  starterCode,
  title,
  stdinDefault = "",
  expectedOutput,
  hints = [],
  solution,
  exercise,
  lessonTitle,
  storage,
}: LessonPlaygroundEditorProps) {
  const storageId = useMemo(
    () => ({
      scope: storage.scope,
      id: storage.id,
      blockHash: storage.blockHash,
    }),
    [storage.scope, storage.id, storage.blockHash]
  );

  const [code, setCode] = useState<string>(() => starterCode);
  const [loadedSaved, setLoadedSaved] = useState(false);
  const [hasSavedEdit, setHasSavedEdit] = useState(false);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [exitInfo, setExitInfo] = useState<{ code: string; timeMs?: number } | null>(null);
  const [stdin, setStdin] = useState(stdinDefault);
  const [stdinOpen, setStdinOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [hintsShown, setHintsShown] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [checkState, setCheckState] = useState<
    null | { pass: boolean }
  >(null);
  const [explainOpen, setExplainOpen] = useState(false);
  const [explainLoading, setExplainLoading] = useState(false);
  const [explainText, setExplainText] = useState("");
  const lastRunAtRef = useRef(0);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // hydrate persisted edit + stats
  useEffect(() => {
    const saved = loadSavedCode(storageId);
    if (saved != null) {
      setCode(saved);
      setHasSavedEdit(saved !== starterCode);
    }
    setAttempts(loadAttempts(storageId));
    setHintsShown(loadHintsUnlocked(storageId));
    setLoadedSaved(true);
  }, [storageId, starterCode]);

  // persist edits (debounced)
  useEffect(() => {
    if (!loadedSaved) return;
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      saveCode(storageId, code);
    }, 600);
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [code, storageId, loadedSaved]);

  const markPracticeDone = useCallback(() => {
    if (storage.scope !== "learn" || !storage.practiceLessonId) return;
    try {
      const map = loadProgress();
      map[storage.practiceLessonId] = true;
      saveProgress(map);
    } catch {
      /* progress storage unavailable — never block running */
    }
  }, [storage.practiceLessonId, storage.scope]);

  const run = useCallback(async () => {
    // debounce + rate-limit guard
    const now = Date.now();
    if (now - lastRunAtRef.current < 800) return;
    if (running) return;
    lastRunAtRef.current = now;
    setRunning(true);
    setOutput("");
    setError("");
    setCheckState(null);
    setExplainOpen(false);
    setExplainText("");
    try {
      const result = await compileCpp(code, stdin);
      const nextAttempts = bumpAttempts(storageId);
      setAttempts(nextAttempts);
      setExitInfo({ code: result.status || "?", timeMs: result.timeMs });

      if (result.ok) {
        const out =
          result.stdout && result.stdout.trim()
            ? result.stdout
            : "(شُغّل بنجاح — بدون إخراج)";
        setOutput(out);
        setError(result.programError || "");
        if (expectedOutput != null) {
          const pass = outputsMatch(result.stdout, expectedOutput);
          setCheckState({ pass });
          if (pass) markPracticeDone();
        } else {
          markPracticeDone();
        }
      } else {
        const errText =
          result.error || result.compilerError || result.programError || "";
        setError(errText.trim() || "خطأ أثناء الترجمة أو التنفيذ.");
      }
    } finally {
      setRunning(false);
    }
  }, [code, stdin, running, storageId, expectedOutput, markPracticeDone]);

  const reset = useCallback(() => {
    setCode(starterCode);
    clearSavedCode(storageId);
    setHasSavedEdit(false);
    setOutput("");
    setError("");
    setExitInfo(null);
    setCheckState(null);
    setExplainOpen(false);
    setExplainText("");
  }, [starterCode, storageId]);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }, [code]);

  const download = useCallback(() => {
    try {
      const blob = new Blob([code], { type: "text/x-c++src;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "main.cpp";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      /* ignore */
    }
  }, [code]);

  const unlockHint = useCallback(
    (index: number) => {
      const next = Math.max(hintsShown, index + 1);
      setHintsShown(next);
      saveHintsUnlocked(storageId, next);
    },
    [hintsShown, storageId]
  );

  const explainError = useCallback(async () => {
    if (explainLoading) return;
    setExplainLoading(true);
    setExplainText("");
    try {
      const res = await fetch("/api/explain-error", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          error,
          lessonTitle: lessonTitle || title || "درس C++",
        }),
      });
      if (res.status === 503) {
        setExplainText("Miku (مساعد الذكاء) مش مُفعّل على المنصة دي بعد — جرّب كمان شوية.");
        return;
      }
      if (res.status === 429) {
        setExplainText("طلبات كتير مرة واحدة — استنى دقيقة وجرب تاني.");
        return;
      }
      const data = await res.json().catch(() => null);
      if (data?.hint) {
        setExplainText(data.hint);
      } else {
        setExplainText("لم يصل رد واضح من Miku — حاول تاني.");
      }
    } catch {
      setExplainText("لم يصل رد من Miku — تأكد من اتصالك بالإنترنت.");
    } finally {
      setExplainLoading(false);
    }
  }, [code, error, lessonTitle, title, explainLoading]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      run();
    }
  };

  const visibleHints = hints.slice(0, hintsShown);
  const canShowSolution = attempts >= 2 && !!solution;

  return (
    <div className="mt-4 rounded-xl border border-cyan-500/25 bg-[#0d1117] overflow-hidden" dir="ltr">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-white/5 bg-white/[0.04] px-4 py-2.5">
        <span className="text-xs font-mono text-slate-400 truncate min-w-0">
          {title || "main.cpp"}
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          <button onClick={copy} aria-label="نسخ الكود"
            className="flex items-center justify-center rounded-lg px-2.5 py-2 text-slate-300 hover:bg-white/10 transition-colors min-h-[40px] min-w-[40px]">
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
          </button>
          <button onClick={download} aria-label="تنزيل main.cpp"
            className="flex items-center justify-center rounded-lg px-2.5 py-2 text-slate-300 hover:bg-white/10 transition-colors min-h-[40px] min-w-[40px]">
            <Download className="h-4 w-4" />
          </button>
          <button onClick={reset} aria-label="استعادة الكود الأصلي"
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10 transition-colors min-h-[40px]">
            <RotateCcw className="h-4 w-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Editor */}
      <div onKeyDown={onKeyDown}>
        <Editor
          value={code}
          onValueChange={setCode}
          highlight={(v) => Prism.highlight(v, Prism.languages.cpp, "cpp")}
          padding={14}
          style={{
            fontFamily: "Fira Code, JetBrains Mono, Consolas, monospace",
            fontSize: 13,
            lineHeight: 1.6,
            minHeight: 220,
            background: "transparent",
          }}
          className="code-scroll"
        />
      </div>

      {/* stdin */}
      <div className="border-t border-white/5">
        <button
          onClick={() => setStdinOpen((v) => !v)}
          aria-expanded={stdinOpen}
          aria-controls="stdin-box"
          className="flex w-full items-center justify-between gap-2 px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
          dir="rtl"
        >
          <span>stdin — للبرامج التي فيها cin {stdinOpen ? "" : "(حسب البرنامج)"}</span>
          {stdinOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {stdinOpen && (
          <textarea
            id="stdin-box"
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
            rows={3}
            spellCheck={false}
            placeholder={"اكتب المدخلات هنا — مثلاً:\n10\n20"}
            aria-label="مدخلات البرنامج stdin"
            className="block w-full border-t border-white/5 bg-transparent px-4 py-3 font-mono text-xs text-slate-200 outline-none resize-y min-h-[64px] placeholder:text-slate-600"
          />
        )}
      </div>

      {/* Action bar */}
      <div className="flex flex-col gap-3 border-t border-white/5 bg-white/[0.04] px-4 py-3">
        {exercise && (
          <p className="text-[11px] leading-6 text-slate-400 whitespace-pre-wrap" dir="rtl">
            <span className="font-bold text-amber-300">التمرين: </span>{exercise}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500" dir="ltr">
            <span>{code.split("\n").length} lines</span>
            <span>·</span>
            <span>{attempts} runs</span>
            {exitInfo && (
              <>
                <span>·</span>
                <span className={exitInfo.code === "0" ? "text-emerald-400" : "text-rose-400"}>
                  exit {exitInfo.code}
                </span>
                {typeof exitInfo.timeMs === "number" && <span className="text-slate-600">· {exitInfo.timeMs}ms</span>}
              </>
            )}
          </div>
          <button
            onClick={run}
            disabled={running}
            aria-label="شغّل الكود"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-l from-cyan-400 to-violet-500 px-6 py-3 text-sm font-black text-ink-950 hover:opacity-90 disabled:opacity-50 transition-opacity min-h-[46px]"
          >
            {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            {running ? "جارٍ…" : "Run"}
          </button>
        </div>

        {/* outputs */}
        {(output || error) && (
          <div className="rounded-xl border border-white/10 bg-black/40 p-3" role="status" aria-live="polite">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 mb-2">
              <Terminal className="h-3.5 w-3.5 text-emerald-400" /> OUTPUT
            </div>
            {output && (
              <pre className="whitespace-pre-wrap font-mono text-[11.5px] leading-6 text-emerald-200 break-words max-h-56 overflow-auto">
                {output}
              </pre>
            )}
            {error && (
              <div className={`flex items-start gap-2 text-rose-300 ${output ? "mt-2" : ""}`} dir="auto">
                <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                <pre className="whitespace-pre-wrap font-mono text-[11.5px] leading-6 break-words max-h-56 overflow-auto">
                  {error}
                </pre>
              </div>
            )}
            {checkState && (
              <div
                className={`mt-2 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-bold ${
                  checkState.pass
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                    : "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                }`}
              >
                {checkState.pass ? "✓ الناتج مطابق للمطلوب — أحسنت!" : "✗ الناتج مختلف عن المطلوب راجع مرة أخرى"}
              </div>
            )}
          </div>
        )}

        {/* Miku explain */}
        {error && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={explainError}
              disabled={explainLoading}
              aria-label="اشرح لي الخطأ بمساعدة Miku"
              className="inline-flex items-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-xs font-bold text-violet-300 hover:bg-violet-500/20 disabled:opacity-50 transition-colors"
            >
              {explainLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
              اشرح لي الخطأ
            </button>
            {explainText && (
              <p className="w-full rounded-xl border border-violet-500/20 bg-violet-500/[0.06] px-3 py-2 text-[11.5px] leading-7 text-violet-100 whitespace-pre-wrap" dir="rtl">
                {explainText}
              </p>
            )}
          </div>
        )}

        {/* hints + solution */}
        {hints.length > 0 && (
          <div className="space-y-2">
            {visibleHints.map((h, i) => (
              <p key={i} className="rounded-xl border border-amber-500/20 bg-amber-500/[0.07] px-3 py-2 text-[11.5px] leading-7 text-amber-100" dir="rtl">
                <span className="font-black text-amber-300">تلميح {i + 1}: </span>{h}
              </p>
            ))}
            {hintsShown < hints.length && (
              <button
                onClick={() => unlockHint(hintsShown)}
                className="inline-flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-colors"
              >
                <Lightbulb className="h-4 w-4" />
                اعرض تلميح {hintsShown + 1} من {hints.length}
              </button>
            )}
          </div>
        )}
        {canShowSolution && (
          <div>
            <button
              onClick={() => setShowSolution((v) => !v)}
              className="text-xs font-bold text-slate-400 hover:text-slate-200 underline underline-offset-4"
            >
              {showSolution ? "إخفاء الحل" : "اعرض الحل"}
            </button>
            {showSolution && (
              <pre className="code-scroll mt-2 overflow-auto rounded-xl border border-white/10 bg-black/40 p-3 font-mono text-[11.5px] leading-6 text-slate-200" dir="ltr">
                {solution}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
