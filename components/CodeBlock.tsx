"use client";

import { useState } from "react";
import Link from "next/link";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import oneDark from "react-syntax-highlighter/dist/cjs/styles/prism/one-dark";
import cpp from "react-syntax-highlighter/dist/cjs/languages/prism/cpp";
import c from "react-syntax-highlighter/dist/cjs/languages/prism/c";
import bash from "react-syntax-highlighter/dist/cjs/languages/prism/bash";
import sql from "react-syntax-highlighter/dist/cjs/languages/prism/sql";
import python from "react-syntax-highlighter/dist/cjs/languages/prism/python";
import javascript from "react-syntax-highlighter/dist/cjs/languages/prism/javascript";
import json from "react-syntax-highlighter/dist/cjs/languages/prism/json";
import { Copy, Check, Play, Code2 } from "lucide-react";

SyntaxHighlighter.registerLanguage("cpp", cpp);
SyntaxHighlighter.registerLanguage("c", c);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("sql", sql);
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("json", json);

const LANG_MAP: Record<string, string> = {
  cpp: "cpp",
  c: "c",
  h: "cpp",
  hpp: "cpp",
  bash: "bash",
  shell: "bash",
  sh: "bash",
  terminal: "bash",
  sql: "sql",
  python: "python",
  py: "python",
  javascript: "javascript",
  js: "javascript",
  json: "json",
  text: "text",
};

const LANG_LABEL: Record<string, string> = {
  cpp: "C++",
  c: "C",
  h: "C++",
  hpp: "C++",
  bash: "Terminal",
  shell: "Terminal",
  sh: "Terminal",
  terminal: "Terminal",
  sql: "SQL",
  python: "Python",
  py: "Python",
  javascript: "JavaScript",
  js: "JavaScript",
  json: "JSON",
  text: "نص",
};

export default function CodeBlock({
  code,
  language = "cpp",
  title,
}: {
  code: string;
  language?: string;
  title?: string;
}) {
  const [copied, setCopied] = useState(false);
  const lang = LANG_MAP[language.toLowerCase()] ?? "text";
  const isHighlighted = lang !== "text";
  const lines = code.split("\n").length;
  const showLines = lines > 5;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="my-6 rounded-xl border border-white/10 bg-[#0d1117] overflow-hidden" dir="ltr">
      <div className="flex items-center justify-between gap-3 border-b border-white/5 bg-white/[0.03] px-4 py-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-rose-500/70" />
            <span className="h-3 w-3 rounded-full bg-amber-400/70" />
            <span className="h-3 w-3 rounded-full bg-emerald-400/70" />
          </span>
          <span
            className="text-xs text-slate-400 truncate"
            dir="auto"
          >
            {title || LANG_LABEL[lang] || language}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/10 transition-colors min-h-[44px] min-w-[44px] justify-center"
            aria-label="نسخ الكود"
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-400" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">{copied ? "تم النسخ" : "نسخ"}</span>
          </button>
          <Link
            href={`/playground?code=${encodeURIComponent(code)}`}
            className="flex items-center gap-1.5 rounded-lg bg-cyan-500/10 px-3 py-2 text-xs font-medium text-cyan-300 hover:bg-cyan-500/20 transition-colors min-h-[44px] min-w-[44px] justify-center"
            aria-label="تشغيل في الملعب"
          >
            <Play className="h-4 w-4" />
            <span className="hidden sm:inline">تشغيل</span>
          </Link>
        </div>
      </div>

      <div className="code-scroll overflow-x-auto p-3 sm:p-4 text-[12.5px] sm:text-sm leading-6">
        {isHighlighted ? (
          <SyntaxHighlighter
            language={lang}
            style={oneDark}
            showLineNumbers={showLines}
            customStyle={{
              background: "transparent",
              margin: 0,
              padding: 0,
              fontFamily: "Fira Code, JetBrains Mono, Consolas, monospace",
              fontSize: "0.875rem",
            }}
            codeTagProps={{
              style: { fontFamily: "Fira Code, JetBrains Mono, Consolas, monospace" },
            }}
          >
            {code}
          </SyntaxHighlighter>
        ) : (
          <pre className="font-mono text-slate-200 whitespace-pre">
            <code>{code}</code>
          </pre>
        )}
      </div>
    </div>
  );
}
