#!/usr/bin/env node
/**
 * One-off derivation of the shipped ETM/Maryam artwork.
 *
 * The designer source files live outside the repository; this script turns
 * them into the exact asset names the runtime pipeline expects:
 *
 *   public/mascot/logo_full.png      clean ETM mark (no old subtitle)
 *   public/mascot/logo_dark.png      light-theme variant
 *   public/mascot/logo_icon.png      512x512 square icon
 *   public/mascot/maryam_banner.png  1920x600 hero banner
 *   public/mascot/maryam_cutout.png  transparent full-body Maryam
 *   public/mascot/maryam_icon.png    square Maryam avatar
 *   public/mascot/maryam_icon.svg    avatar used by the quote block
 *
 * WebP variants and favicons are produced here as well. The regular
 * `generate-logo-assets.mjs` / `generate-mascot-manifest.mjs` scripts then
 * consume the real PNGs on predev/prebuild.
 *
 * Usage:
 *   REBRAND_SOURCE_DIR="E:/path/to/images" node scripts/generate-rebrand-assets.mjs
 *
 * The default source directory is the sibling `ETM/images` folder. Source
 * artwork is never copied into the repository verbatim; only the derived,
 * cropped assets above are written.
 */

import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

import { decodePng, encodePng } from "./lib/png-tools.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const mascotDir = join(root, "public", "mascot");
const sourceDir =
  process.env.REBRAND_SOURCE_DIR || join(root, "..", "ETM", "images");

const SOURCES = {
  logo: join(sourceDir, "Maryam\u2019s Neon Education Tech Logo.png"),
  neon: join(sourceDir, "Neon Tech Learning with Maryam.png"),
  sheet: join(sourceDir, "Tech Hijab Character Design Sheet.png"),
};

for (const [name, file] of Object.entries(SOURCES)) {
  if (!existsSync(file)) {
    throw new Error(
      `Missing ${name} source: ${file}\nSet REBRAND_SOURCE_DIR to the folder containing the designer PNGs.`
    );
  }
}

const BG = [19, 17, 64];

function rgbaAt(img, x, y) {
  const i = (y * img.width + x) * 4;
  return [img.data[i], img.data[i + 1], img.data[i + 2], img.data[i + 3]];
}

function crop(img, left, top, width, height) {
  const data = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y += 1) {
    const from = ((top + y) * img.width + left) * 4;
    img.data.copy(data, y * width * 4, from, from + width * 4);
  }
  return { width, height, data };
}

function contentBox(img, threshold = 8) {
  let minX = img.width;
  let minY = img.height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < img.height; y += 1) {
    for (let x = 0; x < img.width; x += 1) {
      if (img.data[(y * img.width + x) * 4 + 3] > threshold) {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
    }
  }
  if (maxX < 0) return { left: 0, top: 0, width: img.width, height: img.height };
  return {
    left: minX,
    top: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
}

function trim(img, threshold = 8, pad = 0) {
  const box = contentBox(img, threshold);
  const left = Math.max(0, box.left - pad);
  const top = Math.max(0, box.top - pad);
  const right = Math.min(img.width, box.left + box.width + pad);
  const bottom = Math.min(img.height, box.top + box.height + pad);
  return crop(img, left, top, right - left, bottom - top);
}

function resizeBilinear(img, width, height) {
  const data = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y += 1) {
    const sy = ((y + 0.5) * img.height) / height - 0.5;
    const y0 = Math.max(0, Math.floor(sy));
    const y1 = Math.min(img.height - 1, y0 + 1);
    const fy = Math.max(0, sy - y0);
    for (let x = 0; x < width; x += 1) {
      const sx = ((x + 0.5) * img.width) / width - 0.5;
      const x0 = Math.max(0, Math.floor(sx));
      const x1 = Math.min(img.width - 1, x0 + 1);
      const fx = Math.max(0, sx - x0);
      const i00 = (y0 * img.width + x0) * 4;
      const i10 = (y0 * img.width + x1) * 4;
      const i01 = (y1 * img.width + x0) * 4;
      const i11 = (y1 * img.width + x1) * 4;
      for (let c = 0; c < 4; c += 1) {
        const top = img.data[i00 + c] * (1 - fx) + img.data[i10 + c] * fx;
        const bottom = img.data[i01 + c] * (1 - fx) + img.data[i11 + c] * fx;
        data[(y * width + x) * 4 + c] = Math.round(top * (1 - fy) + bottom * fy);
      }
    }
  }
  return { width, height, data };
}

