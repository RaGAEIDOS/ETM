/**
 * Copy the pdf.js worker into public/ so the browser PDF reader can load it
 * from the same origin. Generated at build time; not committed.
 */
import { copyFileSync, existsSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(root, "node_modules/pdfjs-dist/build/pdf.worker.min.js");
const target = resolve(root, "public/library/pdf.worker.min.js");

if (!existsSync(source)) {
  console.warn("[pdf] pdfjs-dist worker not found; run npm install first.");
  process.exit(0);
}

copyFileSync(source, target);
const mb = (statSync(target).size / 1024 / 1024).toFixed(2);
console.log(`[pdf] worker -> /library/pdf.worker.min.js (${mb} MB)`);
