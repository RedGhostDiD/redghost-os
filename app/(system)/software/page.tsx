import Panel from "@/components/Panel";
import ProjectCard from "@/components/ProjectCard";
import ModuleStats from "@/components/ModuleStats";
import PacketStream from "@/components/decor/PacketStream";
import { getProjectsByType } from "@/lib/projects";

export const metadata = { title: "SOFTWARE // REDGHOST_OS" };

const STACK = ["PYTHON", "C#", "C++", "JAVASCRIPT", "HTML", "CSS", "SQL"];

export default function SoftwarePage() {
  const projects = getProjectsByType("SOFTWARE");

  return (
    <div className="flex flex-col gap-5">
      <Panel id="MOD_030" title="Software Module" status={{ label: "ACTIVE" }}>
        <p className="text-xs text-[var(--rg-text-dim)] leading-relaxed mb-4">
          Aplicaciones, webs, scripts, herramientas y sistemas.
        </p>
        <div className="flex flex-wrap gap-1.5">
          {STACK.map((s) => (
            <span
              key={s}
              className="text-[9px] tracking-[0.1em] px-1.5 py-0.5 border"
              style={{ borderColor: "var(--rg-red-line)", color: "var(--rg-text-faint)" }}
            >
              {s}
            </span>
          ))}
        </div>
        <ModuleStats projects={projects} />
      </Panel>

      <Panel id="MOD_031" title="Packet Monitor" status={{ label: "LIVE", tone: "orange" }} delayMs={80}>
        <PacketStream />
      </Panel>

      {projects.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} delayMs={220 + i * 130} />
          ))}
        </div>
      ) : (
        <p className="text-xs text-[var(--rg-text-faint)]">No hay proyectos registrados aún.</p>
      )}
    </div>
  );
}
