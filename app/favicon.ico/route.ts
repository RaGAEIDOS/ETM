import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { LOGO_ASSETS } from "@/lib/logo-assets";

export const dynamic = "force-static";
export const revalidate = 86400;

/**
 * Serves /favicon.ico from the generated logo map:
 *   - real favicon.ico from public/icons/ when logo_icon.png was supplied;
 *   - the generated 32×32 PNG if ICO creation was unavailable;
 *   - the labelled SVG placeholder before the designer's PNG arrives.
 */
export async function GET() {
  const { path, type } = LOGO_ASSETS.favicons.ico;
  try {
    const file = await readFile(join(process.cwd(), "public", path));
    return new Response(new Uint8Array(file), {
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  } catch {
    return new Response("Favicon not found", { status: 404 });
  }
}
