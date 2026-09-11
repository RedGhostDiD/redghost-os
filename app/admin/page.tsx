import Link from "next/link";
import { auth, signOut } from "@/auth";
import { readProjects } from "@/lib/github-content";
import ProjectList from "./ProjectList";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();
  const { projects } = await readProjects();

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-sm tracking-[0.2em]" style={{ color: "var(--rg-red)" }}>
            ADMIN // PROJECT DATABASE
          </h1>
          <p className="text-[10px] tracking-[0.1em] mt-1" style={{ color: "var(--rg-text-faint)" }}>
            {session?.user?.login ?? session?.user?.name} — {projects.length} proyecto(s)
          </p>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/admin/login" });
          }}
        >
          <button
            type="submit"
            className="text-[10px] tracking-[0.1em] px-3 py-1.5 border"
            style={{ borderColor: "var(--rg-red-line)", color: "var(--rg-text-faint)" }}
          >
            SALIR
          </button>
        </form>
      </div>

      <Link
        href="/admin/nuevo"
        className="text-xs tracking-[0.15em] self-start px-4 py-2.5 border"
        style={{ borderColor: "var(--rg-red)", color: "var(--rg-red-soft)" }}
      >
        + NUEVO PROYECTO
      </Link>

      <ProjectList projects={projects} />
    </>
  );
}
