/**
 * Camera RAW files (.dng, .cr2, .nef, .arw, .raf, .raw…) in the browser.
 *
 * Browsers cannot decode RAW sensor data, but every camera stores a finished
 * JPEG inside the RAW file (the one the camera shows on its screen; on most
 * cameras it is full size). This finds the biggest one, applies the
 * camera's rotation and returns it as an ImageBitmap, ready for the usual
 * canvas → JPEG step (which also drops all metadata).
 */

export const RAW_EXTENSIONS = [
  "raw", "dng", "cr2", "cr3", "crw", "nef", "nrw", "arw", "srf", "sr2", "raf", "orf",
  "rw2", "rwl", "pef", "srw", "3fr", "fff", "iiq", "erf", "kdc", "dcr", "mrw", "mos", "mef", "x3f",
];

export const isRawFile = (file: File) => {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  return RAW_EXTENSIONS.includes(ext);
};

/** For the file picker's accept attribute. */
export const RAW_ACCEPT = RAW_EXTENSIONS.map((e) => `.${e}`).join(",");

type Jpeg = { start: number; end: number; width: number; height: number; orientation: number | null };

/** EXIF orientation (tag 0x0112) of the TIFF structure at `base`, or null. */
function tiffOrientation(v: DataView, base: number): number | null {
  if (base + 8 > v.byteLength) return null;
  const order = v.getUint16(base);
  if (order !== 0x4949 && order !== 0x4d4d) return null;
  const le = order === 0x4949;
  const ifd = base + v.getUint32(base + 4, le);
  if (ifd + 2 > v.byteLength) return null;
  const count = v.getUint16(ifd, le);
  for (let i = 0; i < count; i++) {
    const e = ifd + 2 + i * 12;
    if (e + 12 > v.byteLength) return null;
    if (v.getUint16(e, le) === 0x0112) {
      const o = v.getUint16(e + 8, le);
      return o >= 1 && o <= 8 ? o : null;
    }
  }
  return null;
}

/**
 * Reads the JPEG that starts at `start`: walks its segments (so thumbnails
 * nested inside its EXIF are skipped), takes size and orientation, and finds
 * its end. Null if it is not a JPEG the browser can show.
 */
function readJpeg(v: DataView, start: number): Jpeg | null {
  let p = start + 2;
  let width = 0;
  let height = 0;
  let orientation: number | null = null;
  while (p + 4 <= v.byteLength) {
    if (v.getUint8(p) !== 0xff) return null;
    const marker = v.getUint8(p + 1);
    if (marker === 0xff) {
      p++;
      continue;
    }
    const len = v.getUint16(p + 2);
    // Baseline / extended / progressive. Lossless (0xC3, the RAW data itself in some files) is not decodable.
    if (marker === 0xc0 || marker === 0xc1 || marker === 0xc2) {
      height = v.getUint16(p + 5);
      width = v.getUint16(p + 7);
    } else if (marker === 0xc3 || (marker >= 0xc5 && marker <= 0xcf && marker !== 0xc8 && marker !== 0xcc)) {
      return null;
    } else if (marker === 0xe1 && v.getUint32(p + 4) === 0x45786966 /* "Exif" */) {
      orientation = tiffOrientation(v, p + 10);
    }
    if (marker === 0xda) {
      // Image data: ends at the first FFD9 (other FFxx inside it are stuffed bytes or restart markers).
      for (let q = p + 2 + len; q + 1 < v.byteLength; q++) {
        if (v.getUint8(q) === 0xff && v.getUint8(q + 1) === 0xd9) {
          return width && height ? { start, end: q + 2, width, height, orientation } : null;
        }
      }
      return null;
    }
    p += 2 + len;
  }
  return null;
}

/** Draws the bitmap upright according to an EXIF orientation (1–8). */
async function orient(bitmap: ImageBitmap, o: number): Promise<ImageBitmap> {
  if (o === 1) return bitmap;
  const swap = o >= 5;
  const w = bitmap.width;
  const h = bitmap.height;
  const canvas = new OffscreenCanvas(swap ? h : w, swap ? w : h);
  const ctx = canvas.getContext("2d");
  if (!ctx) return bitmap;
  const t: Record<number, [number, number, number, number, number, number]> = {
    2: [-1, 0, 0, 1, w, 0],
    3: [-1, 0, 0, -1, w, h],
    4: [1, 0, 0, -1, 0, h],
    5: [0, 1, 1, 0, 0, 0],
    6: [0, 1, -1, 0, h, 0],
    7: [0, -1, -1, 0, h, w],
    8: [0, -1, 1, 0, 0, w],
  };
  ctx.setTransform(...t[o]);
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();
  return canvas.transferToImageBitmap();
}

export async function rawToBitmap(file: File): Promise<ImageBitmap> {
  const buf = await file.arrayBuffer();
  const v = new DataView(buf);
  const bytes = new Uint8Array(buf);

  let best: Jpeg | null = null;
  for (let i = 0; i + 3 < bytes.length; i++) {
    if (bytes[i] !== 0xff || bytes[i + 1] !== 0xd8 || bytes[i + 2] !== 0xff) continue;
    const jpeg = readJpeg(v, i);
    if (!jpeg) continue;
    if (!best || jpeg.width * jpeg.height > best.width * best.height) best = jpeg;
    i = jpeg.end - 1; // skip over its data
  }
  if (!best) throw new Error("Este RAW no trae una foto que el navegador pueda leer");

  // Rotation: the RAW's own (TIFF-based files: DNG, CR2, NEF, ARW…), else the preview's EXIF.
  const o = tiffOrientation(v, 0) ?? best.orientation ?? 1;
  const blob = new Blob([bytes.subarray(best.start, best.end)], { type: "image/jpeg" });
  const bitmap = await createImageBitmap(blob, { imageOrientation: "none" });
  return orient(bitmap, o);
}
