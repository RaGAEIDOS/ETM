"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import type { PDFDocumentProxy, RenderTask } from "pdfjs-dist";
import {
  AlertCircle,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Download,
  Loader2,
  X,
} from "lucide-react";
import { formatNumber, type Locale } from "@/lib/i18n/config";
import { latestBookProgress } from "@/lib/progress/core";
import { loadProgressFile, saveBookProgress } from "@/lib/progress/store";

const COPY = {
  ar: {
    loading: "جارٍ تحميل الكتاب…",
    rendering: "جارٍ عرض الصفحة…",
    errorTitle: "تعذّر تحميل الكتاب",
    errorBody: "تأكد من اتصالك ثم أعد المحاولة، أو افتح ملف PDF مباشرة.",
    download: "فتح ملف PDF",
    prev: "السابق",
    next: "التالي",
    page: "صفحة",
    of: "من",
    jump: "انتقال",
    restored: (page: number) => `تم استئناف القراءة من صفحة ${formatNumber(page)}`,
    dismiss: "إخفاء",
    saved: "يُحفظ تقدمك تلقائيًا",
  },
  en: {
    loading: "Loading the book…",
    rendering: "Rendering page…",
    errorTitle: "Could not load the book",
    errorBody: "Check your connection and try again, or open the PDF directly.",
    download: "Open PDF",
    prev: "Previous",
    next: "Next",
    page: "Page",
    of: "of",
    jump: "Go",
    restored: (page: number) => `Resumed from page ${formatNumber(page)}`,
    dismiss: "Dismiss",
    saved: "Your page is saved automatically",
  },
} as const;

