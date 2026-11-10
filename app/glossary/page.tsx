import type { Metadata } from "next";
import { BookMarked } from "lucide-react";
import GlossarySearch from "@/components/GlossarySearch";

export const metadata: Metadata = {
  title: "Glossary",
  description:
    "A comprehensive glossary of programming and computer science terms in English and Arabic — a simple explanation for every term.",
};

export default function GlossaryPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-400 mb-4">
          <BookMarked className="h-7 w-7" />
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-white">
          <span className="gradient-text">Glossary</span>
        </h1>
        <p className="mt-4 text-lg text-slate-400 leading-8">
          Every English term in programming and computer science, explained in
          Arabic — so there is no language barrier in your way.
        </p>
      </div>

      <GlossarySearch />
    </div>
  );
}
