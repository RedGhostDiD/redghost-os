import tunelData from "@/data/tunel.json";
import tunelSettings from "@/data/tunel-settings.json";
import { PHOTO_DATE_RE } from "@/lib/photo-date";

/**
 * Photos of the /tunel archive. Sourced from data/tunel.json, which the
 * /tunel/admin page edits through GitHub commits (each save triggers a
 * Vercel redeploy). Image files live in public/uploads/tunel/<year>/.
 */
export interface TunelPhoto {
  /** Stable id, also the file name of the image. */
  id: string;
  /** Light version shown in the tunnel, e.g. "/uploads/tunel/2024/m3k9x2.jpg". */
  src: string;
  /** Original quality, shown when the photo is opened. Falls back to src. */
  full?: string;
  /** Year section of the tunnel, or null for photos without a year. */
  year: number | null;
  /** When it was taken: "YYYY-MM-DD" or "YYYY-MM-DDTHH:MM". Read from the photo on upload, editable in the admin. */
  date?: string;
}

/** Tunnel options edited in the CONFIGURACIÓN section of /tunel/admin (data/tunel-settings.json). */
export interface TunelSettings {
  /** Instagram-like film grain over the opened photo. */
  viewerGrain: boolean;
}

export const DEFAULT_TUNEL_SETTINGS: TunelSettings = { viewerGrain: true };

/** Keeps only known keys with the right type; anything else falls back to the default. */
export function normalizeTunelSettings(v: unknown): TunelSettings {
  const o = (v && typeof v === "object" ? v : {}) as Record<string, unknown>;
  return {
    viewerGrain: typeof o.viewerGrain === "boolean" ? o.viewerGrain : DEFAULT_TUNEL_SETTINGS.viewerGrain,
  };
}

export function getTunelSettings(): TunelSettings {
  return normalizeTunelSettings(tunelSettings);
}

/** Where uploaded tunnel images are stored inside the repo. */
export const TUNEL_UPLOAD_DIR = "public/uploads/tunel";

/** Validates one entry read from JSON or sent by the admin. */
export function isTunelPhoto(v: unknown): v is TunelPhoto {
  if (!v || typeof v !== "object") return false;
  const p = v as Record<string, unknown>;
  return (
    typeof p.id === "string" &&
    /^[a-z0-9-]{4,40}$/.test(p.id) &&
    typeof p.src === "string" &&
    (p.full === undefined || typeof p.full === "string") &&
    (p.date === undefined || (typeof p.date === "string" && PHOTO_DATE_RE.test(p.date))) &&
    (p.year === null || (typeof p.year === "number" && Number.isInteger(p.year) && p.year >= 1900 && p.year <= 2100))
  );
}

/** Sorts by year (photos without a year go last), keeping the saved order inside each year. */
export function sortTunelPhotos<T extends TunelPhoto>(photos: T[]): T[] {
  return photos
    .map((p, i) => ({ p, i }))
    .sort((a, b) => (a.p.year ?? 9999) - (b.p.year ?? 9999) || a.i - b.i)
    .map(({ p }) => p);
}

/** Sample photos shown while the archive is still empty. */
function samplePhotos(): TunelPhoto[] {
  const sizes = ["600/800", "800/600", "700/700", "600/900", "900/600"];
  return Array.from({ length: 24 }, (_, i) => ({
    id: `sample-${i + 1}`,
    src: `https://picsum.photos/seed/tunel${i + 1}/${sizes[i % sizes.length]}?grayscale`,
    year: 2020 + Math.floor(i / 4),
  }));
}

export function getTunelPhotos(): TunelPhoto[] {
  const saved = (tunelData as unknown[]).filter(isTunelPhoto);
  return saved.length ? sortTunelPhotos(saved) : samplePhotos();
}
