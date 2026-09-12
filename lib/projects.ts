import projectsData from "@/data/projects.json";

export type ProjectType = "ROBOTICS" | "SOFTWARE" | "HARDWARE" | "DESIGN";

export type ProjectStatus =
  | "ACTIVE"
  | "WIP"
  | "EXPERIMENTAL"
  | "PROTOTYPE"
  | "TESTING"
  | "FAILED"
  | "ARCHIVED";

export type PipelineStage = "draw" | "think" | "build" | "test" | "iterate";

export interface GitInfo {
  repo: string;
  commits: number;
  branch: string;
  latest: string;
}

export interface Postmortem {
  problem: string;
  cause: string;
  fix: string;
  result: string;
}

export interface Project {
  slug: string;
  id: string;
  name: string;
  type: ProjectType;
  status: ProjectStatus;
  category?: string;
  systems?: string[];
  stack?: string[];
  /** Public path to a thumbnail image, e.g. "/uploads/proyectos/mk47.jpg". */
  image?: string;
  /** Kept in the data and editable in /admin, but excluded from every public listing/page. */
  hidden?: boolean;
  /** Real engineering spec lines, e.g. ["MCU", "ESP32-S3"] — shown as a small spec sheet. */
  specs?: [string, string][];
  summary: string;
  description: string[];
  revision: string;
  build: number;
  tests: number;
  failures: number;
  /** ISO timestamp — kept in the recent past so timeAgo() never goes negative. */
  lastModified: string;
  pipeline: PipelineStage;
  git?: GitInfo;
  postmortem?: Postmortem;
}

const CATEGORY_CODE: Record<ProjectType, string> = {
  ROBOTICS: "RB",
  SOFTWARE: "SW",
  HARDWARE: "HW",
  DESIGN: "DS",
};

/**
 * Project database. Sourced from data/projects.json — every module page
 * (/robotica, /software, /hardware, /diseno, /laboratorio) reads from this
 * single source, filtered by `type` or `status`. Dashboard counters on
 * /inicio are also derived live from this array. Editable by hand or via
 * the /admin panel, which commits changes to that file through the GitHub API.
 *
 * Projects marked `hidden` are dropped here — every public page/helper
 * below only ever sees the visible set. /admin reads the raw file
 * directly (via lib/github-content.ts), so hidden projects still show up
 * there for editing/unhiding.
 */
export const PROJECTS: Project[] = (projectsData as Project[]).filter((p) => !p.hidden);

export function getProject(slug: string) {
  return PROJECTS.find((p) => p.slug === slug);
}

export function getProjectsByType(type: ProjectType) {
  return PROJECTS.filter((p) => p.type === type);
}

export const LAB_STATUSES: ProjectStatus[] = [
  "WIP",
  "EXPERIMENTAL",
  "PROTOTYPE",
  "TESTING",
  "FAILED",
  "ARCHIVED",
];

export function getLabProjects() {
  return PROJECTS.filter((p) => LAB_STATUSES.includes(p.status));
}

export const STATUS_TONE: Record<ProjectStatus, "green" | "orange" | "orange-dim" | "red" | "red-dim"> = {
  ACTIVE: "green",
  WIP: "orange",
  EXPERIMENTAL: "orange",
  PROTOTYPE: "orange",
  TESTING: "orange-dim",
  FAILED: "red",
  ARCHIVED: "red-dim",
};

export function nextProjectId(type: ProjectType, n: number): string {
  return `RG//${CATEGORY_CODE[type]}-${String(n).padStart(3, "0")}`;
}

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

export function statusCounts(): Record<ProjectStatus, number> {
  const counts: Record<ProjectStatus, number> = {
    ACTIVE: 0,
    WIP: 0,
    EXPERIMENTAL: 0,
    PROTOTYPE: 0,
    TESTING: 0,
    FAILED: 0,
    ARCHIVED: 0,
  };
  for (const p of PROJECTS) counts[p.status]++;
  return counts;
}

export function typeCounts(): Record<ProjectType, number> {
  const counts: Record<ProjectType, number> = { ROBOTICS: 0, SOFTWARE: 0, HARDWARE: 0, DESIGN: 0 };
  for (const p of PROJECTS) counts[p.type]++;
  return counts;
}

export function mostRecent(projects: Project[]): Project | undefined {
  return [...projects].sort(
    (a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
  )[0];
}
