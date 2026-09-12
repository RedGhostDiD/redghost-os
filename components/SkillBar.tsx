import type { Skill } from "@/lib/skills";

export default function SkillBar({ skill }: { skill: Skill }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-[10px] tracking-[0.1em]">
      <span className="sm:w-40 shrink-0" style={{ color: "var(--rg-text)" }}>
        {skill.label}
      </span>
      <div className="flex-1 flex items-center gap-0.5" aria-hidden="true">
        {Array.from({ length: 10 }, (_, i) => (
          <span
            key={i}
            className="h-2 flex-1"
            style={{
              background: i < skill.fill ? "var(--rg-red)" : "var(--rg-red-line-soft)",
              boxShadow: i < skill.fill ? "0 0 4px var(--rg-red)" : undefined,
            }}
          />
        ))}
      </div>
      <span className="sm:w-44 sm:text-right shrink-0" style={{ color: "var(--rg-text-faint)" }}>
        {skill.level}
      </span>
    </div>
  );
}