export default function PdfReader({
  bookId,
  pdfUrl,
  title,
  locale,
}: {
  bookId: string;
  pdfUrl: string;
  title: string;
  locale: Locale;
}) {
  const c = COPY[locale];
  const [numPages, setNumPages] = useState(0);
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const [loadingDoc, setLoadingDoc] = useState(true);
  const [rendering, setRendering] = useState(false);
  const [error, setError] = useState(false);
  const [restoredPage, setRestoredPage] = useState(0);

  const docRef = useRef<PDFDocumentProxy | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const renderTaskRef = useRef<RenderTask | null>(null);
  const renderIdRef = useRef(0);
  const pageRef = useRef(1);

  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  // Load the document once, restore the saved bookmark, then render.
  useEffect(() => {
    let cancelled = false;
    setLoadingDoc(true);
    setError(false);
    setRestoredPage(0);

    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = "/library/pdf.worker.min.js";
        const doc = await pdfjs.getDocument({ url: pdfUrl }).promise;
        if (cancelled) {
          void doc.destroy();
          return;
        }
        docRef.current = doc;
        setNumPages(doc.numPages);

        const saved = latestBookProgress(loadProgressFile().events, bookId);
        const start = saved
          ? Math.min(Math.max(1, saved.page), doc.numPages)
          : 1;
        setPage(start);
        setPageInput(String(start));
        if (start > 1) setRestoredPage(start);
        setLoadingDoc(false);
      } catch {
        if (!cancelled) {
          setError(true);
          setLoadingDoc(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      renderTaskRef.current?.cancel();
      renderTaskRef.current = null;
      const doc = docRef.current;
      docRef.current = null;
      if (doc) void doc.destroy();
    };
  }, [bookId, pdfUrl]);

  const renderPage = useCallback(async (pageNumber: number) => {
    const doc = docRef.current;
    const canvas = canvasRef.current;
    const viewportEl = viewportRef.current;
    if (!doc || !canvas || !viewportEl) return;

    const id = renderIdRef.current + 1;
    renderIdRef.current = id;
    renderTaskRef.current?.cancel();
    renderTaskRef.current = null;
    setRendering(true);

    try {
      const pdfPage = await doc.getPage(pageNumber);
      if (renderIdRef.current !== id) return;

      const base = pdfPage.getViewport({ scale: 1 });
      const available = Math.max(280, viewportEl.clientWidth);
      const scale = Math.min(1.6, Math.max(0.35, available / base.width));
      const viewport = pdfPage.getViewport({ scale });
      const dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = Math.floor(viewport.width * dpr);
      canvas.height = Math.floor(viewport.height * dpr);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const task = pdfPage.render({ canvasContext: ctx, viewport });
      renderTaskRef.current = task;
      await task.promise;
      if (renderIdRef.current === id) setRendering(false);
    } catch (err) {
      const name = (err as { name?: string })?.name;
      if (name !== "RenderingCancelledException" && renderIdRef.current === id) {
        setRendering(false);
        setError(true);
      }
    }
  }, []);

  useEffect(() => {
    if (loadingDoc || error || !numPages) return;
    void renderPage(page);
  }, [loadingDoc, error, numPages, page, renderPage]);

  // Re-render at the new width when the viewport resizes.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    let timer: number | undefined;
    const observer = new ResizeObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        void renderPage(pageRef.current);
      }, 160);
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [renderPage]);

  const goTo = useCallback(
    (next: number) => {
      if (!numPages) return;
      const clamped = Math.min(Math.max(1, Math.floor(next)), numPages);
      if (clamped === pageRef.current) return;
      pageRef.current = clamped;
      setPage(clamped);
      setPageInput(String(clamped));
      saveBookProgress(bookId, clamped, numPages);
      viewportRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
    },
    [bookId, numPages]
  );

  const submitPage = (event: FormEvent) => {
    event.preventDefault();
    const parsed = Number(pageInput);
    if (Number.isFinite(parsed)) goTo(parsed);
    else setPageInput(String(pageRef.current));
  };

  const percent = numPages > 0 ? Math.round((page / numPages) * 100) : 0;

  return (
    <div className="mt-6">
      {restoredPage > 0 && (
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-cyan-500/25 bg-cyan-500/10 px-4 py-3 text-sm font-bold text-cyan-200">
          <Bookmark className="h-4 w-4 shrink-0" />
          <span className="flex-1">{c.restored(restoredPage)}</span>
          <button
            type="button"
            onClick={() => setRestoredPage(0)}
            aria-label={c.dismiss}
            className="rounded p-1 text-cyan-300 hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="sticky top-16 z-20 rounded-xl border border-white/10 bg-ink-900/95 p-2 shadow-xl backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => goTo(page - 1)}
              disabled={page <= 1 || loadingDoc}
              className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-[11px] font-bold text-slate-200 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-3.5 w-3.5" />
              {c.prev}
            </button>
            <button
              type="button"
              onClick={() => goTo(page + 1)}
              disabled={page >= numPages || loadingDoc}
              className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-[11px] font-bold text-slate-200 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {c.next}
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
          </div>

          <form
            onSubmit={submitPage}
            className="flex items-center gap-2 text-[11px] font-bold text-slate-400"
          >
            <span>{c.page}</span>
            <input
              type="number"
              min={1}
              max={numPages || 1}
              value={pageInput}
              onChange={(event) => setPageInput(event.target.value)}
              disabled={loadingDoc || numPages === 0}
              aria-label={c.page}
              dir="ltr"
              className="w-16 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-center text-xs font-bold text-white outline-none focus:border-cyan-500/50"
            />
            <span>/ {numPages > 0 ? formatNumber(numPages) : "…"}</span>
            <button
              type="submit"
              disabled={loadingDoc || numPages === 0}
              className="rounded-lg bg-cyan-500/15 px-2 py-1.5 text-cyan-300 hover:bg-cyan-500/25 disabled:opacity-40"
            >
              {c.jump}
            </button>
          </form>

          <a
            href={pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-cyan-300"
          >
            <Download className="h-3.5 w-3.5" />
            {c.download}
          </a>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-teal-400 transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="text-[10px] font-bold text-slate-500" dir="ltr">
            {formatNumber(percent)}%
          </span>
        </div>
      </div>

      <div
        ref={viewportRef}
        className="mt-4 flex min-h-[420px] justify-center rounded-2xl border border-white/10 bg-slate-950/70 p-2 shadow-inner sm:p-4"
      >
        {error ? (
          <div className="flex max-w-md flex-col items-center justify-center gap-3 px-4 text-center">
            <AlertCircle className="h-8 w-8 text-amber-300" />
            <p className="font-black text-white">{c.errorTitle}</p>
            <p className="text-sm leading-6 text-slate-400">{c.errorBody}</p>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-500/15 px-3 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-500/25"
            >
              <Download className="h-4 w-4" />
              {c.download}
            </a>
          </div>
        ) : (
          <div className="relative flex w-full justify-center">
            <canvas
              ref={canvasRef}
              aria-label={`${title} — ${c.page} ${page} ${c.of} ${numPages}`}
              className="max-w-full rounded-sm bg-white shadow-2xl"
            />
            {(loadingDoc || rendering) && (
              <div className="absolute inset-x-0 top-4 flex justify-center">
                <span className="inline-flex items-center gap-2 rounded-full bg-black/75 px-3 py-1.5 text-[11px] font-bold text-slate-200 backdrop-blur">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-cyan-400" />
                  {loadingDoc ? c.loading : c.rendering}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      <p className="mt-3 text-center text-[10px] font-bold text-slate-600">
        {c.saved}
      </p>
    </div>
  );
}
