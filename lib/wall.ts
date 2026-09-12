import wallData from "@/data/wall.json";

export type WallContentType = "TEXT" | "IMAGE" | "VIDEO" | "IMAGE_TEXT" | "VIDEO_TEXT";
export type WallMood = "BUILD" | "FAIL" | "IDEA" | "TEST" | "RANDOM";
export type WallStatus = "ONLINE" | "FAILED" | "SOLVED" | "WIP" | "ARCHIVED";

export interface WallPost {
  /** URL-safe key, e.g. "018" — used for admin routes. */
  slug: string;
  /** Display code, e.g. "RG//WALL_018". */
  id: string;
  type: WallContentType;
  mood: WallMood;
  status: WallStatus;
  /** Lines of text — rendered one per line, preserving "> " quote-style prefixes as written. */
  text: string[];
  /** Public path to an uploaded image, for IMAGE / IMAGE_TEXT posts. */
  image?: string;
  /** External video URL (YouTube/TikTok/etc.), for VIDEO / VIDEO_TEXT posts. */
  videoUrl?: string;
  /** Optional slug of a real project this post relates to. */
  projectSlug?: string;
  createdAt: string;
  /** Kept in the data and editable in /admin, but excluded from the public wall. */
  hidden?: boolean;
}

/**
 * Wall post database. Sourced from data/wall.json. Mirrors lib/projects.ts:
 * WALL_POSTS is pre-filtered to exclude hidden posts, so every public page
 * only ever sees the visible set. /admin reads the raw file directly (via
 * lib/github-content.ts), so hidden posts still show up there for editing.
 */
export const WALL_POSTS: WallPost[] = (wallData as WallPost[])
  .filter((p) => !p.hidden)
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

export function nextWallSlug(existing: WallPost[]): { slug: string; id: string } {
  const nums = existing.map((p) => parseInt(p.slug, 10)).filter((n) => !Number.isNaN(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  const padded = String(next).padStart(3, "0");
  return { slug: padded, id: `RG//WALL_${padded}` };
}

export const MOOD_TONE: Record<WallMood, "green" | "orange" | "orange-dim" | "red" | "red-dim"> = {
  BUILD: "orange",
  FAIL: "red",
  IDEA: "orange-dim",
  TEST: "green",
  RANDOM: "red-dim",
};

export const STATUS_TONE: Record<WallStatus, "green" | "orange" | "orange-dim" | "red" | "red-dim"> = {
  ONLINE: "green",
  WIP: "orange",
  SOLVED: "green",
  FAILED: "red",
  ARCHIVED: "red-dim",
};

export function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ${mins % 60}m ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ${hours % 24}h ago`;
}
