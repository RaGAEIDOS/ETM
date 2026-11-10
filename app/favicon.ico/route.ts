import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const dynamic = "force-static";
export const revalidate = 86400;

export async function GET() {
  const svg = await readFile(join(process.cwd(), "public", "favicon.svg"));
  return new Response(new Uint8Array(svg), {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
}
