"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
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
  Info,
} from "lucide-react";

const DEFAULT_CODE = `#include <iostream>
using namespace std;

int main() {
    cout << "Hello World! I am a new C++ programmer" << endl;
    return 0;
}`;

const EXAMPLES: { name: string; code: string }[] = [
  { name: "Hello World", code: DEFAULT_CODE },
  {
    name: "Sum of two numbers",
    code: `#include <iostream>
using namespace std;

int main() {
    int a = 10, b = 25;
    int sum = a + b;
    cout << "Sum = " << sum << endl;
    return 0;
}`,
  },
  {
    name: "For loop",
    code: `#include <iostream>
using namespace std;

int main() {
    for (int i = 1; i <= 5; i++) {
        cout << "Line number " << i << endl;
    }
    return 0;
}`,
  },
  {
    name: "Functions",
    code: `#include <iostream>
using namespace std;

int add(int a, int b) {
    return a + b;
}

int main() {
    cout << "5 + 3 = " << add(5, 3) << endl;
    return 0;
}`,
  },
  {
    name: "Arrays",
    code: `#include <iostream>
using namespace std;

int main() {
    int numbers[] = {45, 12, 89, 34, 67};
    int maxVal = numbers[0];

    for (int i = 1; i < 5; i++) {
        if (numbers[i] > maxVal) {
            maxVal = numbers[i];
        }
    }

    cout << "Max value is: " << maxVal << endl;
    return 0;
}`,
  },
];

export default function Playground() {
  const params = useSearchParams();
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [compiling, setCompiling] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const c = params.get("code");
    if (c) setCode(c);
  }, [params]);

  const highlighted = useMemo(
    () => Prism.highlight(code, Prism.languages.cpp, "cpp"),
    [code]
  );

  const run = async () => {
    setCompiling(true);
    setOutput("");
    setError("");
    try {
      const res = await fetch("https://wandbox.org/api/compile.json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          compiler: "gcc-head",
          options: "warning,gnu++2a",
          "compiler-option-raw": "-std=c++2a",
          stdin: "",
          save: false,
        }),
      });
      if (!res.ok) throw new Error("Could not reach the server");
      const data = await res.json();
      const programOut = data.program_output || data.output || "";
      const programErr = data.program_error || "";
      const compilerErr = data.compiler_error || "";
      const compilerOut = data.compiler_output || "";

      const combinedOut = [programOut, compilerOut]
        .filter(Boolean)
        .join("\n")
        .trim();

      if (data.status !== "0" && !programOut) {
        setError(compilerErr || programErr || "An error occurred while compiling");
      } else {
        setOutput(combinedOut || "(Ran successfully — no output)");
        if (programErr) setError(programErr);
      }
    } catch {
      setError(
        "Could not reach the compilation service. Check your internet connection and try again."
      );
    } finally {
      setCompiling(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const download = () => {
    const blob = new Blob([code], { type: "text/x-c++src;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "main.cpp";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Editor */}
      <div className="rounded-2xl border border-white/10 bg-[#0d1117] overflow-hidden" dir="ltr">
        <div className="flex items-center justify-between gap-3 border-b border-white/5 bg-white/[0.03] px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-rose-500/70" />
              <span className="h-3 w-3 rounded-full bg-amber-400/70" />
              <span className="h-3 w-3 rounded-full bg-emerald-400/70" />
            </span>
            <span className="text-xs font-mono text-slate-400">main.cpp</span>
          </div>
          <div className="flex items-center gap-1.5">
            <select
              onChange={(e) => {
                const ex = EXAMPLES[Number(e.target.value)];
                if (ex) setCode(ex.code);
              }}
              className="rounded-lg bg-white/5 border border-white/10 px-2 py-1.5 text-xs text-slate-300 outline-none"
              defaultValue=""
              dir="ltr"
              aria-label="Ready examples"
            >
              <option value="" disabled>
                Ready examples
              </option>
              {EXAMPLES.map((ex, i) => (
                <option key={ex.name} value={i}>
                  {ex.name}
                </option>
              ))}
            </select>
            <button
              onClick={copy}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/10 transition-colors"
              title="Copy code"
              aria-label="Copy code"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
            <button
              onClick={download}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/10 transition-colors"
              title="Download main.cpp"
              aria-label="Download main.cpp"
            >
              <Download className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => {
                setCode(DEFAULT_CODE);
                setOutput("");
                setError("");
              }}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/10 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="relative">
          <Editor
            value={code}
            onValueChange={setCode}
            highlight={(c) => Prism.highlight(c, Prism.languages.cpp, "cpp")}
            padding={16}
            style={{
              fontFamily: "Fira Code, JetBrains Mono, Consolas, monospace",
              fontSize: 14,
              lineHeight: 1.6,
              minHeight: 360,
              background: "transparent",
            }}
            className="code-scroll"
          />
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-white/5 bg-white/[0.03] px-4 py-3">
          <span className="text-xs text-slate-500" dir="ltr">
            {code.split("\n").length} lines · {code.length} chars
          </span>
          <button
            onClick={run}
            disabled={compiling}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-l from-cyan-400 to-violet-500 px-5 py-3 sm:py-2.5 text-sm font-bold text-ink-950 hover:opacity-90 disabled:opacity-50 transition-opacity min-h-[48px]"
          >
            {compiling ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            {compiling ? "Compiling..." : "Run"}
          </button>
        </div>
      </div>

      {/* Output */}
      <div className="flex flex-col gap-4">
        <div className="flex-1 rounded-2xl border border-white/10 bg-[#0d1117] overflow-hidden">
          <div className="flex items-center gap-2 border-b border-white/5 bg-white/[0.03] px-4 py-2.5">
            <Terminal className="h-4 w-4 text-emerald-400" />
            <span className="text-xs text-slate-400">Output</span>
          </div>
          <div className="p-4 font-mono text-sm leading-7 min-h-[200px] max-h-[360px] overflow-auto">
            {error ? (
              <div className="flex items-start gap-2 text-rose-300" dir="auto">
                <AlertTriangle className="h-4 w-4 mt-1 shrink-0" />
                <pre className="whitespace-pre-wrap output-pre break-words">
                  {error}
                </pre>
              </div>
            ) : output ? (
              <pre
                dir="auto"
                className="whitespace-pre-wrap text-emerald-200 output-pre break-words"
              >
                {output}
              </pre>
            ) : (
              <span className="text-slate-600" dir="ltr">
                Press &quot;Run&quot; to see the program output here...
              </span>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/[0.05] p-5">
          <h4 className="flex items-center gap-2 font-bold text-cyan-300">
            <Info className="h-4 w-4" />
            About the playground
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-300 leading-6">
            <li className="flex gap-2">
              <span className="text-cyan-400">•</span>
              Compiles and runs real C++ through the free Wandbox service.
            </li>
            <li className="flex gap-2">
              <span className="text-cyan-400">•</span>
              Use{" "}
              <kbd
                className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs"
                dir="ltr"
              >
                Ctrl + Enter
              </kbd>{" "}
              to run quickly.
            </li>
            <li className="flex gap-2">
              <span className="text-cyan-400">•</span>
              Your code is sent to the service for compilation — nothing is
              stored on your device.
            </li>
            <li className="flex gap-2">
              <span className="text-cyan-400">•</span>
              For programs that need user input, use stdin — coming soon. For
              now, try examples that do not read input.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
