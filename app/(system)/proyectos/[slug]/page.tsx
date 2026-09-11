import Link from "next/link";
import { notFound } from "next/navigation";
import Panel from "@/components/Panel";
import DidPipeline from "@/components/DidPipeline";
import SpecSheet from "@/components/SpecSheet";
import { PROJECTS, STATUS_TONE, getProject, timeAgo } from "@/lib/projects";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const tags = project.systems ?? project.stack ?? [];
  const accessLog = [
    `ACCESS ${project.id}`,
    "loading documentation...",
    "loading build history...",
    "ready.",
  ];

  return (
    <div className="flex flex-col gap-5">
      <Link
        href="/proyectos"
        className="rg-nav-link text-[10px] tracking-[0.15em] text-[var(--rg-text-faint)]"
      >
        {"<"} BACK TO PROJECT DATABASE
      </Link>

      <Panel
        id={project.id}
        title={project.category ? `${project.type} // ${project.category}` : project.type}
        status={{ label: project.status, tone: STATUS_TONE[project.status] }}
      >
        <div className="text-[9px] tracking-[0.1em] mb-3 space-y-0.5" style={{ color: "var(--rg-red-dim)" }}>
          {accessLog.map((line, i) => (
            <p key={i}>{"> "}{line}</p>
          ))}
        </div>

        <h1 className="text-xl tracking-[0.2em] text-[var(--rg-red)] rg-glow-red mb-1">
          {project.name}
        </h1>
        <p className="text-[10px] tracking-[0.1em] mb-4" style={{ color: "var(--rg-text-faint)" }}>
          REV_{project.revision} // LAST MODIFIED {timeAgo(project.lastModified)}
        </p>
        <p className="text-sm text-[var(--rg-text-dim)] mb-4">{project.summary}</p>

        {project.specs && (
          <div className="mb-5 pb-5 border-b max-w-md" style={{ borderColor: "var(--rg-red-line)" }}>
            <SpecSheet specs={project.specs} />
          </div>
        )}

        <div
          className="grid grid-cols-3 sm:grid-cols-4 gap-x-4 gap-y-2 text-[10px] tracking-[0.1em] mb-5 pb-5 border-b"
          style={{ borderColor: "rgba(255, 22, 61,0.2)" }}
        >
          <span>
            REV <span style={{ color: "var(--rg-text)" }}>{project.revision}</span>
          </span>
          <span>
            BUILD <span style={{ color: "var(--rg-text)" }}>{project.build}</span>
          </span>
          <span>
            TESTS <span style={{ color: "var(--rg-text)" }}>{project.tests}</span>
          </span>
          <span>
            FAILURES{" "}
            <span style={{ color: project.failures > 0 ? "var(--rg-orange)" : "var(--rg-text)" }}>
              {project.failures}
            </span>
          </span>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-[9px] tracking-[0.1em] px-1.5 py-0.5 border"
                style={{ borderColor: "var(--rg-red-line)", color: "var(--rg-text-dim)" }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-6 mb-6">
          <DidPipeline stage={project.pipeline} />

          {project.git && (
            <div className="text-[10px] tracking-[0.1em]">
              <p className="mb-1" style={{ color: "var(--rg-text-faint)" }}>
                REPOSITORY
              </p>
              <p className="mb-2" style={{ color: "var(--rg-red-dim)" }}>{project.git.repo}</p>
              <div className="flex flex-col gap-0.5" style={{ color: "var(--rg-text-dim)" }}>
                <span>COMMITS <span style={{ color: "var(--rg-text)" }}>{project.git.commits}</span></span>
                <span>BRANCH <span style={{ color: "var(--rg-text)" }}>{project.git.branch}</span></span>
                <span>LATEST <span style={{ color: "var(--rg-text)" }}>{project.git.latest}</span></span>
              </div>
              <a
                href="#"
                className="rg-action-link inline-block mt-3 text-[10px] tracking-[0.15em] border px-3 py-1.5"
              >
                [ OPEN REPOSITORY ]
              </a>
            </div>
          )}
        </div>

        <div
          className="space-y-3 text-sm text-[var(--rg-text-dim)] leading-relaxed border-t pt-4"
          style={{ borderColor: "var(--rg-red-line-soft)" }}
        >
          {project.description.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {project.postmortem && (
          <div
            className="mt-5 pt-5 border-t text-xs leading-relaxed space-y-2"
            style={{ borderColor: "rgba(255, 22, 61,0.25)" }}
          >
            <p>
              <span className="tracking-[0.1em]" style={{ color: "var(--rg-red)" }}>PROBLEM</span>
              <br />
              {project.postmortem.problem}
            </p>
            <p>
              <span className="tracking-[0.1em]" style={{ color: "var(--rg-red)" }}>CAUSE</span>
              <br />
              {project.postmortem.cause}
            </p>
            <p>
              <span className="tracking-[0.1em]" style={{ color: "var(--rg-green)" }}>FIX</span>
              <br />
              {project.postmortem.fix}
            </p>
            <p>
              <span className="tracking-[0.1em]" style={{ color: "var(--rg-green)" }}>RESULT</span>
              <br />
              {project.postmortem.result}
            </p>
          </div>
        )}
      </Panel>
    </div>
  );
}
