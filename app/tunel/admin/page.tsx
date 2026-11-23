import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { readTunelPhotos } from "@/lib/github-content";
import TunelAdmin from "./TunelAdmin";

export const metadata: Metadata = { title: "ADMIN // TÚNEL" };
export const dynamic = "force-dynamic";

export default async function TunelAdminPage() {
  const session = await auth();
  if (session?.user?.login !== process.env.ADMIN_GITHUB_LOGIN) redirect("/admin/login?from=tunel");

  const photos = await readTunelPhotos();
  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;
  const branch = process.env.GITHUB_BRANCH || "main";
  const historyUrl =
    owner && repo ? `https://github.com/${owner}/${repo}/commits/${branch}/data/tunel.json` : null;

  return (
    <div className="min-h-dvh" style={{ background: "var(--rg-void)", color: "var(--rg-text)" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-sm tracking-[0.2em]" style={{ color: "var(--rg-red)" }}>
              ADMIN // TÚNEL — COLLECTION_01
            </h1>
            <p className="text-[10px] tracking-[0.1em] mt-1" style={{ color: "var(--rg-text-faint)" }}>
              {session?.user?.login} — las fotos se guardan en GitHub y la web se actualiza sola
            </p>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login?from=tunel" });
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
            href="/tunel"
            target="_blank"
            className="text-xs tracking-[0.15em] px-4 py-2.5 border"
            style={{ borderColor: "var(--rg-red-line)", color: "var(--rg-text-dim)" }}
          >
            VER EL TÚNEL ↗
          </Link>
          <Link
            href="/admin"
            className="text-xs tracking-[0.15em] px-4 py-2.5 border"
            style={{ borderColor: "var(--rg-red-line)", color: "var(--rg-text-dim)" }}
          >
            ADMIN GENERAL
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

        <TunelAdmin initial={photos} />
      </div>
    </div>
  );
}
