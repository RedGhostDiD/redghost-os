import tunelData from "@/data/tunel.json";

/**
 * Photos of the /tunel archive. Sourced from data/tunel.json, which the
 * /tunel/admin page edits through GitHub commits (each save triggers a
 * Vercel redeploy). Image files live in public/uploads/tunel/<year>/.
 */
export interface TunelPhoto {
  /** Stable id, also the file name of the image. */
  id: string;
  /** Public path, e.g. "/uploads/tunel/2024/m3k9x2.jpg". */
  src: string;
  /** Year section of the tunnel, or null for photos without a year. */
  year: number | null;
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
