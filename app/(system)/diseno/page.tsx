import Panel from "@/components/Panel";
import ProjectCard from "@/components/ProjectCard";
import ModuleStats from "@/components/ModuleStats";
import DidPipeline from "@/components/DidPipeline";
import FloatingFormulas from "@/components/decor/FloatingFormulas";
import { getProjectsByType } from "@/lib/projects";

export const metadata = { title: "DESIGN // REDGHOST_OS" };

const TAGS = ["GRAPHIC DESIGN", "CAD", "SVG", "INTERFACES", "MODELS", "VISUAL RESOURCES"];

export default function DisenoPage() {
  const projects = getProjectsByType("DESIGN");

  return (
    <div className="flex flex-col gap-5">
      <Panel id="MOD_050" title="Design Module" status={{ label: "ACTIVE" }} className="relative">
        <FloatingFormulas />
        <div className="relative z-10">
          <p className="text-xs text-[var(--rg-text-dim)] leading-relaxed mb-4">
            Diseño gráfico, CAD, SVG, interfaces y recursos visuales. Conectado
            con los productos que luego aparecen en{" "}
            <a href="/store" className="text-[var(--rg-red)] hover:text-[var(--rg-orange)]">
              /store
            </a>
            .
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
        </div>
      </Panel>

      <Panel id="MOD_051" title="DiD Pipeline" status={{ label: "METHOD" }} delayMs={80}>
        <p className="text-xs text-[var(--rg-text-dim)] leading-relaxed mb-4">
          El proceso detrás de la marca DiD: dibujo, inteligencia y desarrollo
          como un mismo flujo de trabajo.
        </p>
        <DidPipeline stage="build" />
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
