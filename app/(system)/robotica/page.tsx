import Panel from "@/components/Panel";
import ProjectCard from "@/components/ProjectCard";
import ModuleStats from "@/components/ModuleStats";
import SerialMonitor from "@/components/decor/SerialMonitor";
import CadWireframe from "@/components/decor/CadWireframe";
import { getProjectsByType } from "@/lib/projects";

export const metadata = { title: "ROBOTICS // REDGHOST_OS" };

const CATEGORIES = ["AUTONOMOUS", "COMBAT", "SOCCER", "MECHANICAL", "CONTROL", "AI"];

export default function RoboticaPage() {
  const projects = getProjectsByType("ROBOTICS");

  return (
    <div className="flex flex-col gap-5">
      <Panel id="MOD_020" title="Robotics Module" status={{ label: "ACTIVE" }} className="relative">
        <CadWireframe />
        <p className="text-xs text-[var(--rg-text-dim)] leading-relaxed mb-4">
          Proyectos de robótica: activos, terminados y experimentales.
        </p>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => (
            <span
              key={c}
              className="text-[9px] tracking-[0.1em] px-1.5 py-0.5 border"
              style={{ borderColor: "var(--rg-red-line)", color: "var(--rg-text-faint)" }}
            >
              {c}
            </span>
          ))}
        </div>
        <ModuleStats projects={projects} />
      </Panel>

      <Panel id="MOD_021" title="Serial Monitor" status={{ label: "LIVE", tone: "orange" }} delayMs={80}>
        <SerialMonitor />
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
