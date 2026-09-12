import Panel from "@/components/Panel";
import ProjectCard from "@/components/ProjectCard";
import { PROJECTS } from "@/lib/projects";

export const metadata = { title: "PROJECTS // REDGHOST_OS" };

export default function ProyectosPage() {
  return (
    <div className="flex flex-col gap-5">
      <Panel id="MOD_010" title="Project Database" status={{ label: "ACTIVE" }}>
        <p className="text-xs text-[var(--rg-text-dim)] leading-relaxed">
          Toda la base de proyectos de RedGhost: robótica, software, hardware y
          diseño. Cada ficha es una ventana independiente del sistema.
        </p>
      </Panel>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PROJECTS.map((project, i) => (
          <ProjectCard key={project.slug} project={project} delayMs={220 + i * 130} />
        ))}
      </div>
    </div>
  );
}