function composite(bottom, top, left, topY) {
  const data = Buffer.from(bottom.data);
  for (let y = 0; y < top.height; y += 1) {
    const targetY = topY + y;
    if (targetY < 0 || targetY >= bottom.height) continue;
    for (let x = 0; x < top.width; x += 1) {
      const targetX = left + x;
      if (targetX < 0 || targetX >= bottom.width) continue;
      const si = (y * top.width + x) * 4;
      const di = (targetY * bottom.width + targetX) * 4;
      const a = top.data[si + 3] / 255;
      if (a === 0) continue;
      for (let c = 0; c < 3; c += 1) {
        data[di + c] = Math.round(
          top.data[si + c] * a + data[di + c] * (1 - a)
        );
      }
      data[di + 3] = Math.max(data[di + 3], top.data[si + 3]);
    }
  }
  return { width: bottom.width, height: bottom.height, data };
}

function extractLogo(img, x0, y0, x1, y1) {
  const width = x1 - x0;
  const height = y1 - y0;
  const data = Buffer.alloc(width * height * 4);
  const maxBg = Math.max(...BG);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const [r, g, b, a0] = rgbaAt(img, x0 + x, y0 + y);
      const maxC = Math.max(r, g, b);
      let alpha =
        Math.max(0, Math.min(1, (maxC - maxBg) / (255 - maxBg))) *
        (a0 / 255);
      if (alpha < 0.1) alpha = 0;
      let fr = 0;
      let fg = 0;
      let fb = 0;
      if (alpha > 0) {
        fr = (r - (1 - alpha) * BG[0]) / alpha;
        fg = (g - (1 - alpha) * BG[1]) / alpha;
        fb = (b - (1 - alpha) * BG[2]) / alpha;
      }
      const di = (y * width + x) * 4;
      data[di] = Math.max(0, Math.min(255, Math.round(fr)));
      data[di + 1] = Math.max(0, Math.min(255, Math.round(fg)));
      data[di + 2] = Math.max(0, Math.min(255, Math.round(fb)));
      data[di + 3] = Math.round(alpha * 255);
    }
  }
  return { width, height, data };
}

function connectedComponents(img, threshold = 10) {
  const { width, height, data } = img;
  const seen = new Uint8Array(width * height);
  const list = [];
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];
  for (let sy = 0; sy < height; sy += 1) {
    for (let sx = 0; sx < width; sx += 1) {
      const start = sy * width + sx;
      if (seen[start] || data[start * 4 + 3] <= threshold) continue;
      const stack = [start];
      seen[start] = 1;
      let area = 0;
      let minX = sx;
      let maxX = sx;
      let minY = sy;
      let maxY = sy;
      const pixels = [];
      while (stack.length) {
        const p = stack.pop();
        const x = p % width;
        const y = Math.floor(p / width);
        area += 1;
        pixels.push(p);
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
        for (const [dx, dy] of dirs) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          const ni = ny * width + nx;
          if (!seen[ni] && data[ni * 4 + 3] > threshold) {
            seen[ni] = 1;
            stack.push(ni);
          }
        }
      }
      list.push({ area, minX, maxX, minY, maxY, pixels });
    }
  }
  return list.sort((a, b) => b.area - a.area);
}

function keepComponents(img, predicate) {
  const data = Buffer.alloc(img.width * img.height * 4);
  for (const component of connectedComponents(img)) {
    if (!predicate(component)) continue;
    for (const p of component.pixels) {
      const i = p * 4;
      data[i] = img.data[i];
      data[i + 1] = img.data[i + 1];
      data[i + 2] = img.data[i + 2];
      data[i + 3] = img.data[i + 3];
    }
  }
  return { width: img.width, height: img.height, data };
}

function composeHorizontal(parts, pad = 16, gap = 20) {
  const width =
    pad * 2 + parts.reduce((sum, part) => sum + part.width, 0) + gap * (parts.length - 1);
  const height = pad * 2 + Math.max(...parts.map((part) => part.height));
  const data = Buffer.alloc(width * height * 4);
  let x = pad;
  for (const part of parts) {
    const y = pad + Math.floor((height - pad * 2 - part.height) / 2);
    for (let row = 0; row < part.height; row += 1) {
      const from = row * part.width * 4;
      part.data.copy(data, ((y + row) * width + x) * 4, from, from + part.width * 4);
    }
    x += part.width + gap;
  }
  return { width, height, data };
}

function darkTint(img) {
  const data = Buffer.alloc(img.width * img.height * 4);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.round(img.data[i] * 0.35 + 6);
    data[i + 1] = Math.round(img.data[i + 1] * 0.3 + 6);
    data[i + 2] = Math.round(img.data[i + 2] * 0.4 + 24);
    data[i + 3] = img.data[i + 3];
  }
  return { width: img.width, height: img.height, data };
}

