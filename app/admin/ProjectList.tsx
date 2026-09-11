"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Project } from "@/lib/projects";

export default function ProjectList({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(slug: string) {
    if (!confirm(`¿Eliminar el proyecto "${slug}"? Esto hace un commit al repo.`)) return;
    setDeleting(slug);
    try {
      const res = await fetch(`/api/admin/projects/${slug}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Error al eliminar");
      }
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al eliminar");
    } finally {
      setDeleting(null);
    }
  }

  if (projects.length === 0) {
    return (
      <p className="text-xs" style={{ color: "var(--rg-text-faint)" }}>
        No hay proyectos todavía.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {projects.map((p) => (
        <div
          key={p.slug}
          className="flex items-center justify-between gap-3 border px-3 py-2"
          style={{ borderColor: "var(--rg-red-line)" }}
        >
          <div className="min-w-0">
            <p className="text-xs tracking-[0.1em] truncate" style={{ color: "var(--rg-text)" }}>
              {p.name} <span style={{ color: "var(--rg-text-faint)" }}>— {p.id}</span>
            </p>
            <p className="text-[10px] tracking-[0.1em]" style={{ color: "var(--rg-text-faint)" }}>
              {p.type} · {p.status} · /{p.slug}
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link
              href={`/admin/${p.slug}`}
              className="text-[10px] tracking-[0.1em] px-2.5 py-1.5 border"
              style={{ borderColor: "var(--rg-red-line)", color: "var(--rg-text-dim)" }}
            >
              EDITAR
            </Link>
            <button
              onClick={() => handleDelete(p.slug)}
              disabled={deleting === p.slug}
              className="text-[10px] tracking-[0.1em] px-2.5 py-1.5 border disabled:opacity-50"
              style={{ borderColor: "var(--rg-red-line)", color: "var(--rg-red-soft)" }}
            >
              {deleting === p.slug ? "..." : "BORRAR"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
