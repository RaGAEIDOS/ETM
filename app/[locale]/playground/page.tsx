import type { Metadata } from "next";
import { Suspense } from "react";
import { Code2, Zap, ShieldCheck, Globe } from "lucide-react";
import Playground from "@/components/Playground";

export const metadata: Metadata = {
  title: "C++ Playground",
  description:
    "Run real C++ code directly in your browser: write, compile and execute — no installs required.",
};

export default function PlaygroundPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-sm font-bold text-cyan-400">C++ Playground</span>
        <h1 className="mt-3 text-4xl sm:text-5xl font-black text-white">
          Write. Compile. <span className="gradient-text">Run.</span>
        </h1>
        <p className="mt-4 text-lg text-slate-400 leading-8">
          A real <bdi dir="ltr" className="font-mono text-cyan-300">C++</bdi>{" "}
          compiler in your browser — no installs, nothing to set up. Try every
          lesson example, or write your own code.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { icon: Zap, title: "Instant", desc: "Compile and run in seconds" },
          { icon: Globe, title: "In-browser", desc: "No software required" },
          { icon: ShieldCheck, title: "Safe", desc: "Every run in an isolated sandbox" },
        ].map((f) => (
          <div
            key={f.title}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
              <f.icon className="h-5 w-5" />
            </span>
            <div>
              <div className="font-bold text-white text-sm">{f.title}</div>
              <div className="text-xs text-slate-500">{f.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <Suspense
        fallback={
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-10 text-center text-slate-400">
            Loading the playground...
          </div>
        }
      >
        <Playground />
      </Suspense>
    </div>
  );
}
