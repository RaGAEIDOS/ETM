"use client";

import { useEffect, useState } from "react";
import { Terminal } from "lucide-react";

const LINES: { type: "cmd" | "out"; text: string }[] = [
  { type: "cmd", text: "g++ -std=c++17 main.cpp -o main" },
  { type: "cmd", text: "./main" },
  { type: "out", text: "مرحباً بالعالم! أنا مبرمج C++ جديد" },
  { type: "out", text: "مجموع 1 + 2 = 3" },
  { type: "out", text: "تم التنفيذ بنجاح ✓" },
];

export default function HeroTerminal() {
  const [done, setDone] = useState<typeof LINES>([]);
  const [current, setCurrent] = useState("");

  useEffect(() => {
    let line = 0;
    let char = 0;
    const timer = setInterval(() => {
      if (line >= LINES.length) {
        clearInterval(timer);
        return;
      }
      const item = LINES[line];
      const text = item.text;
      char += 1;
      setCurrent(text.slice(0, char));
      if (char >= text.length) {
        setDone((prev) => [...prev, item]);
        setCurrent("");
        line += 1;
        char = 0;
      }
    }, 28);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d1117]/90 shadow-2xl shadow-cyan-500/10 overflow-hidden" dir="ltr">
      <div className="flex items-center gap-2 border-b border-white/5 bg-white/[0.03] px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-rose-500/70" />
        <span className="h-3 w-3 rounded-full bg-amber-400/70" />
        <span className="h-3 w-3 rounded-full bg-emerald-400/70" />
        <span className="ml-3 flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <Terminal className="h-3.5 w-3.5" />
          etm — bash
        </span>
      </div>
      <div className="p-5 font-mono text-sm leading-7 min-h-[220px]">
        {done.filter(Boolean).map((l, i) => (
          <div key={i} className={l.type === "cmd" ? "text-cyan-300" : "text-emerald-300"}>
            {l.type === "cmd" && <span className="text-slate-500 select-none">$ </span>}
            {l.text}
          </div>
        ))}
        <div className="text-cyan-300">
          <span className="text-slate-500 select-none">$ </span>
          {current}
          <span className="inline-block w-2 h-4 bg-cyan-300 align-middle animate-pulse" />
        </div>
      </div>
    </div>
  );
}
