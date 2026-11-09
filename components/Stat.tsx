"use client";

import { useEffect, useState } from "react";

export default function Stat({
  value,
  suffix = "",
  label,
}: {
  value: number;
  suffix?: string;
  label: string;
}) {
  const [n, setN] = useState(0);

  useEffect(() => {
    const duration = 1400;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <div className="text-center">
      <div className="text-3xl sm:text-4xl font-black text-white tabular-nums" dir="ltr">
        {n.toLocaleString("en-US")}
        {suffix}
      </div>
      <div className="mt-1 text-sm text-slate-400">{label}</div>
    </div>
  );
}
