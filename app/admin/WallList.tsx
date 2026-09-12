"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { WallPost, WallContentType, WallMood } from "@/lib/wall";

const TYPES: WallContentType[] = ["TEXT", "IMAGE", "VIDEO", "IMAGE_TEXT", "VIDEO_TEXT"];
const MOODS: WallMood[] = ["BUILD", "FAIL", "IDEA", "TEST", "RANDOM"];

export default function WallList({ posts }: { posts: WallPost[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<WallContentType | "">("");
  const [moodFilter, setMoodFilter] = useState<WallMood | "">("");

  const filtered = useMemo(() => {
    return posts
      .filter((p) => !typeFilter || p.type === typeFilter)
      .filter((p) => !moodFilter || p.mood === moodFilter)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [posts, typeFilter, moodFilter]);

  async function handleToggleHidden(post: WallPost) {
    setToggling(post.slug);
    setError(null);
    try {
      const res = await fetch("/api/admin/wall", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post: { ...post, hidden: !post.hidden }, originalSlug: post.slug }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Error al cambiar visibilidad");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cambiar visibilidad");
    } finally {
      setToggling(null);
    }
  }

  async function handleDelete(slug: string) {
    if (!confirm(`¿Eliminar la publicación "${slug}"? Esto hace un commit al repo.`)) return;
    setDeleting(slug);
    setError(null);
    try {
      const res = await fetch(`/api/admin/wall/${slug}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Error al eliminar");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar");
    } finally {
      setDeleting(null);
    }
  }

  const selectClass = "bg-transparent border px-2 py-1.5 text-[10px] tracking-[0.05em] outline-none";
  const selectStyle = { borderColor: "var(--rg-red-line)", color: "var(--rg-text-dim)" };

  return (
    <div className="flex flex-col gap-3">
      {error && (
        <p className="text-xs tracking-[0.05em] border px-3 py-2" style={{ borderColor: "var(--rg-red-line)", color: "var(--rg-red-soft)" }}>
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <select className={selectClass} style={selectStyle} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as WallContentType | "")}>
          <option value="">TODOS LOS TIPOS</option>
          {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select className={selectClass} style={selectStyle} value={moodFilter} onChange={(e) => setMoodFilter(e.target.value as WallMood | "")}>
          <option value="">TODOS LOS MOODS</option>
          {MOODS.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-xs" style={{ color: "var(--rg-text-faint)" }}>
          {posts.length === 0 ? "No hay publicaciones todavía." : "Ninguna publicación coincide con el filtro."}
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((p) => (
            <div
              key={p.slug}
              className="flex items-center justify-between gap-3 border px-3 py-2"
              style={{ borderColor: "var(--rg-red-line)", opacity: p.hidden ? 0.55 : 1 }}
            >
              <div className="min-w-0">
                <p className="text-xs tracking-[0.1em] truncate" style={{ color: "var(--rg-text)" }}>
                  {p.id}
                  {p.hidden && (
                    <span className="ml-2" style={{ color: "var(--rg-orange)" }}>
                      [ OCULTO ]
                    </span>
                  )}
                </p>
                <p className="text-[10px] tracking-[0.1em] truncate" style={{ color: "var(--rg-text-faint)" }}>
                  {p.type} · {p.mood} · {p.status} — {p.text[0]}
                </p>
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
                  href={`/admin/muro/${p.slug}`}
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
