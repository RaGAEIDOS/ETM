#!/usr/bin/env node
/**
 * Generates the ETM logo asset map and derives WebP/favicon files.
 *
 * Designer workflow:
 *   public/mascot/logo_full.png   horizontal wordmark + icon
 *   public/mascot/logo_icon.png   square icon, ideally >= 512x512
 *   public/mascot/logo_dark.png   optional full logo for light backgrounds
 *
 * Run automatically by `npm run dev` / `npm run build` (predev/prebuild).
 * Files are optional: missing PNGs fall back to the labelled SVGs in
 * public/mascot/, so the site keeps working before final art arrives.
 *
 * WebP needs `sharp` or `cwebp`; favicons also work without them through the
 * dependency-free PNG resizer in ./lib/png-tools.mjs.
 */

import { spawnSync } from "node:child_process";
import { access, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { buildIco, isPng, readPngSize, resizeSquarePng } from "./lib/png-tools.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const mascotDir = join(root, "public", "mascot");
const iconsDir = join(root, "public", "icons");
const assetsFile = join(root, "lib", "logo-assets.ts");

const warnings = [];
const notes = [];

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function isFresh(output, source) {
  try {
    const [outputStat, sourceStat] = await Promise.all([stat(output), stat(source)]);
    return outputStat.mtimeMs >= sourceStat.mtimeMs;
  } catch {
    return false;
  }
}

let sharp = null;
try {
  const module = await import("sharp");
  sharp = module.default ?? module;
} catch {
  // Optional build-time dependency; the pure-JS path handles favicons.
}

const cwebpAvailable = (() => {
  try {
    const result = spawnSync("cwebp", ["-version"], {
      stdio: "ignore",
      shell: process.platform === "win32",
    });
    return result.status === 0;
  } catch {
    return false;
  }
})();

const sharpOrCwebp = sharp ? "sharp" : cwebpAvailable ? "cwebp" : null;
if (!sharpOrCwebp) {
  notes.push(
    "sharp/cwebp not found: WebP is skipped when no fresh .webp exists; the PNG source is served instead."
  );
}

function readSvgSize(source, file) {
  const text = source.toString("utf8");
  const viewBox = /viewBox=["']([^"']+)["']/i.exec(text);
  if (viewBox) {
    const values = viewBox[1].trim().split(/[\s,]+/).map(Number);
    if (values.length === 4 && values.every(Number.isFinite)) {
      return { width: values[2], height: values[3] };
    }
  }
  const width = /width=["']([\d.]+)/i.exec(text);
  const height = /height=["']([\d.]+)/i.exec(text);
  if (width && height) {
    return { width: Number(width[1]), height: Number(height[1]) };
  }
  throw new Error(`${file} needs a viewBox or width/height`);
}

async function generateWebp(pngPath, webpPath) {
  if (sharp) {
    try {
      await sharp(pngPath).webp({ quality: 90 }).toFile(webpPath);
      return true;
    } catch (error) {
      warnings.push(`sharp could not write ${webpPath}: ${error.message}`);
      return false;
    }
  }

  if (cwebpAvailable) {
    const result = spawnSync("cwebp", ["-quiet", "-q", "90", pngPath, "-o", webpPath], {
      stdio: "ignore",
    });
    if (result.status === 0) return true;
    warnings.push(`cwebp failed for ${pngPath}`);
    return false;
  }

  // The repository ships pre-generated WebP files. On machines without
  // sharp/cwebp, reuse them instead of dropping back to the PNG source.
  if (await exists(webpPath)) {
    notes.push(`Using existing ${webpPath.split(/[\\/]/).pop()}.`);
    return true;
  }
  return false;
}

async function readVariant(pngName, svgName, { optional = false } = {}) {
  const pngPath = join(mascotDir, pngName);
  const svgPath = join(mascotDir, svgName);

  if (await exists(pngPath)) {
    const source = await readFile(pngPath);
    if (!isPng(source)) {
      warnings.push(`${pngName} is not a valid PNG; falling back to ${svgName}.`);
    } else {
      let size;
      try {
        size = readPngSize(source);
      } catch (error) {
        warnings.push(`${pngName}: ${error.message}; falling back to ${svgName}.`);
      }
      if (size) {
        const webpName = pngName.replace(/\.png$/i, ".webp");
        const webpPath = join(mascotDir, webpName);
        const webp = await generateWebp(pngPath, webpPath);
        return {
          src: `/mascot/${pngName}`,
          webp: webp ? `/mascot/${webpName}` : null,
          width: size.width,
          height: size.height,
          placeholder: false,
        };
      }
    }
  }

  if (optional) return null;
  if (!(await exists(svgPath))) {
    throw new Error(
      `Missing logo source: provide ${pngName} or the placeholder ${svgName} in public/mascot/.`
    );
  }
  const svg = await readFile(svgPath);
  const size = readSvgSize(svg, svgName);
  return {
    src: `/mascot/${svgName}`,
    webp: null,
    width: size.width,
    height: size.height,
    placeholder: true,
  };
}

function publicRelative(urlPath) {
  return urlPath.replace(/^\//, "");
}

function placeholderFavicons() {
  return {
    icon: [{ src: "/icons/favicon.svg", sizes: "any", type: "image/svg+xml" }],
    shortcut: "/icons/favicon.svg",
    apple: "/icons/favicon.svg",
    manifest: [
      { src: "/icons/favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
    ico: { path: "icons/favicon.svg", type: "image/svg+xml" },
  };
}

async function generateFavicons(icon) {
  if (icon.placeholder) {
    notes.push(
      "Favicons are the SVG placeholder. Drop public/mascot/logo_icon.png to generate 16/32/180/192/512 + favicon.ico."
    );
    return placeholderFavicons();
  }

  const sourcePath = join(root, "public", publicRelative(icon.src));
  const outputs = {
    16: join(iconsDir, "favicon-16x16.png"),
    32: join(iconsDir, "favicon-32x32.png"),
    180: join(iconsDir, "apple-touch-icon.png"),
    192: join(iconsDir, "android-chrome-192x192.png"),
    512: join(iconsDir, "android-chrome-512x512.png"),
  };

  let generated = false;
  let sourceBuffer = null;

  try {
    if (sharp) {
      for (const [size, output] of Object.entries(outputs)) {
        await sharp(sourcePath)
          .resize(Number(size), Number(size), { fit: "cover" })
          .png({ compressionLevel: 9 })
          .toFile(output);
      }
      generated = true;
    } else {
      sourceBuffer = await readFile(sourcePath);
      for (const [size, output] of Object.entries(outputs)) {
        await writeFile(output, resizeSquarePng(sourceBuffer, Number(size)));
      }
      generated = true;
      notes.push("Favicons generated with the built-in PNG resizer (no sharp/cwebp needed).");
    }
  } catch (error) {
    warnings.push(`Could not generate favicon sizes: ${error.message}`);
  }

  if (!generated) {
    const fresh = await Promise.all(
      Object.values(outputs).map((output) => isFresh(output, sourcePath))
    );
    if (fresh.every(Boolean)) {
      generated = true;
      notes.push("Using previously generated favicon sizes (newer than logo_icon.png).");
    }
  }

  if (!generated) {
    warnings.push(
      "Favicon sizes could not be derived; using logo_icon.png directly at its native size."
    );
    const sizes = `${icon.width}x${icon.height}`;
    return {
      icon: [{ src: icon.src, sizes, type: "image/png" }],
      shortcut: icon.src,
      apple: icon.src,
      manifest: [{ src: icon.src, sizes, type: "image/png", purpose: "any" }],
      ico: { path: publicRelative(icon.src), type: "image/png" },
    };
  }

  let ico = null;
  try {
    const entries = [];
    if (!sourceBuffer) sourceBuffer = await readFile(sourcePath);
    for (const size of [16, 32, 48]) {
      const data = sharp
        ? await sharp(sourcePath).resize(size, size, { fit: "cover" }).png().toBuffer()
        : resizeSquarePng(sourceBuffer, size);
      entries.push({ size, data });
    }
    await writeFile(join(iconsDir, "favicon.ico"), buildIco(entries));
    ico = { path: "icons/favicon.ico", type: "image/x-icon" };
  } catch (error) {
    warnings.push(`Could not build favicon.ico: ${error.message}`);
  }

  return {
    icon: [
      { src: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { src: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      ...(ico
        ? [{ src: "/favicon.ico", sizes: "48x48", type: "image/x-icon" }]
        : []),
    ],
    shortcut: "/icons/favicon-32x32.png",
    apple: "/icons/apple-touch-icon.png",
    manifest: [
      {
        src: "/icons/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    ico: ico ?? { path: "icons/favicon-32x32.png", type: "image/png" },
  };
}

async function main() {
  await mkdir(mascotDir, { recursive: true });
  await mkdir(iconsDir, { recursive: true });
  await mkdir(dirname(assetsFile), { recursive: true });

  const full = await readVariant("logo_full.png", "logo_full.svg");
  const icon = await readVariant("logo_icon.png", "logo_icon.svg");

  // The dark variant is optional. Use its placeholder only while the full logo
  // is also a placeholder: mixing real artwork with a placeholder would look
  // broken. When real logo_dark.png arrives, it is used automatically.
  let dark = await readVariant("logo_dark.png", "logo_dark.svg", { optional: true });
  if (!dark && full.placeholder) {
    dark = await readVariant("logo_dark.png", "logo_dark.svg");
  }

  const favicons = await generateFavicons(icon);

  const assets = {
    full,
    icon,
    dark,
    og: {
      src: full.src,
      width: full.width,
      height: full.height,
      placeholder: full.placeholder,
    },
    favicons,
  };

  const header = `/**
 * AUTO-GENERATED - do not edit by hand.
 *
 * Regenerate with \`node scripts/generate-logo-assets.mjs\` (this runs
 * automatically before \`npm run dev\` and \`npm run build\`).
 *
 * Drop public/mascot/logo_full.png, logo_icon.png and/or logo_dark.png in
 * place and the next dev/build regenerates this file plus WebP/favicons. The
 * labelled SVGs in public/mascot/ are the fallback until then.
 */

export const LOGO_ASSETS = `;

  await writeFile(assetsFile, `${header}${JSON.stringify(assets, null, 2)};\n`, "utf8");

  const describe = (name, asset) =>
    asset
      ? `${name}: ${asset.placeholder ? "placeholder " : ""}${asset.src} (${asset.width}x${asset.height})`
      : `${name}: none`;

  console.log(`[logo] ${describe("full", full)}`);
  console.log(`[logo] ${describe("icon", icon)}`);
  console.log(`[logo] ${describe("dark", dark)}`);
  console.log(
    `[logo] favicons: ${
      icon.placeholder ? "placeholder SVG" : `${favicons.manifest.map((i) => i.sizes).join(", ")}`
    }`
  );
  console.log(`[logo] og:image -> ${assets.og.src}`);
  console.log(`[logo] wrote ${assetsFile}`);

  for (const note of notes) console.log(`[logo] note: ${note}`);
  for (const warning of warnings) console.warn(`[logo] warning: ${warning}`);
  if (warnings.length) console.warn(`[logo] completed with ${warnings.length} warning(s).`);
}

main().catch((error) => {
  console.error(`[logo] failed: ${error.message}`);
  process.exitCode = 1;
});
