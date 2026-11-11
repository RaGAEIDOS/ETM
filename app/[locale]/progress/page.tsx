import type { Metadata } from "next";
import { BarChart3 } from "lucide-react";
import ProgressDashboard from "@/components/ProgressDashboard";

export const metadata: Metadata = {
  title: "Your Progress",
  description:
    "Track your progress in the ETM curriculum: how many lessons you completed, completion percentage for every stage, and the lessons you finished.",
};

export default function ProgressPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400 mb-4">
          <BarChart3 className="h-7 w-7" />
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-white">
          Your progress <span className="gradient-text">in the journey</span>
        </h1>
        <p className="mt-4 text-lg text-slate-400 leading-8">
          Your data is saved on your device — no accounts, no sign-up. See exactly
          where you are and what is left.
        </p>
      </div>

      <ProgressDashboard />
    </div>
  );
}
