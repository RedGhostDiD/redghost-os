import type { PipelineStage } from "@/lib/projects";

const STAGES: { key: PipelineStage; label: string }[] = [
  { key: "draw", label: "DRAW" },
  { key: "think", label: "THINK" },
  { key: "build", label: "BUILD" },
  { key: "test", label: "TEST" },
  { key: "iterate", label: "ITERATE" },
];

export default function DidPipeline({
  stage,
  compact = false,
}: {
  stage: PipelineStage;
  compact?: boolean;
}) {
  const currentIndex = STAGES.findIndex((s) => s.key === stage);

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 text-[9px] tracking-[0.1em]">
        {STAGES.map((s, i) => {
          const state = i < currentIndex ? "done" : i === currentIndex ? "current" : "pending";
          const color =
            state === "done"
              ? "var(--rg-green)"
              : state === "current"
              ? "var(--rg-red-dim)"
              : "var(--rg-text-faint)";
          return (
            <span key={s.key} className="flex items-center gap-1" style={{ color }}>
              <span>{state === "done" ? "✓" : state === "current" ? "●" : "○"}</span>
              {i < STAGES.length - 1 && <span style={{ color: "var(--rg-text-faint)" }}>/</span>}
            </span>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 text-[10px] tracking-[0.15em]">
      <p className="mb-1" style={{ color: "var(--rg-text-faint)" }}>
        D.I.D PIPELINE
      </p>
      {STAGES.map((s, i) => {
        const state = i < currentIndex ? "done" : i === currentIndex ? "current" : "pending";
        const color =
          state === "done"
            ? "var(--rg-green)"
            : state === "current"
            ? "var(--rg-red-dim)"
            : "var(--rg-text-faint)";
        return (
          <div key={s.key} className="flex items-center justify-between w-40" style={{ color }}>
            <span style={state === "current" ? { textShadow: "0 0 8px rgba(255, 22, 61,0.6)" } : undefined}>
              {String(i + 1).padStart(2, "0")} {s.label}
            </span>
            <span>{state === "done" ? "✓" : state === "current" ? "●" : "○"}</span>
          </div>
        );
      })}
    </div>
  );
}
