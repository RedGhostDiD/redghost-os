import Panel from "@/components/Panel";
import ProjectCard from "@/components/ProjectCard";
import ModuleStats from "@/components/ModuleStats";
import BitMonitor from "@/components/decor/BitMonitor";
import { getProjectsByType } from "@/lib/projects";

export const metadata = { title: "HARDWARE // REDGHOST_OS" };

const TAGS = ["PCB", "ESP32", "SENSORS", "MICROCONTROLLERS", "ELECTRONICS", "CUSTOM DEVICES"];

export default function HardwarePage() {
  const projects = getProjectsByType("HARDWARE");

  return (
    <div className="flex flex-col gap-5">
      <Panel id="MOD_040" title="Hardware Module" status={{ label: "ACTIVE" }}>
        <p className="text-xs text-[var(--rg-text-dim)] leading-relaxed mb-4">
          Todo lo físico y electrónico — más laboratorio que tienda.
        </p>
        <div className="flex flex-wrap gap-1.5">
          {TAGS.map((t) => (
            <span
              key={t}
              className="text-[9px] tracking-[0.1em] px-1.5 py-0.5 border"
              style={{ borderColor: "var(--rg-red-line)", color: "var(--rg-text-faint)" }}
            >
              {t}
            </span>
          ))}
        </div>
        <ModuleStats projects={projects} />
      </Panel>

      <Panel id="MOD_041" title="Bit Monitor" status={{ label: "LIVE", tone: "orange" }} delayMs={80}>
        <BitMonitor />
      </Panel>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
