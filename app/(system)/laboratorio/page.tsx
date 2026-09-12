import Link from "next/link";
import Panel from "@/components/Panel";
import ProjectCard from "@/components/ProjectCard";
import ModuleStats from "@/components/ModuleStats";
import { getLabProjects } from "@/lib/projects";

export const metadata = { title: "LAB // REDGHOST_OS" };

export default function LaboratorioPage() {
  const projects = getLabProjects();

  return (
    <div className="flex flex-col gap-5">
      <Panel id="MOD_060" title="Experimental Lab" status={{ label: "EXPERIMENTAL", tone: "orange" }}>
        <p className="text-xs text-[var(--rg-text-dim)] leading-relaxed">
          Todo lo que está en desarrollo, es un experimento o todavía no está
          terminado — sin importar el módulo de origen. Incluso un{" "}
          <span style={{ color: "var(--rg-red)" }}>FAILED</span> bien
          documentado dice más que un portafolio donde todo salió perfecto.
        </p>
        <ModuleStats projects={projects} />
      </Panel>

      <Panel id="EXP_001" title="Playable // Game" status={{ label: "PLAYABLE", tone: "red-dim" }} delayMs={120}>
        <h3 className="text-sm tracking-[0.15em] text-[var(--rg-text)] mb-2">
          BREACH PROTOCOL
        </h3>
        <p className="text-xs text-[var(--rg-text-dim)] leading-relaxed mb-4">
          Minijuego de intrusión estilo hacking terminal — reconstruye
          secuencias en una matriz de códigos antes de que se agote el
          tiempo.
        </p>
        <Link
          href="/laboratorio/breach-protocol"
          className="rg-action-link inline-block text-[10px] tracking-[0.15em] border px-3 py-1.5"
        >
          [ ACCESS ]
        </Link>
      </Panel>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} delayMs={220 + i * 130} />
          ))}
        </div>
      ) : (
        <p className="text-xs text-[var(--rg-text-faint)]">Sin experimentos registrados aún.</p>
      )}
    </div>
  );
}