function fillRoundedRect(img, left, top, width, height, radius, colorAt) {
  for (let y = 0; y < img.height; y += 1) {
    for (let x = 0; x < img.width; x += 1) {
      const px = x + 0.5 - (left + width / 2);
      const py = y + 0.5 - (top + height / 2);
      const qx = Math.abs(px) - (width / 2 - radius);
      const qy = Math.abs(py) - (height / 2 - radius);
      const outside =
        Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) +
        Math.min(Math.max(qx, qy), 0) -
        radius;
      if (outside > 0) continue;
      const [r, g, b, a] = colorAt(x, y);
      const i = (y * img.width + x) * 4;
      const alpha = a / 255;
      img.data[i] = Math.round(r * alpha + img.data[i] * (1 - alpha));
      img.data[i + 1] = Math.round(g * alpha + img.data[i + 1] * (1 - alpha));
      img.data[i + 2] = Math.round(b * alpha + img.data[i + 2] * (1 - alpha));
      img.data[i + 3] = Math.max(img.data[i + 3], a);
    }
  }
}

function makeIcon(cube) {
  const size = 512;
  const icon = { width: size, height: size, data: Buffer.alloc(size * size * 4) };
  // Gradient rim, then a dark interior with a soft purple glow. Keeping the
  // glow inside the second rounded rect leaves the outer corners transparent.
  fillRoundedRect(icon, 16, 16, 480, 480, 112, (x, y) => {
    const t = (x + y) / (size * 2);
    return [
      Math.round(168 + (34 - 168) * t),
      Math.round(85 + (211 - 85) * t),
      Math.round(247 + (238 - 247) * t),
      255,
    ];
  });
  fillRoundedRect(icon, 28, 28, 456, 456, 100, (x, y) => {
    const d = Math.hypot(x - 256, y - 256) / 360;
    const glow = Math.max(0, 1 - d) ** 2;
    return [
      Math.round(12 + 80 * glow),
      Math.round(10 + 25 * glow),
      Math.round(31 + 150 * glow),
      255,
    ];
  });

  const scale = Math.min(340 / cube.width, 330 / cube.height);
  const scaled = resizeBilinear(
    cube,
    Math.round(cube.width * scale),
    Math.round(cube.height * scale)
  );
  return composite(
    icon,
    scaled,
    Math.round((size - scaled.width) / 2),
    Math.round((size - scaled.height) / 2)
  );
}

function pngDataUrl(buffer) {
  return `data:image/png;base64,${buffer.toString("base64")}`;
}

async function render(page, imageBuffer, options) {
  const {
    width,
    height,
    type = "image/png",
    quality,
    source,
  } = options;
  const dataUrl = await page.evaluate(
    async ({ src, width, height, type, quality, source }) => {
      const img = new Image();
      img.src = src;
      await img.decode();
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      if (source) {
        ctx.drawImage(
          img,
          source.x,
          source.y,
          source.width,
          source.height,
          0,
          0,
          width,
          height
        );
      } else {
        ctx.drawImage(img, 0, 0, width, height);
      }
      return canvas.toDataURL(type, quality);
    },
    {
      src: pngDataUrl(imageBuffer),
      width,
      height,
      type,
      quality,
      source: source ?? null,
    }
  );
  return Buffer.from(dataUrl.split(",")[1], "base64");
}

