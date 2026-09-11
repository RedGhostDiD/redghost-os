export interface ChangelogEntry {
  date: string; // MM.DD.YY
  items: string[];
}

/** Placeholder — update by hand as the site changes, newest first. */
export const CHANGELOG: ChangelogEntry[] = [
  { date: "09.10.26", items: ["Added breach protocol minigame to LAB", "Reworked system-wide UI to square-frame neo style"] },
  { date: "09.09.26", items: ["Added robot-soccer testing notes", "Updated D.I.D interface glow system"] },
  { date: "09.08.26", items: ["Added PCB repository entry for sensor-node"] },
  { date: "09.05.26", items: ["Registered EXP-009 as failed — documented lessons"] },
  { date: "08.31.26", items: ["New project registered: GLITCH UI KIT"] },
];
