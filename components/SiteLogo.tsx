import { LOGO_ASSETS } from "@/lib/logo-assets";

const ALT = "ETM — Education Technology Maryam";

type Props = {
  /** Height and motion classes for the logo wrapper (e.g. `h-11 sm:h-12`). */
  className?: string;
  /** Set for the above-the-fold header copy; the footer stays lazy. */
  eager?: boolean;
};

/**
 * Theme-aware site logo.
 *
 * - `logo_full` is shown on dark, terminal and cozy backgrounds.
 * - `logo_dark` is shown on the light theme when the designer supplies it.
 * - The swap is pure CSS keyed on `html[data-theme]`, so it happens before
 *   hydration with no flicker and no client-side JS.
 *
 * Paths come from the generated `lib/logo-assets.ts`; dropping real PNGs into
 * public/mascot/ is enough to replace the placeholders.
 */
export default function SiteLogo({ className = "", eager = false }: Props) {
  const { full, dark } = LOGO_ASSETS;

  return (
    <span
      className={`site-logo inline-flex shrink-0 items-center ${className}`}
      data-logo-variant={dark ? "dual" : "single"}
    >
      <picture className="site-logo-picture site-logo-on-dark">
        {full.webp ? <source srcSet={full.webp} type="image/webp" /> : null}
        <img
          src={full.src}
          alt={ALT}
          width={full.width}
          height={full.height}
          loading={eager ? "eager" : "lazy"}
          className="site-logo-img"
        />
      </picture>
      {dark ? (
        <picture className="site-logo-picture site-logo-on-light">
          {dark.webp ? <source srcSet={dark.webp} type="image/webp" /> : null}
          <img
            src={dark.src}
            alt={ALT}
            width={dark.width}
            height={dark.height}
            loading="lazy"
            className="site-logo-img"
          />
        </picture>
      ) : null}
    </span>
  );
}
