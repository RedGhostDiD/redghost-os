import { Project, mostRecent, timeAgo } from "@/lib/projects";

export default function ModuleStats({ projects }: { projects: Project[] }) {
  const activeCount = projects.filter((p) => p.status === "ACTIVE").length;
  const recent = mostRecent(projects);

  return (
    <div
      className="flex flex-wrap gap-x-6 gap-y-1 text-[10px] tracking-[0.1em] mt-4 pt-3 border-t"
      style={{ borderColor: "rgba(255, 22, 61,0.18)", color: "var(--rg-text-faint)" }}
    >
      <span>
        STATUS: <span style={{ color: "var(--rg-green)" }}>{String(activeCount).padStart(2, "0")} ACTIVE</span>
      </span>
      {recent && (
        <span>
          LAST BUILD: <span style={{ color: "var(--rg-red-dim)" }}>{timeAgo(recent.lastModified)}</span>
        </span>
      )}
      <span>
        TOTAL: <span style={{ color: "var(--rg-text-dim)" }}>{projects.length}</span>
      </span>
    </div>
  );
}
