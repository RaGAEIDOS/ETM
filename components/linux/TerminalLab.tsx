"use client";

/**
 * Terminal Lab — a SIMULATED shell running entirely in the browser.
 * The engine (lib/linux/shell) keeps all state in memory: it never spawns
 * a process, never touches the network, the repo, or the learner's machine.
 * Challenges validate the FINAL STATE of the virtual filesystem (or the last
 * command's output) — never the exact commands typed.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { useCopy } from "@/lib/i18n/context";
import { useProgressStore } from "@/lib/progress/store";
import { trackEvent } from "@/lib/progress/store";
import type { LinuxVideo } from "@/lib/linux-videos";
import { challengesForSection, type LinuxChallenge } from "@/lib/linux/shell/challenges";
import { runShellInput, SIM_COMMAND_NAMES } from "@/lib/linux/shell/shell";
import type { ShellState } from "@/lib/linux/shell/types";
import { absPath, isDir, listDir, freshShellState } from "@/lib/linux/shell/vfs";
import {
  CheckCircle2,
  Lightbulb,
  RotateCcw,
  Eye,
  Copy,
  Check,
  Terminal,
  ShieldCheck,
  Keyboard,
  FlaskConical,
} from "lucide-react";

const COPY = {
  ar: {
    sectionTitle: "معمل الطرفية",
    simulated: "محاكاة كاملة داخل المتصفح — لا يُنفذ أي أمر حقيقي على جهازك.",
    pick: "اختر التحدي",
    goal: "المطلوب",
    check: "تحقق من الحل",
    reset: "إعادة البدء",
    hint: "تلميح",
    showHint: "أظهر تلميحًا",
    solution: "حل مقترح",
    showSolution: "أظهر حلًا مقترحًا",
    hideSolution: "إخفاء الحل",
    attemptsLeft: (n: string) => `محاولات التحقق الفاشلة: ${n}`,
    needMore: "لم تكتمل الشروط بعد — راجع الحل أو تلميحًا آخر.",
    solved: "تحدي مُنجَز — أحسنت!",
    freeplay: "لا توجد تحديات لهذا القسم بعد — يمكنك تجربة أي أمر بحرية.",
    cheatTitle: "أوامر ومصطلحات هذا الدرس",
    cheatEmpty: "ستتوفر أوامر هذا الدرس لاحقًا.",
    copyTranscript: "نسخ المخرجات",
    copied: "نُسخت",
    prompt: "ابدأ الكتابة… مثال: ls ثم Enter",
  },
  en: {
    sectionTitle: "Terminal Lab",
    simulated: "Fully simulated in your browser — no real command ever runs on your machine.",
    pick: "Pick a challenge",
    goal: "Goal",
    check: "Check my work",
    reset: "Reset",
    hint: "Hint",
    showHint: "Show a hint",
    solution: "One possible solution",
    showSolution: "Show one possible solution",
    hideSolution: "Hide solution",
    attemptsLeft: (n: string) => `Failed check attempts: ${n}`,
    needMore: "Not quite — try another hint or inspect the goal.",
    solved: "Challenge complete — well done!",
    freeplay: "No challenges for this section yet — explore freely.",
    cheatTitle: "Commands & terms for this lesson",
    cheatEmpty: "Commands for this lesson are coming soon.",
    copyTranscript: "Copy transcript",
    copied: "Copied",
    prompt: "Type a command… e.g. ls then Enter",
  },
} as const;

interface Line {
  id: number;
  kind: "in" | "out" | "err" | "info";
  text: string;
}

const trimOutput = (s: string) => s.replace(/\n+$/, "");

export default function TerminalLab({ video }: { video: LinuxVideo }) {
  const c = useCopy(COPY);
  const { file } = useProgressStore();
  const challenges = useMemo(() => challengesForSection(video.section), [video.section]);
  const [selectedId, setSelectedId] = useState<string | null>(challenges[0]?.id ?? null);
  const challenge: LinuxChallenge | null = challenges.find((ch) => ch.id === selectedId) ?? null;

  const fsRef = useRef<ShellState>(challenges[0]?.setup() ?? freshShellState());
  const idRef = useRef(1);
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [hintsShown, setHintsShown] = useState(0);
  const [solutionShown, setSolutionShown] = useState(false);
  const [historyIdx, setHistoryIdx] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const push = (kind: Line["kind"], text: string) =>
    setLines((prev) => [...prev, { id: idRef.current++, kind, text }].slice(-400));

  const boot = (ch: LinuxChallenge | null) => {
    fsRef.current = ch ? ch.setup() : freshShellState();
    setLines([]);
    setInput("");
    setAttempts(0);
    setHintsShown(0);
    setSolutionShown(false);
    setHistoryIdx(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  // Boot on mount and whenever the selected challenge changes.
  useEffect(() => {
    boot(challenge);
    if (challenge) push("info", `${challenge.title} — ${challenge.goal}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  // Auto-scroll the transcript.
  useEffect(() => {
    const el = outputRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const solved = !!challenge && file.events.some(
    (e) =>
      e.track === "linux" &&
      e.type === "exercise_run" &&
      (e.payload as Record<string, unknown> | undefined)?.exerciseId === challenge.id &&
      (e.payload as Record<string, unknown> | undefined)?.success === true
  );

  const run = (raw: string) => {
    const line = raw.trim();
    if (!line) return;
    if (!fsRef.current) return;
    push("in", `$ ${line}`);
    const result = runShellInput(fsRef.current, line);
    if (fsRef.current.cleared) {
      fsRef.current.cleared = false;
      setLines([]);
      return;
    }
    if (result.stdout) push("out", trimOutput(result.stdout));
    if (result.stderr) push("err", trimOutput(result.stderr));
    setHistoryIdx(null);
  };

  const check = () => {
    if (!challenge || !fsRef.current) return;
    const ok = challenge.check({ fs: fsRef.current, lastOutput: fsRef.current.lastOutput });
    trackEvent("linux", "exercise_run", {
      itemId: video.id,
      topic: "linux-2021",
      payload: { success: ok, exerciseId: challenge.id },
    });
    if (ok) {
      push("info", `✓ ${c.solved}`);
    } else {
      setAttempts((n) => n + 1);
      push("err", c.needMore);
    }
  };

  const reset = () => boot(challenge);

  const completePath = (token: string): string[] => {
    if (!fsRef.current) return [];
    const slash = token.lastIndexOf("/");
    const dirPart = slash === -1 ? "" : token.slice(0, slash + 1);
    const base = slash === -1 ? token : token.slice(slash + 1);
    const dirAbs = dirPart ? absPath(fsRef.current, dirPart) : fsRef.current.cwd;
    const names = listDir(fsRef.current, dirAbs).map((e) => (isDir(e.node) ? `${e.name}/` : e.name));
    return names.filter((n) => n.startsWith(base)).map((n) => dirPart + n);
  };

  const commandNames = useMemo(() => [...SIM_COMMAND_NAMES].sort(), []);

  const complete = () => {
    const m = input.match(/(\S*)$/);
    const token = m ? m[1] : "";
    let candidates: string[] = [];
    if (!input.includes(" ") && !token.includes("/")) {
      candidates = commandNames.filter((n) => n.startsWith(token));
    } else {
      candidates = completePath(token);
    }
    if (candidates.length === 1) {
      setInput(input.slice(0, input.length - token.length) + candidates[0]);
    } else if (candidates.length > 1) {
      const prefix = candidates.reduce((a, b) => {
        let i = 0;
        while (i < a.length && i < b.length && a[i] === b[i]) i += 1;
        return a.slice(0, i);
      });
      if (prefix.length > token.length) setInput(input.slice(0, input.length - token.length) + prefix);
      push("out", candidates.join("  "));
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      run(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const h = fsRef.current?.history ?? [];
      if (h.length) {
        const next = historyIdx === null ? h.length - 1 : Math.max(0, historyIdx - 1);
        setHistoryIdx(next);
        setInput(h[next]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const h = fsRef.current?.history ?? [];
      if (historyIdx !== null) {
        const next = historyIdx + 1;
        if (next >= h.length) {
          setHistoryIdx(null);
          setInput("");
        } else {
          setHistoryIdx(next);
          setInput(h[next]);
        }
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      complete();
    } else if (e.ctrlKey && (e.key === "l" || e.key === "L")) {
      e.preventDefault();
      setLines([]);
    } else if (e.ctrlKey && (e.key === "c" || e.key === "C")) {
      e.preventDefault();
      push("in", `$ ${input}^C`);
      setInput("");
    }
  };

  const insert = (text: string) => {
    setInput((v) => v + text);
    inputRef.current?.focus();
  };

  const copyTranscript = async () => {
    const text = lines.map((l) => l.text).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div>
      {/* Heading + safety note */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-lg font-bold text-white">
          <FlaskConical className="h-5 w-5 text-amber-400" />
          {c.sectionTitle}
        </h3>
        <p className="flex items-center gap-1.5 text-[11px] leading-5 text-emerald-300/90">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          {c.simulated}
        </p>
      </div>

      {/* Challenge picker */}
      {challenges.length > 0 ? (
        <div className="mb-4 flex flex-wrap items-center gap-2" role="tablist" aria-label={c.pick}>
          {challenges.map((ch) => {
            const isActive = ch.id === selectedId;
            const isSolved = file.events.some(
              (e) =>
                e.track === "linux" &&
                e.type === "exercise_run" &&
                (e.payload as Record<string, unknown> | undefined)?.exerciseId === ch.id &&
                (e.payload as Record<string, unknown> | undefined)?.success === true
            );
            return (
              <button
                key={ch.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setSelectedId(ch.id)}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors ${
                  isActive
                    ? "border-amber-400/60 bg-amber-500/15 text-amber-200"
                    : "border-white/10 bg-white/[0.03] text-slate-400 hover:text-white"
                }`}
              >
                {isSolved && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                {ch.title}
              </button>
            );
          })}
        </div>
      ) : (
        <p className="mb-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-400">
          {c.freeplay}
        </p>
      )}

      {/* Goal + actions */}
      {challenge && (
        <div dir="rtl" className="mb-4 rounded-xl border border-amber-500/25 bg-amber-500/[0.07] p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-amber-400">{c.goal}</p>
              <p className="mt-1 leading-7 text-amber-50">{challenge.goal}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button type="button" onClick={check}
                className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-black text-ink-950 hover:bg-amber-400">
                {c.check}
              </button>
              <button type="button" onClick={reset} aria-label={c.reset}
                className="rounded-lg border border-white/15 p-2 text-slate-300 hover:text-white">
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Hints (progressive) */}
          <div className="mt-3 space-y-2">
            {challenge.hints.slice(0, hintsShown).map((h, i) => (
              <p key={i} dir="rtl" className="flex items-start gap-2 text-xs leading-6 text-cyan-100">
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                {h}
              </p>
            ))}
            <div className="flex flex-wrap items-center gap-2">
              {hintsShown < challenge.hints.length && (
                <button type="button" onClick={() => setHintsShown((n) => n + 1)}
                  className="text-[11px] font-bold text-cyan-300 hover:text-cyan-100">
                  {c.showHint} ({hintsShown}/{challenge.hints.length})
                </button>
              )}
              {attempts >= 2 && (
                <button type="button" onClick={() => setSolutionShown((v) => !v)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 hover:text-amber-100">
                  <Eye className="h-3.5 w-3.5" />
                  {solutionShown ? c.hideSolution : c.showSolution}
                </button>
              )}
              {attempts > 0 && <span className="text-[10px] text-slate-500">{c.attemptsLeft(String(attempts))}</span>}
            </div>
            {solutionShown && (
              <pre dir="ltr" className="overflow-x-auto rounded-lg border border-white/10 bg-black/50 p-3 font-mono text-xs text-emerald-200">
                {challenge.solution}
              </pre>
            )}
          </div>
          {solved && (
            <p className="mt-3 flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm font-bold text-emerald-300">
              <CheckCircle2 className="h-4 w-4" /> {c.solved}
            </p>
          )}
        </div>
      )}

      {/* Terminal + cheat sheet */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
        {/* Terminal (always LTR) */}
        <div dir="ltr" className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b1020] shadow-inner">
          {/* Title bar */}
          <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-2">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-500/70" />
              <span className="h-3 w-3 rounded-full bg-amber-400/70" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/70" />
              <span className="ms-2 flex items-center gap-1.5 font-mono text-xs text-slate-400">
                <Terminal className="h-3.5 w-3.5" /> learner@etm:~
              </span>
            </div>
            <button type="button" onClick={copyTranscript}
              aria-label={c.copyTranscript}
              className="rounded-md p-1.5 text-slate-500 hover:text-slate-200">
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>

          {/* Output */}
          <div ref={outputRef} role="log" aria-live="polite"
            className="h-64 overflow-y-auto px-4 py-3 font-mono text-[13px] leading-6 sm:h-72">
            {lines.map((l) =>
              l.kind === "in" ? (
                <p key={l.id} className="whitespace-pre-wrap break-words text-amber-300">{l.text}</p>
              ) : l.kind === "err" ? (
                <p key={l.id} className="whitespace-pre-wrap break-words text-rose-400">{l.text}</p>
              ) : l.kind === "info" ? (
                <p key={l.id} dir="auto" className="whitespace-pre-wrap break-words text-cyan-300">{l.text}</p>
              ) : (
                <p key={l.id} className="whitespace-pre-wrap break-words text-slate-300">{l.text}</p>
              )
            )}
            {lines.length === 0 && <p className="text-slate-600">$ ▊</p>}
          </div>

          {/* Input */}
          <form onSubmit={(e) => { e.preventDefault(); run(input); setInput(""); }}
            className="flex items-center gap-2 border-t border-white/10 bg-black/30 px-4 py-2.5">
            <span className="select-none font-mono text-sm font-bold text-emerald-400">$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              aria-label={c.prompt}
              placeholder={c.prompt}
              autoCapitalize="off"
              autoCorrect="off"
              autoComplete="off"
              spellCheck={false}
              className="min-w-0 flex-1 bg-transparent font-mono text-[13px] text-emerald-100 placeholder-slate-600 outline-none"
            />
          </form>

          {/* On-screen keys (mobile & desktop) */}
          <div className="flex flex-wrap items-center gap-1.5 border-t border-white/10 bg-white/[0.02] px-3 py-2">
            <Keyboard className="h-4 w-4 text-slate-600" aria-hidden />
            {[
              { label: "Tab", act: () => complete() },
              { label: "↑", act: () => onKeyDown({ key: "ArrowUp", preventDefault() {} } as React.KeyboardEvent<HTMLInputElement>) },
              { label: "↓", act: () => onKeyDown({ key: "ArrowDown", preventDefault() {} } as React.KeyboardEvent<HTMLInputElement>) },
              { label: "Ctrl+C", act: () => { push("in", `$ ${input}^C`); setInput(""); } },
              { label: "Ctrl+L", act: () => setLines([]) },
              { label: "/", act: () => insert("/") },
              { label: "|", act: () => insert(" | ") },
              { label: "~", act: () => insert("~") },
              { label: "-", act: () => insert("-") },
              { label: "*", act: () => insert("*") },
            ].map((k) => (
              <button key={k.label} type="button" onClick={k.act}
                className="min-w-9 rounded-md border border-white/10 bg-white/[0.04] px-2 py-1.5 font-mono text-xs text-slate-300 active:bg-white/10">
                {k.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cheat sheet built from this lesson's key terms */}
        <aside dir="rtl" className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
          <p className="text-xs font-black uppercase tracking-widest text-amber-400">{c.cheatTitle}</p>
          <ul className="mt-3 max-h-72 space-y-2 overflow-y-auto lg:max-h-80">
            {video.terms.length === 0 && <li className="text-xs text-slate-500">{c.cheatEmpty}</li>}
            {video.terms.map((t, i) => (
              <li key={i} className="rounded-lg border border-white/5 bg-white/[0.03] p-2.5">
                <code dir="ltr" className="font-mono text-xs font-bold text-emerald-300">{t.en}</code>
                <span dir="rtl" className="mt-0.5 block text-[11px] leading-5 text-slate-400">{t.ar}</span>
                {t.example && <code dir="ltr" className="mt-1 block font-mono text-[11px] text-slate-500">{t.example}</code>}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
