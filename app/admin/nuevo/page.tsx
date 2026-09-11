import ProjectForm from "../ProjectForm";

export default function NuevoProyectoPage() {
  return (
    <>
      <h1 className="text-sm tracking-[0.2em]" style={{ color: "var(--rg-red)" }}>
        NUEVO PROYECTO
      </h1>
      <ProjectForm />
    </>
  );
}
