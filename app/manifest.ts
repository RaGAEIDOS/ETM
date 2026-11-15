import type { MetadataRoute } from "next";
import { LOGO_ASSETS } from "@/lib/logo-assets";

/**
 * PWA manifest.
 *
 * `name` / `short_name` stay "ETM" by requirement. The icons array follows the
 * generated logo map: real logo_icon.png produces 192/512 PNG icons, while the
 * placeholder phase exposes the labelled SVG until the designer drops the PNG.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ETM",
    short_name: "ETM",
    description:
      "ETM — Education Technology Maryam: a free Arabic-first platform for learning programming and AI.",
    start_url: "/",
    display: "standalone",
    background_color: "#05070f",
    theme_color: "#05070f",
    icons: LOGO_ASSETS.favicons.manifest.map(({ src, sizes, type, purpose }) => ({
      src,
      sizes,
      type,
      purpose: (purpose ?? "any") as "any" | "maskable" | "monochrome",
    })),
  };
}