async function main() {
  const logoSource = decodePng(await readFile(SOURCES.logo));
  const neonSource = decodePng(await readFile(SOURCES.neon));
  const sheetSource = decodePng(await readFile(SOURCES.sheet));

  // ETM wordmark + cube, isolated from the badge background. Component
  // filtering drops the hand, badge border arcs and the old subtitle pill.
  const wordRaw = extractLogo(logoSource, 600, 734, 1110, 865);
  const wordKept = keepComponents(
    wordRaw,
    (component) => component.area > 3000 && component.maxY - component.minY > 50
  );
  const wordmark = trim(wordKept);

  const cubeRaw = extractLogo(logoSource, 360, 700, 565, 860);
  const cubeKept = keepComponents(cubeRaw, (component) => component.area > 1000);
  const cube = trim(cubeKept);

  const logoFull = composeHorizontal([cube, wordmark]);
  const logoDark = darkTint(logoFull);
  const logoIcon = makeIcon(cube);

  const bannerTop = crop(neonSource, 0, 0, neonSource.width, 362);
  const headshotRaw = trim(crop(sheetSource, 1160, 260, 376, 380), 8, 0);
  const headshotSide = Math.min(headshotRaw.width, headshotRaw.height);
  const headshot = crop(
    headshotRaw,
    Math.floor((headshotRaw.width - headshotSide) / 2),
    Math.floor((headshotRaw.height - headshotSide) / 2),
    headshotSide,
    headshotSide
  );
  // The character sheet has a "Front" label below the feet; stop before it.
  const cutout = trim(crop(sheetSource, 20, 10, 430, 922), 8, 6);

  await writeFile(join(mascotDir, "logo_full.png"), encodePng(logoFull.width, logoFull.height, logoFull.data));
  await writeFile(join(mascotDir, "logo_dark.png"), encodePng(logoDark.width, logoDark.height, logoDark.data));
  await writeFile(join(mascotDir, "logo_icon.png"), encodePng(logoIcon.width, logoIcon.height, logoIcon.data));
  await writeFile(join(mascotDir, "maryam_cutout.png"), encodePng(cutout.width, cutout.height, cutout.data));
  await writeFile(join(mascotDir, "maryam_icon.png"), encodePng(headshot.width, headshot.height, headshot.data));
  await writeFile(join(mascotDir, "maryam_banner.png"), encodePng(bannerTop.width, bannerTop.height, bannerTop.data));

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    const fullPng = await readFile(join(mascotDir, "logo_full.png"));
    const darkPng = await readFile(join(mascotDir, "logo_dark.png"));
    const iconPng = await readFile(join(mascotDir, "logo_icon.png"));
    const cutoutPng = await readFile(join(mascotDir, "maryam_cutout.png"));

    await writeFile(
      join(mascotDir, "logo_full.webp"),
      await render(page, fullPng, {
        width: logoFull.width,
        height: logoFull.height,
        type: "image/webp",
        quality: 0.9,
      })
    );
    await writeFile(
      join(mascotDir, "logo_dark.webp"),
      await render(page, darkPng, {
        width: logoDark.width,
        height: logoDark.height,
        type: "image/webp",
        quality: 0.9,
      })
    );
    await writeFile(
      join(mascotDir, "logo_icon.webp"),
      await render(page, iconPng, {
        width: 512,
        height: 512,
        type: "image/webp",
        quality: 0.9,
      })
    );
    await writeFile(
      join(mascotDir, "maryam_cutout.webp"),
      await render(page, cutoutPng, {
        width: cutout.width,
        height: cutout.height,
        type: "image/webp",
        quality: 0.9,
      })
    );

    // The hero banner is a right-aligned 1920x600 crop of the clean top strip.
    const bannerSourcePng = await readFile(join(mascotDir, "maryam_banner.png"));
    const bannerSource = {
      x: Math.round((bannerTop.width - (1920 * bannerTop.height) / 600) / 2),
      y: 0,
      width: Math.round((1920 * bannerTop.height) / 600),
      height: bannerTop.height,
    };
    // Keep Maryam and the code panel: crop from the right edge instead of centring.
    bannerSource.x = bannerTop.width - bannerSource.width;

    const bannerPng = await render(page, bannerSourcePng, {
      width: 1920,
      height: 600,
      source: bannerSource,
    });
    await writeFile(join(mascotDir, "maryam_banner.png"), bannerPng);

    const bannerWebp = await render(page, bannerPng, {
      width: 1920,
      height: 600,
      type: "image/webp",
      quality: 0.85,
    });
    await writeFile(join(mascotDir, "maryam_banner.webp"), bannerWebp);
    await writeFile(join(mascotDir, "maryam_banner-1920.webp"), bannerWebp);

    for (const width of [480, 768, 1280]) {
      const height = Math.round((width * 600) / 1920);
      const webp = await render(page, bannerPng, {
        width,
        height,
        type: "image/webp",
        quality: 0.85,
      });
      await writeFile(join(mascotDir, `maryam_banner-${width}.webp`), webp);
    }

    // Embed the real headshot in the SVG avatar so the quote block keeps using
    // the required /mascot/maryam_icon.svg path.
    const avatarPng = await render(page, await readFile(join(mascotDir, "maryam_icon.png")), {
      width: 256,
      height: 256,
    });
    await writeFile(join(mascotDir, "maryam_icon.png"), avatarPng);
    // The SVG avatar is shown at 40 px; 128 px keeps it crisp without shipping
    // a 150 KB base64 payload on every page.
    const avatarSmall = await render(page, avatarPng, { width: 128, height: 128 });
    const avatarSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128" role="img" aria-labelledby="maryam-icon-title maryam-icon-desc">
  <title id="maryam-icon-title">Maryam</title>
  <desc id="maryam-icon-desc">Maryam, the ETM learning companion.</desc>
  <image width="128" height="128" href="data:image/png;base64,${avatarSmall.toString("base64")}"/>
</svg>
`;
    await writeFile(join(mascotDir, "maryam_icon.svg"), avatarSvg);
  } finally {
    await browser.close();
  }

  console.log(
    `[rebrand] logo_full ${logoFull.width}x${logoFull.height}; ` +
      `logo_dark ${logoDark.width}x${logoDark.height}; ` +
      `logo_icon ${logoIcon.width}x${logoIcon.height}; ` +
      `banner 1920x600; cutout ${cutout.width}x${cutout.height}; ` +
      `avatar ${headshot.width}x${headshot.height}`
  );
}

main().catch((error) => {
  console.error(`[rebrand] failed: ${error.message}`);
  process.exitCode = 1;
});
