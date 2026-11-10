import type { Metadata } from "next";
import { ExternalLink, BookOpen, Github, Info } from "lucide-react";
import { freeBooksByCategory, type FreeBook } from "@/lib/free-books";

export const metadata: Metadata = {
  title: "Free Books & References",
  description:
    "An official, legally free library of programming and computer-science books you can read for the ETM curriculum.",
};

const LEVEL_LABELS: Record<number, string> = {
  1: "Stage 1",
  2: "Stage 2",
  3: "Stage 3",
  4: "Stage 4",
};

const LEVEL_COLORS: Record<number, string> = {
  1: "from-emerald-400 to-cyan-500 text-emerald-200",
  2: "from-cyan-400 to-blue-500 text-cyan-200",
  3: "from-violet-400 to-fuchsia-500 text-violet-200",
  4: "from-amber-400 to-rose-500 text-amber-200",
};

function BookCard({ book }: { book: FreeBook }) {
  return (
    <a
      href={book.url}
      target="_blank"
      rel="noreferrer"
      className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-cyan-500/30 hover:bg-white/[0.05] transition-all"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 text-xs font-bold text-cyan-300 uppercase tracking-wide">
          {book.format}
        </span>
        <span
          className={`rounded-full border border-white/10 bg-gradient-to-l ${
            LEVEL_COLORS[book.level]
          } bg-opacity-10 px-2.5 py-0.5 text-xs font-bold`}
        >
          {LEVEL_LABELS[book.level]}
        </span>
      </div>

      <h3 className="mt-4 font-bold text-white group-hover:text-cyan-300 transition-colors leading-7">
        {book.title}
      </h3>
      <p className="mt-1 text-sm text-slate-500">{book.author}</p>
      <p className="mt-3 flex-1 text-sm text-slate-400 leading-6">{book.desc}</p>

      <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 group-hover:underline">
        Open official book <ExternalLink className="h-3.5 w-3.5" />
      </span>
    </a>
  );
}

export default function BooksPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-sm font-bold text-cyan-400">Free library</span>
        <h1 className="mt-3 text-4xl sm:text-5xl font-black text-white">
          Study from <span className="gradient-text">world-class free books</span>
        </h1>
        <p className="mt-4 text-lg text-slate-400 leading-8">
          The ETM curriculum is designed to be absorbed alongside reading. Every
          book here is officially free — open access, Creative Commons, or
          released freely by the author or publisher.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="mb-10 rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-amber-300 mt-0.5 shrink-0" />
          <p className="text-sm text-amber-100/80 leading-7">
            All book links are official and legal. There is no piracy here —
            every resource is either published as open access by its publisher,
            released under a Creative Commons license, or explicitly offered
            free by the author. If you spot a broken link, please open an issue
            on the ETM{" "}
            <a
              href="https://github.com/RaGAEIDOS/ETM"
              target="_blank"
              rel="noreferrer"
              className="text-amber-200 hover:underline"
            >
              GitHub repository
            </a>
            .
          </p>
        </div>
      </div>

      {/* Category sections */}
      {freeBooksByCategory.map((section) => (
        <section key={section.category} className="mt-10">
          <h2 className="flex items-center gap-2 text-2xl font-black text-white mb-5">
            <BookOpen className="h-6 w-6 text-cyan-400" />
            {section.category}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {section.books.map((book) => (
              <BookCard key={book.url} book={book} />
            ))}
          </div>
        </section>
      ))}

      {/* Footer CTA */}
      <div className="mt-14 rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center">
        <Github className="h-7 w-7 text-slate-500 mx-auto mb-3" />
        <h3 className="text-xl font-black text-white">Want a book added?</h3>
        <p className="mt-2 text-slate-400 leading-7">
          Open a pull request or issue on GitHub with the book name and its official free link.
        </p>
        <a
          href="https://github.com/RaGAEIDOS/ETM"
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-bold text-white hover:bg-white/10 transition-colors"
        >
          <Github className="h-4 w-4" /> Contribute on GitHub
        </a>
      </div>
    </div>
  );
}
