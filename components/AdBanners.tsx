"use client";

import { useEffect, useRef } from "react";

/**
 * HilltopAds banner rails — desktop (>=1280px) only.
 * Two 300x100 fixed side rails (physical right/left). The zone loaders are
 * injected on the client inside their rail so any inline-rendered creative
 * lands in place; below 1280px nothing is injected and nothing renders.
 * Codes provided by the site owner (their HilltopAds dashboard).
 */
const AD_ZONES = [
  {
    side: "right",
    src: "https://fond-appointment.com/b_XZV/sHd.Gml_0/YQWacS/UebmK9OueZKUtl/kAPDTyc/2XMijwMD3sOhTgcotuN/zBYayxMKzug/wLMwQg",
  },
  {
    side: "left",
    src: "https://fond-appointment.com/b/X.VGsbdUG/lO0SYbWScy/Ge/ms9euSZCU_l-kWPjTScV2gMhjZM-4zMZT/MGtPNlzIY/y/MezggkxCNAwl",
  },
] as const;

export default function AdBanners() {
  const rails = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    // Never load ad code on mobile/tablet — desktop rails only.
    if (!window.matchMedia("(min-width: 1280px)").matches) return;

    const injected: HTMLScriptElement[] = [];
    AD_ZONES.forEach((zone, i) => {
      const rail = rails.current[i];
      if (!rail) return;
      const s = document.createElement("script");
      s.src = zone.src;
      s.async = true;
      s.referrerPolicy = "no-referrer-when-downgrade";
      rail.appendChild(s);
      injected.push(s);
    });

    return () => {
      injected.forEach((s) => s.remove());
    };
  }, []);

  return (
    <>
      {AD_ZONES.map((zone, i) => (
        <div
          key={zone.side}
          ref={(el) => {
            rails.current[i] = el;
          }}
          aria-hidden="true"
          className={`hidden xl:block fixed top-1/2 z-30 h-[100px] w-[300px] -translate-y-1/2 overflow-hidden rounded-xl ${
            zone.side === "right" ? "right-2" : "left-2"
          }`}
        />
      ))}
    </>
  );
}
