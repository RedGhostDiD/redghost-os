import { notFound } from "next/navigation";
import { readProjects } from "@/lib/github-content";
import ProjectForm from "../ProjectForm";

export const dynamic = "force-dynamic";

export default async function EditarProyectoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { projects } = await readProjects();
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <>
      <h1 className="text-sm tracking-[0.2em]" style={{ color: "var(--rg-red)" }}>
        EDITAR // {project.name}
      </h1>
      <ProjectForm initial={project} />
    </>
  );
}
