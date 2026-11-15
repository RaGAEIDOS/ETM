import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "@/lib/i18n/navigation";
import { MASCOT_ASSETS, type MascotAsset } from "@/lib/mascot-assets";
import HeroQuote from "@/components/HeroQuote";
import type { Locale } from "@/lib/i18n/config";

const TAGLINE_AR = "منصتك لتعلّم البرمجة والذكاء الاصطناعي";
const TAGLINE_EN = "Your platform for coding & AI";

const QUOTES: Record<Locale, string[]> = {
  ar: [
    "البرمجة رحلة، مش سباق. خطوة كل يوم تكفي.",
    "جرّب، غلط، واتعلم — كده بتكبر.",
    "اسألني عن أي حاجة، بس الأول جرّب بنفسك.",
    "كل خبير كان مبتدئ فضل يحاول.",
  ],
  en: [
    "Programming is a journey, not a race. One step a day is enough.",
    "Try, fail, learn — that's how you grow.",
    "Ask me anything, but try it yourself first.",
    "Every expert was once a beginner who kept going.",
  ],
};

const COPY = {
  ar: {
    ctaStart: "ابدأ الآن",
    ctaAbout: "تعرّف على مريم",
    quoteLabel: "مريم تقول:",
  },
  en: {
    ctaStart: "Start Now",
    ctaAbout: "Meet Maryam",
    quoteLabel: "Maryam says:",
  },
} as const;

function AssetPicture({
  asset,
  sizes,
  className = "",
  imgClassName = "",
  testId,
}: {
  asset: MascotAsset;
  sizes: string;
  className?: string;
  imgClassName?: string;
  testId?: string;
}) {
  const sourceSet = asset.srcSet ?? asset.webp;
  const fallback = asset.png ?? asset.webp ?? asset.placeholder;

  return (
    <picture className={className} data-testid={testId}>
      {sourceSet ? <source type="image/webp" srcSet={sourceSet} sizes={sizes} /> : null}
      <img
        src={fallback}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className={imgClassName}
      />
    </picture>
  );
}

export default function HeroBanner({ locale }: { locale: Locale }) {
  const copy = COPY[locale];
  const quotes = QUOTES[locale];

  const mobileAvatar =
    MASCOT_ASSETS.cutout.webp ??
    MASCOT_ASSETS.cutout.png ??
    MASCOT_ASSETS.cutout.placeholder;

  return (
    <section
      role="banner"
      aria-labelledby="hero-title"
      className="relative overflow-hidden border-b border-white/5"
    >
      <div className="hero-banner-glow pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />

      <div
        data-testid="hero-grid"
        className="relative mx-auto grid max-w-7xl items-stretch gap-8 px-4 py-10 sm:px-6 md:grid-cols-[55%_45%] md:gap-0 md:py-0"
      >
        <div className="relative z-10 flex flex-col justify-center py-2 md:min-h-[560px] md:py-16 md:pe-12">
          <div
            data-testid="hero-mobile-avatar"
            className="mx-auto mb-6 h-[120px] w-[120px] shrink-0 overflow-hidden rounded-full border border-cyan-400/40 bg-white/[0.04] shadow-lg shadow-cyan-500/10 md:hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- decorative avatar from a generated local asset; next/image adds no value for an aria-hidden crop */}
            <img
              src={mobileAvatar}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover object-top"
            />
          </div>

          <h1
            id="hero-title"
            className="font-mono text-[clamp(2rem,5vw,3.5rem)] font-black leading-none tracking-tight text-cyan-400"
          >
            ETM
            <span className="sr-only">
              {" "}
              — {TAGLINE_AR} / {TAGLINE_EN}
            </span>
          </h1>

          <p dir="rtl" lang="ar" className="mt-5 text-2xl font-black leading-snug text-white sm:text-3xl">
            {TAGLINE_AR}
          </p>
          <p dir="ltr" lang="en" className="mt-2 text-base font-semibold text-slate-400 sm:text-lg">
            {TAGLINE_EN}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/curriculum"
              className="group inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3.5 font-bold text-ink-950 shadow-lg shadow-cyan-500/20 transition-colors hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950"
            >
              {copy.ctaStart}
              <ArrowLeft className="h-5 w-5 transition-transform ltr:rotate-180 ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950"
            >
              <Sparkles className="h-5 w-5 text-cyan-400" />
              {copy.ctaAbout}
            </Link>
          </div>

          <div
            className="mt-8 flex max-w-md items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm"
            dir={locale === "ar" ? "rtl" : "ltr"}
          >
            <span
              aria-hidden="true"
              className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-cyan-400/30 bg-ink-900"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- quote avatar is already a 40px embedded-PNG SVG; optimization would break the SVG path */}
              <img
                data-testid="hero-quote-avatar"
                src={MASCOT_ASSETS.icon}
                alt=""
                aria-hidden="true"
                width={40}
                height={40}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </span>
            <div className="min-w-0">
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-400">
                {copy.quoteLabel}
              </div>
              <HeroQuote quotes={quotes} />
            </div>
          </div>
        </div>

        <div className="relative hidden min-h-[420px] md:block md:min-h-[560px]" aria-hidden="true">
          <div className="hero-banner-frame absolute inset-y-6 end-0 start-6 overflow-hidden rounded-3xl border border-white/10 bg-ink-900/40">
            <AssetPicture
              asset={MASCOT_ASSETS.banner}
              sizes="(min-width: 768px) 45vw, 100vw"
              className="absolute inset-0 h-full w-full"
              imgClassName="h-full w-full object-cover object-right rtl:object-left"
              testId="hero-banner"
            />
            <div className="hero-banner-overlay absolute inset-0" />
            {MASCOT_ASSETS.banner.available && MASCOT_ASSETS.cutout.available ? (
              <div className="absolute bottom-0 end-0 h-[90%] max-w-[70%]">
                <AssetPicture
                  asset={MASCOT_ASSETS.cutout}
                  sizes="(min-width: 768px) 32vw, 100vw"
                  className="block h-full"
                  imgClassName="h-full w-auto max-w-none object-contain object-bottom drop-shadow-[0_24px_40px_rgb(var(--color-accent)/0.35)]"
                  testId="hero-cutout"
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
