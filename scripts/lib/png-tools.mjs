/**
 * Tiny dependency-free PNG tools used by scripts/generate-logo-assets.mjs.
 *
 * Why this exists: the build must be able to derive favicon sizes and a
 * multi-size .ico from the designer's `logo_icon.png` even on a machine where
 * `sharp` and `cwebp` are not installed. This module intentionally supports
 * only the common 8-bit, non-interlaced PNG subset (grey, RGB, palette,
 * grey+alpha, RGBA); anything else throws and the generator falls back to the
 * original PNG. WebP still requires sharp/cwebp.
 */

import { deflateSync, inflateSync } from "node:zlib";

const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

const CHANNELS = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 };

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buffer) {
  let c = 0xffffffff;
  for (let i = 0; i < buffer.length; i += 1) {
    c = CRC_TABLE[(c ^ buffer[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

export function isPng(buffer) {
  return buffer.length >= 8 && buffer.subarray(0, 8).equals(PNG_SIGNATURE);
}

export function readPngSize(buffer) {
  if (!isPng(buffer) || buffer.length < 24) throw new Error("not a PNG file");
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

/** Decodes an 8-bit, non-interlaced PNG into tightly packed RGBA bytes. */
export function decodePng(buffer) {
  if (!isPng(buffer)) throw new Error("not a PNG file");

  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  let interlace = 0;
  let palette = null;
  let paletteAlpha = null;
  const idat = [];

  let offset = 8;
  while (offset + 8 <= buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString("ascii", offset + 4, offset + 8);
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;
    if (dataEnd + 4 > buffer.length) throw new Error("truncated PNG chunk");
    const data = buffer.subarray(dataStart, dataEnd);

    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
      interlace = data[12];
    } else if (type === "PLTE") {
      palette = data;
    } else if (type === "tRNS") {
      paletteAlpha = data;
    } else if (type === "IDAT") {
      idat.push(data);
    } else if (type === "IEND") {
      break;
    }

    offset = dataEnd + 4;
  }

  if (!width || !height) throw new Error("PNG missing IHDR");
  if (bitDepth !== 8) throw new Error(`unsupported PNG bit depth ${bitDepth}`);
  if (interlace !== 0) throw new Error("interlaced PNG is not supported");
  const channels = CHANNELS[colorType];
  if (!channels) throw new Error(`unsupported PNG colour type ${colorType}`);
  if (colorType === 3 && !palette) throw new Error("indexed PNG missing PLTE");
  if (!idat.length) throw new Error("PNG missing IDAT");

  const inflated = inflateSync(Buffer.concat(idat));
  const stride = width * channels;
  if (inflated.length < (stride + 1) * height) {
    throw new Error("PNG pixel data is truncated");
  }

  // Undo the per-scanline filters into one contiguous buffer.
  const raw = Buffer.alloc(stride * height);
  let read = 0;
  for (let y = 0; y < height; y += 1) {
    const filter = inflated[read];
    read += 1;
    const row = y * stride;
    const prev = (y - 1) * stride;
    for (let x = 0; x < stride; x += 1) {
      const byte = inflated[read];
      read += 1;
      const left = x >= channels ? raw[row + x - channels] : 0;
      const up = y > 0 ? raw[prev + x] : 0;
      const upLeft = y > 0 && x >= channels ? raw[prev + x - channels] : 0;
      let value;
      if (filter === 0) value = byte;
      else if (filter === 1) value = byte + left;
      else if (filter === 2) value = byte + up;
      else if (filter === 3) value = byte + ((left + up) >> 1);
      else if (filter === 4) value = byte + paeth(left, up, upLeft);
      else throw new Error(`unknown PNG filter ${filter}`);
      raw[row + x] = value & 0xff;
    }
  }

  // Expand to RGBA.
  const rgba = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i += 1) {
    const source = i * channels;
    const target = i * 4;

    if (colorType === 0) {
      const grey = raw[source];
      rgba[target] = grey;
      rgba[target + 1] = grey;
      rgba[target + 2] = grey;
      rgba[target + 3] = 255;
    } else if (colorType === 2) {
      rgba[target] = raw[source];
      rgba[target + 1] = raw[source + 1];
      rgba[target + 2] = raw[source + 2];
      rgba[target + 3] = 255;
    } else if (colorType === 3) {
      const index = raw[source];
      const paletteOffset = index * 3;
      if (paletteOffset + 2 >= palette.length) throw new Error("PNG palette index out of range");
      rgba[target] = palette[paletteOffset];
      rgba[target + 1] = palette[paletteOffset + 1];
      rgba[target + 2] = palette[paletteOffset + 2];
      rgba[target + 3] = paletteAlpha && index < paletteAlpha.length ? paletteAlpha[index] : 255;
    } else if (colorType === 4) {
      const grey = raw[source];
      rgba[target] = grey;
      rgba[target + 1] = grey;
      rgba[target + 2] = grey;
      rgba[target + 3] = raw[source + 1];
    } else {
      rgba[target] = raw[source];
      rgba[target + 1] = raw[source + 1];
      rgba[target + 2] = raw[source + 2];
      rgba[target + 3] = raw[source + 3];
    }
  }

  return { width, height, data: rgba };
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const typeBuffer = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);
  return Buffer.concat([length, typeBuffer, data, crc]);
}

/** Encodes tightly packed RGBA bytes as an 8-bit RGBA PNG. */
export function encodePng(width, height, rgba) {
  if (rgba.length !== width * height * 4) throw new Error("RGBA buffer size mismatch");
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y += 1) {
    raw[y * (stride + 1)] = 0; // filter: none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // colour type: RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    PNG_SIGNATURE,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function sampleArea(source, width, height, left, top, size, targetSize) {
  const output = Buffer.alloc(targetSize * targetSize * 4);
  const scale = size / targetSize;
  const sourceWidth = width;

  for (let dy = 0; dy < targetSize; dy += 1) {
    for (let dx = 0; dx < targetSize; dx += 1) {
      const target = (dy * targetSize + dx) * 4;

      if (scale <= 1) {
        // Upscale: nearest neighbour at the destination pixel centre.
        const sx = Math.min(width - 1, Math.floor(left + (dx + 0.5) * scale));
        const sy = Math.min(height - 1, Math.floor(top + (dy + 0.5) * scale));
        const sourceOffset = (sy * sourceWidth + sx) * 4;
        source.copy(output, target, sourceOffset, sourceOffset + 4);
        continue;
      }

      const x0 = left + dx * scale;
      const x1 = left + (dx + 1) * scale;
      const y0 = top + dy * scale;
      const y1 = top + (dy + 1) * scale;
      const ix0 = Math.max(0, Math.floor(x0));
      const ix1 = Math.min(width, Math.ceil(x1));
      const iy0 = Math.max(0, Math.floor(y0));
      const iy1 = Math.min(height, Math.ceil(y1));

      let weight = 0;
      let alpha = 0;
      let red = 0;
      let green = 0;
      let blue = 0;

      for (let sy = iy0; sy < iy1; sy += 1) {
        const wy = Math.min(y1, sy + 1) - Math.max(y0, sy);
        if (wy <= 0) continue;
        for (let sx = ix0; sx < ix1; sx += 1) {
          const wx = Math.min(x1, sx + 1) - Math.max(x0, sx);
          if (wx <= 0) continue;
          const w = wx * wy;
          const offset = (sy * sourceWidth + sx) * 4;
          const a = source[offset + 3];
          weight += w;
          alpha += a * w;
          red += source[offset] * a * w;
          green += source[offset + 1] * a * w;
          blue += source[offset + 2] * a * w;
        }
      }

      if (weight > 0 && alpha > 0) {
        output[target] = Math.round(red / alpha);
        output[target + 1] = Math.round(green / alpha);
        output[target + 2] = Math.round(blue / alpha);
        output[target + 3] = Math.round(alpha / weight);
      }
    }
  }

  return output;
}

/**
 * Centre-crops a PNG to a square and resizes it to `size` × `size`.
 * Area averaging is used for downscales (premultiplied alpha, so transparent
 * edges do not get dark fringes); nearest neighbour is used to upscale.
 */
export function resizeSquarePng(buffer, size) {
  if (!Number.isInteger(size) || size <= 0) throw new Error("invalid icon size");
  const { width, height, data } = decodePng(buffer);
  const crop = Math.min(width, height);
  const left = (width - crop) / 2;
  const top = (height - crop) / 2;
  const resized = sampleArea(data, width, height, left, top, crop, size);
  return encodePng(size, size, resized);
}

/** Builds a multi-image .ico container with PNG-compressed entries. */
export function buildIco(entries) {
  if (!entries.length) throw new Error("ICO needs at least one image");
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(entries.length, 4);

  const directory = Buffer.alloc(entries.length * 16);
  let offset = header.length + directory.length;

  entries.forEach((entry, index) => {
    const base = index * 16;
    directory[base] = entry.size >= 256 ? 0 : entry.size;
    directory[base + 1] = entry.size >= 256 ? 0 : entry.size;
    directory[base + 2] = 0; // palette colours
    directory[base + 3] = 0; // reserved
    directory.writeUInt16LE(1, base + 4); // colour planes
    directory.writeUInt16LE(32, base + 6); // bits per pixel
    directory.writeUInt32LE(entry.data.length, base + 8);
    directory.writeUInt32LE(offset, base + 12);
    offset += entry.data.length;
  });

  return Buffer.concat([header, directory, ...entries.map((entry) => entry.data)]);
}
