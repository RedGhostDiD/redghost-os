export interface Skill {
  label: string;
  /** Filled segments out of 10 — drives the bar width. */
  fill: number;
  level: string;
}

/**
 * Skill levels are not final values — they change when RedGhost builds
 * something that proves they should. Update by hand.
 */
export const SKILLS: Skill[] = [
  { label: "ROBOTICS", fill: 7, level: "INTERMEDIATE" },
  { label: "ELECTRONICS", fill: 7, level: "INTERMEDIATE" },
  { label: "SOFTWARE", fill: 7, level: "INTERMEDIATE" },
  { label: "PYTHON", fill: 7, level: "INTERMEDIATE" },
  { label: "C#", fill: 9, level: "ADVANCED" },
  { label: "C / C++", fill: 8, level: "INTERMEDIATE / ADVANCED" },
  { label: "JAVASCRIPT", fill: 9, level: "ADVANCED" },
  { label: "CAD", fill: 4, level: "BASIC" },
  { label: "PCB DESIGN", fill: 4, level: "BASIC" },
  { label: "AI / ML", fill: 3, level: "BASIC" },
  { label: "EMBEDDED SYSTEMS", fill: 4, level: "BASIC" },
  { label: "COMPUTER REPAIR", fill: 7, level: "INTERMEDIATE" },
  { label: "AUTOMOTIVE", fill: 3, level: "BASIC" },
  { label: "3D MODELING", fill: 5, level: "BASIC / INTERMEDIATE" },
  { label: "UI / UX", fill: 7, level: "INTERMEDIATE" },
  { label: "EXCEL", fill: 3, level: "BASIC" },
  { label: "METROLOGY", fill: 3, level: "BASIC" },
];
