/**
 * Camera RAW files (.dng, .cr2, .nef, .arw, .raf, .raw…) developed in the
 * browser with LibRaw (WebAssembly, in a Web Worker so the page stays
 * responsive). The developed pixels then go through the usual canvas → JPEG
 * step of the admin, which keeps no metadata.
 *
 * LibRaw (~1.4 MB) is only downloaded when a RAW file is chosen. Its files
 * (libraw-wasm 1.6.0, ISC) live in public/tunel/libraw/ and are loaded at run
 * time, not bundled: the bundler cannot handle its self-spawning workers.
 * It uses threads (shared memory), so the admin page is served cross-origin
 * isolated (COOP/COEP headers in next.config.ts).
 */

const WORKER_URL = "/tunel/libraw/worker.js";

type RawImage = { width: number; height: number; colors: number; bits: number; data: Uint8Array | Uint16Array };

/** Minimal client for the libraw-wasm worker: one call at a time, replies matched by id. */
class LibRaw {
  private worker = new Worker(WORKER_URL, { type: "module" });
  private pending = new Map<number, { resolve: (v: unknown) => void; reject: (e: Error) => void }>();
  private nextId = 0;

  constructor() {
    this.worker.onmessage = ({ data }) => {
      const p = this.pending.get(data?.id);
      if (!p) return;
      this.pending.delete(data.id);
      if (data.error) p.reject(new Error(String(data.error)));
      else p.resolve(data.out);
    };
    this.worker.onerror = (e) => {
      console.error("LibRaw worker:", e.message);
      for (const p of this.pending.values()) p.reject(new Error("No se pudo cargar el revelador RAW"));
      this.pending.clear();
    };
  }

  call<T>(fn: string, ...args: unknown[]): Promise<T> {
    const id = this.nextId++;
    return new Promise<T>((resolve, reject) => {
      this.pending.set(id, { resolve: resolve as (v: unknown) => void, reject });
      const transfer = args.filter((a): a is Uint8Array => a instanceof Uint8Array).map((a) => a.buffer as ArrayBuffer);
      this.worker.postMessage({ id, fn, args }, transfer);
    });
  }

  dispose() {
    this.worker.terminate();
  }
}

export const RAW_EXTENSIONS = [
  "raw", "dng", "cr2", "cr3", "crw", "nef", "nrw", "arw", "srf", "sr2", "raf", "orf",
  "rw2", "rwl", "pef", "srw", "3fr", "fff", "iiq", "erf", "kdc", "dcr", "mrw", "mos", "mef", "x3f",
];

export const isRawFile = (file: File) => RAW_EXTENSIONS.includes(file.name.split(".").pop()?.toLowerCase() ?? "");

/** For the file picker's accept attribute. */
export const RAW_ACCEPT = RAW_EXTENSIONS.map((e) => `.${e}`).join(",");

/** Below this many pixels on the long side, the half-size develop is too small and it is redone at full size. */
const MIN_SIDE = 3000;

/** Date taken as "YYYY-MM-DDTHH:MM". LibRaw gives seconds, the camera's local time as if it were UTC. */
function rawDate(seconds: unknown): string | null {
  if (typeof seconds !== "number" || !seconds) return null;
  const ts = new Date(seconds * 1000);
  if (Number.isNaN(ts.getTime()) || ts.getUTCFullYear() < 1990) return null;
  const p = (n: number) => String(n).padStart(2, "0");
  return `${ts.getUTCFullYear()}-${p(ts.getUTCMonth() + 1)}-${p(ts.getUTCDate())}T${p(ts.getUTCHours())}:${p(ts.getUTCMinutes())}`;
}

export async function developRaw(file: File): Promise<{ bitmap: ImageBitmap; date: string | null }> {
  if (!self.crossOriginIsolated) throw new Error("Esta página no puede revelar RAW (falta aislamiento). Recarga la página.");
  const bytes = new Uint8Array(await file.arrayBuffer());

  const develop = async (halfSize: boolean) => {
    const raw = new LibRaw();
    try {
      // The camera's own white balance, sRGB, 8 bits. Rotation comes from the file.
      await raw.call("open", bytes.slice(), { useCameraWb: true, outputColor: 1, outputBps: 8, userQual: 3, halfSize });
      const meta = await raw.call<{ timestamp?: number } | null>("metadata", false);
      const img = await raw.call<RawImage | null>("imageData");
      if (!img) throw new Error("No se pudo revelar este RAW");
      return { img, date: rawDate(meta?.timestamp) };
    } finally {
      raw.dispose();
    }
  };

  // Half size is 4× faster and lighter, and usually still bigger than what one upload can hold.
  let { img, date } = await develop(true);
  if (Math.max(img.width, img.height) < MIN_SIDE) ({ img, date } = await develop(false));

  if (img.bits !== 8 || (img.colors !== 3 && img.colors !== 1)) {
    throw new Error("No se pudo revelar este RAW");
  }
  const { width, height, colors } = img;
  const src = img.data as Uint8Array;
  const rgba = new Uint8ClampedArray(width * height * 4);
  for (let i = 0, j = 0, k = 0; i < width * height; i++, j += colors, k += 4) {
    rgba[k] = src[j];
    rgba[k + 1] = src[colors === 3 ? j + 1 : j];
    rgba[k + 2] = src[colors === 3 ? j + 2 : j];
    rgba[k + 3] = 255;
  }
  const bitmap = await createImageBitmap(new ImageData(rgba, width, height));
  return { bitmap, date };
}
