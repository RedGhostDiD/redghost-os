/**
 * The date a photo was taken, read from its EXIF in the browser before the
 * metadata is stripped. Works on JPEG and on TIFF-based camera RAW files
 * (DNG, CR2, NEF, ARW, ORF, RW2, PEF…); other files (RAF, CR3, HEIC…) fall back
 * to the first EXIF-style date found in the file.
 *
 * Stored as "YYYY-MM-DD" or "YYYY-MM-DDTHH:MM".
 */

export const PHOTO_DATE_RE = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])(T([01]\d|2[0-3]):[0-5]\d)?$/;

const EXIF_IFD = 0x8769;
const DATE_ORIGINAL = 0x9003;
const DATE_DIGITIZED = 0x9004;
const DATE_TIME = 0x0132;

/** "2024:05:17 18:42:10" → "2024-05-17T18:42"; null if it is not a real date. */
function fromExif(s: string): string | null {
  const m = /^(\d{4}):(\d{2}):(\d{2})(?: (\d{2}):(\d{2}))?/.exec(s);
  if (!m) return null;
  const date = `${m[1]}-${m[2]}-${m[3]}`;
  const out = m[4] && m[4] !== "00" || m[5] && m[5] !== "00" ? `${date}T${m[4]}:${m[5]}` : date;
  return PHOTO_DATE_RE.test(out) && Number(m[1]) >= 1900 ? out : null;
}

/** Reads the date tags of the TIFF structure at `base` (IFD0, then its EXIF IFD). */
function tiffDate(v: DataView, base: number): string | null {
  if (base + 8 > v.byteLength) return null;
  const order = v.getUint16(base);
  if (order !== 0x4949 && order !== 0x4d4d) return null;
  const le = order === 0x4949;

  const readIfd = (off: number) => {
    const tags = new Map<number, number>(); // tag → offset of its 4-byte value field
    if (off + 2 > v.byteLength) return tags;
    const n = v.getUint16(off, le);
    for (let i = 0; i < n; i++) {
      const e = off + 2 + i * 12;
      if (e + 12 > v.byteLength) break;
      tags.set(v.getUint16(e, le), e);
    }
    return tags;
  };
  const ascii = (entry: number | undefined) => {
    if (entry === undefined) return null;
    const count = v.getUint32(entry + 4, le);
    const at = count > 4 ? base + v.getUint32(entry + 8, le) : entry + 8;
    if (at + count > v.byteLength) return null;
    let s = "";
    for (let i = 0; i < count; i++) {
      const c = v.getUint8(at + i);
      if (!c) break;
      s += String.fromCharCode(c);
    }
    return fromExif(s);
  };

  const ifd0 = readIfd(base + v.getUint32(base + 4, le));
  const exifPtr = ifd0.get(EXIF_IFD);
  const exif = exifPtr !== undefined ? readIfd(base + v.getUint32(exifPtr + 8, le)) : new Map<number, number>();
  return ascii(exif.get(DATE_ORIGINAL)) ?? ascii(exif.get(DATE_DIGITIZED)) ?? ascii(ifd0.get(DATE_TIME));
}

/** Where the EXIF TIFF structure of a JPEG starts, or -1. */
function jpegExifBase(v: DataView): number {
  let p = 2;
  while (p + 10 <= v.byteLength && v.getUint8(p) === 0xff) {
    const marker = v.getUint8(p + 1);
    if (marker === 0xda || marker === 0xd9) break;
    const len = v.getUint16(p + 2);
    if (marker === 0xe1 && v.getUint32(p + 4) === 0x45786966 /* "Exif" */) return p + 10;
    p += 2 + len;
  }
  return -1;
}

export async function readPhotoDate(file: Blob): Promise<string | null> {
  // EXIF is near the start; RAW files can keep it a bit further in.
  const buf = await file.slice(0, 4 * 1024 * 1024).arrayBuffer();
  const v = new DataView(buf);
  if (v.byteLength < 12) return null;
  try {
    let date: string | null = null;
    if (v.getUint16(0) === 0xffd8) {
      const base = jpegExifBase(v);
      if (base >= 0) date = tiffDate(v, base);
    } else {
      date = tiffDate(v, 0);
    }
    if (date) return date;
  } catch {
    // Malformed EXIF: fall through to the text search.
  }
  // Any other container: the first EXIF-style date in the file.
  const text = new TextDecoder("latin1").decode(new Uint8Array(buf));
  const m = /(19|20)\d{2}:[01]\d:[0-3]\d [0-2]\d:[0-5]\d:[0-5]\d/.exec(text);
  return m ? fromExif(m[0]) : null;
}

/** "2024-05-17T18:42" → "17.05.2024 · 18:42" */
export function formatPhotoDate(d: string): string {
  const [date, time] = d.split("T");
  const [y, m, day] = date.split("-");
  return `${day}.${m}.${y}${time ? ` · ${time}` : ""}`;
}
