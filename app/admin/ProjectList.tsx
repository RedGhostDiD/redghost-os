"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { Project, ProjectType, ProjectStatus } from "@/lib/projects";

const TYPES: ProjectType[] = ["ROBOTICS", "SOFTWARE", "HARDWARE", "DESIGN"];
const STATUSES: ProjectStatus[] = [
  "ACTIVE",
  "WIP",
  "EXPERIMENTAL",
  "PROTOTYPE",
  "TESTING",
  "FAILED",
  "ARCHIVED",
];

export default function ProjectList({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<ProjectType | "">("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "">("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects
      .filter((p) => !typeFilter || p.type === typeFilter)
      .filter((p) => !statusFilter || p.status === statusFilter)
      .filter(
        (p) =>
          !q ||
          p.name.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q)
      )
      .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
  }, [projects, query, typeFilter, statusFilter]);

  async function handleToggleHidden(project: Project) {
    setToggling(project.slug);
    setDeleteError(null);
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project: { ...project, hidden: !project.hidden }, originalSlug: project.slug }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Error al cambiar visibilidad");
      }
      router.refresh();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Error al cambiar visibilidad");
    } finally {
      setToggling(null);
    }
  }

  async function handleDelete(slug: string) {
    if (!confirm(`¿Eliminar el proyecto "${slug}"? Esto hace un commit al repo.`)) return;
    setDeleting(slug);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/admin/projects/${slug}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Error al eliminar");
      }
      router.refresh();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Error al eliminar");
    } finally {
      setDeleting(null);
    }
  }

  const selectClass = "bg-transparent border px-2 py-1.5 text-[10px] tracking-[0.05em] outline-none";
  const selectStyle = { borderColor: "var(--rg-red-line)", color: "var(--rg-text-dim)" };

  return (
    <div className="flex flex-col gap-3">
      {deleteError && (
        <p
          className="text-xs tracking-[0.05em] border px-3 py-2"
          style={{ borderColor: "var(--rg-red-line)", color: "var(--rg-red-soft)" }}
        >
          {deleteError}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre, slug o ID..."
          className="flex-1 min-w-[160px] bg-transparent border px-2.5 py-1.5 text-xs tracking-[0.05em] outline-none"
          style={{ borderColor: "var(--rg-red-line)", color: "var(--rg-text)" }}
        />
        <select
          className={selectClass}
          style={selectStyle}
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as ProjectType | "")}
        >
          <option value="">TODOS LOS TIPOS</option>
          {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select
          className={selectClass}
          style={selectStyle}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | "")}
        >
          <option value="">TODOS LOS ESTADOS</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-xs" style={{ color: "var(--rg-text-faint)" }}>
          {projects.length === 0 ? "No hay proyectos todavía." : "Ningún proyecto coincide con el filtro."}
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((p) => (
            <div
              key={p.slug}
              className="flex items-center justify-between gap-3 border px-3 py-2"
              style={{ borderColor: "var(--rg-red-line)", opacity: p.hidden ? 0.55 : 1 }}
            >
              <div className="flex items-center gap-3 min-w-0">
                {p.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.image}
                    alt=""
                    className="w-9 h-9 object-cover border shrink-0"
                    style={{ borderColor: "var(--rg-red-line)" }}
                  />
                )}
                <div className="min-w-0">
                  <p className="text-xs tracking-[0.1em] truncate" style={{ color: "var(--rg-text)" }}>
                    {p.name} <span style={{ color: "var(--rg-text-faint)" }}>— {p.id}</span>
                    {p.hidden && (
                      <span className="ml-2" style={{ color: "var(--rg-orange)" }}>
                        [ OCULTO ]
                      </span>
                    )}
                  </p>
                  <p className="text-[10px] tracking-[0.1em]" style={{ color: "var(--rg-text-faint)" }}>
                    {p.type} · {p.status} · /{p.slug}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleToggleHidden(p)}
                  disabled={toggling === p.slug}
                  className="text-[10px] tracking-[0.1em] px-2.5 py-1.5 border disabled:opacity-50"
                  style={{ borderColor: "var(--rg-red-line)", color: "var(--rg-text-dim)" }}
                >
                  {toggling === p.slug ? "..." : p.hidden ? "MOSTRAR" : "OCULTAR"}
                </button>
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
      )}
    </div>
  );
}
