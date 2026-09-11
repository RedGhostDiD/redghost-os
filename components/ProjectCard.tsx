import Link from "next/link";
import Panel from "./Panel";
import DidPipeline from "./DidPipeline";
import SpecSheet from "./SpecSheet";
import { Project, STATUS_TONE, timeAgo } from "@/lib/projects";

export default function ProjectCard({
  project,
  delayMs = 0,
}: {
  project: Project;
  delayMs?: number;
}) {
  const tags = project.systems ?? project.stack ?? [];

  return (
    <Panel
      id={project.id}
      title={project.category ? `${project.type} // ${project.category}` : project.type}
      status={{ label: project.status, tone: STATUS_TONE[project.status] }}
      delayMs={delayMs}
    >
      <h3 className="text-sm tracking-[0.15em] text-[var(--rg-text)] mb-1">
        {project.name}
        <span className="ml-2 text-[10px] tracking-[0.1em]" style={{ color: "var(--rg-text-faint)" }}>
          REV_{project.revision}
        </span>
      </h3>
      <p className="text-xs text-[var(--rg-text-dim)] leading-relaxed mb-3">
        {project.summary}
      </p>

      {project.specs && (
        <div className="mb-3 pb-3 border-b" style={{ borderColor: "var(--rg-red-line)" }}>
          <SpecSheet specs={project.specs} />
        </div>
      )}

      <div
        className="grid grid-cols-3 gap-x-3 gap-y-1 text-[9px] tracking-[0.1em] mb-3 pb-3 border-b"
        style={{ color: "var(--rg-text-faint)", borderColor: "rgba(255, 22, 61,0.18)" }}
      >
        <span>
          BUILD <span style={{ color: "var(--rg-text-dim)" }}>{project.build}</span>
        </span>
        <span>
          TESTS <span style={{ color: "var(--rg-text-dim)" }}>{project.tests}</span>
        </span>
        <span>
          FAILURES{" "}
          <span style={{ color: project.failures > 0 ? "var(--rg-orange)" : "var(--rg-text-dim)" }}>
            {project.failures}
          </span>
        </span>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[9px] tracking-[0.1em] px-1.5 py-0.5 border"
              style={{
                borderColor: "var(--rg-red-line)",
                color: "var(--rg-text-dim)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <DidPipeline stage={project.pipeline} compact />
      </div>

      <div className="flex items-center justify-between gap-2">
        <Link
          href={`/proyectos/${project.slug}`}
          className="rg-action-link inline-block text-[10px] tracking-[0.15em] border px-3 py-1.5"
        >
          [ ACCESS ]
        </Link>
        <span className="text-[9px] tracking-[0.1em]" style={{ color: "var(--rg-text-faint)" }}>
          {timeAgo(project.lastModified)}
        </span>
      </div>
    </Panel>
  );
}
