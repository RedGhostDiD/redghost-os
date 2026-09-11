import Link from "next/link";
import { auth, signOut } from "@/auth";
import { readProjects } from "@/lib/github-content";
import ProjectList from "./ProjectList";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();
  const { projects } = await readProjects();
  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;
  const branch = process.env.GITHUB_BRANCH || "main";
  const historyUrl = owner && repo ? `https://github.com/${owner}/${repo}/commits/${branch}/data/projects.json` : null;

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

      <div className="flex flex-wrap gap-2">
        <Link
          href="/admin/nuevo"
          className="text-xs tracking-[0.15em] px-4 py-2.5 border"
          style={{ borderColor: "var(--rg-red)", color: "var(--rg-red-soft)" }}
        >
          + NUEVO PROYECTO
        </Link>
        <Link
          href="/admin/redes"
          className="text-xs tracking-[0.15em] px-4 py-2.5 border"
          style={{ borderColor: "var(--rg-red-line)", color: "var(--rg-text-dim)" }}
        >
          EDITAR REDES / CONTACTO
        </Link>
        {historyUrl && (
          <a
            href={historyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs tracking-[0.15em] px-4 py-2.5 border"
            style={{ borderColor: "var(--rg-red-line)", color: "var(--rg-text-faint)" }}
          >
            VER HISTORIAL EN GITHUB
          </a>
        )}
      </div>

      <ProjectList projects={projects} />
    </>
  );
}
