import { readProjects } from "@/lib/github-content";
import ProjectForm from "../ProjectForm";

export const dynamic = "force-dynamic";

export default async function NuevoProyectoPage() {
  const { projects } = await readProjects();

  return (
    <>
      <h1 className="text-sm tracking-[0.2em]" style={{ color: "var(--rg-red)" }}>
        NUEVO PROYECTO
      </h1>
      <ProjectForm existingProjects={projects} />
    </>
  );
}
