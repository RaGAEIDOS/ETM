"use client";

import { useEffect, useState } from "react";

/**
 * Tiny client island for the hero quote rotator.
 *
 * The rest of the hero is a server component on purpose: only these few lines
 * ship as JS, which keeps hydration work off the landing page's critical path.
 */
export default function HeroQuote({ quotes }: { quotes: readonly string[] }) {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener?.("change", sync);
    return () => query.removeEventListener?.("change", sync);
  }, []);

  useEffect(() => {
    if (reducedMotion || quotes.length < 2) return;
    const timer = setInterval(() => {
      setQuoteIndex((index) => (index + 1) % quotes.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [quotes.length, reducedMotion]);

  return (
    <div className="relative mt-1 grid">
      {quotes.map((item, index) => (
        <p
          key={item}
          aria-hidden={index !== quoteIndex}
          className={`col-start-1 row-start-1 text-sm leading-6 text-slate-300 transition-opacity duration-300 ${
            index === quoteIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          {item}
        </p>
      ))}
    </div>
  );
}
