"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { WallPost, WallContentType, WallMood, WallStatus } from "@/lib/wall";
import { nextWallSlug } from "@/lib/wall";
import type { Project } from "@/lib/projects";

const TYPES: WallContentType[] = ["TEXT", "IMAGE", "VIDEO", "IMAGE_TEXT", "VIDEO_TEXT"];
const MOODS: WallMood[] = ["BUILD", "FAIL", "IDEA", "TEST", "RANDOM"];
const STATUSES: WallStatus[] = ["ONLINE", "FAILED", "SOLVED", "WIP", "ARCHIVED"];

interface Props {
  initial?: WallPost;
  existingPosts: WallPost[];
  projects: Project[];
}

export default function WallForm({ initial, existingPosts, projects }: Props) {
  const router = useRouter();
  const isEdit = !!initial;
  const originalSlug = initial?.slug;
  const suggested = isEdit ? null : nextWallSlug(existingPosts);

  const [slug] = useState(initial?.slug ?? suggested?.slug ?? "");
  const [id] = useState(initial?.id ?? suggested?.id ?? "");
  const [type, setType] = useState<WallContentType>(initial?.type ?? "TEXT");
  const [mood, setMood] = useState<WallMood>(initial?.mood ?? "BUILD");
  const [status, setStatus] = useState<WallStatus>(initial?.status ?? "ONLINE");
  const [text, setText] = useState((initial?.text ?? []).join("\n"));
  const [videoUrl, setVideoUrl] = useState(initial?.videoUrl ?? "");
  const [projectSlug, setProjectSlug] = useState(initial?.projectSlug ?? "");
  const [hidden, setHidden] = useState(initial?.hidden ?? false);

  const [existingImage, setExistingImage] = useState(initial?.image ?? "");
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [imageExt, setImageExt] = useState("jpg");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const needsImage = type === "IMAGE" || type === "IMAGE_TEXT";
  const needsVideo = type === "VIDEO" || type === "VIDEO_TEXT";

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    setImageExt(ext);
    const reader = new FileReader();
    reader.onload = () => {
      setImageDataUrl(reader.result as string);
      setDirty(true);
    };
    reader.readAsDataURL(file);
  }

  function removeImage() {
    setExistingImage("");
    setImageDataUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setDirty(true);
  }

  function goBack() {
    if (dirty && !confirm("Tenés cambios sin guardar. ¿Salir igual?")) return;
    router.push("/admin/muro");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
      if (!lines.length) throw new Error("El texto no puede estar vacío");

      const post: WallPost = {
        slug,
        id,
        type,
        mood,
        status,
        text: lines,
        createdAt: initial?.createdAt ?? new Date().toISOString(),
        hidden,
      };

      if (projectSlug) post.projectSlug = projectSlug;
      if (needsVideo && videoUrl.trim()) post.videoUrl = videoUrl.trim();

      if (needsImage) {
        if (imageDataUrl) {
          const base64 = imageDataUrl.split(",")[1] ?? "";
          const uploadRes = await fetch("/api/admin/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ path: `muro/${slug}.${imageExt}`, contentBase64: base64 }),
          });
          const uploadData = await uploadRes.json();
          if (!uploadRes.ok) throw new Error(uploadData.error ?? "Error al subir la imagen");
          post.image = uploadData.path;
        } else if (existingImage) {
          post.image = existingImage;
        }
      }

      const res = await fetch("/api/admin/wall", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post, originalSlug }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al guardar");
      setDirty(false);
      router.push("/admin/muro");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "w-full bg-transparent border px-2.5 py-1.5 text-xs tracking-[0.05em] outline-none";
  const inputStyle = { borderColor: "var(--rg-red-line)", color: "var(--rg-text)" };
  const labelClass = "text-[10px] tracking-[0.15em] block mb-1";
  const labelStyle = { color: "var(--rg-text-faint)" };

  return (
    <form onSubmit={handleSubmit} onChangeCapture={() => setDirty(true)} className="flex flex-col gap-4">
      {error && (
        <p className="text-xs tracking-[0.05em] border px-3 py-2" style={{ borderColor: "var(--rg-red-line)", color: "var(--rg-red-soft)" }}>
          {error}
        </p>
      )}

      <p className="text-[10px] tracking-[0.15em]" style={{ color: "var(--rg-text-faint)" }}>
        {id} {isEdit ? "" : "(se asigna automáticamente)"}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className={labelClass} style={labelStyle}>TYPE</label>
          <select className={inputClass} style={inputStyle} value={type} onChange={(e) => setType(e.target.value as WallContentType)}>
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass} style={labelStyle}>MOOD</label>
          <select className={inputClass} style={inputStyle} value={mood} onChange={(e) => setMood(e.target.value as WallMood)}>
            {MOODS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass} style={labelStyle}>STATUS</label>
          <select className={inputClass} style={inputStyle} value={status} onChange={(e) => setStatus(e.target.value as WallStatus)}>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass} style={labelStyle}>TEXTO (una línea por renglón — podés usar &quot;&gt; &quot; para citas)</label>
        <textarea className={inputClass} style={{ ...inputStyle, minHeight: 120 }} value={text} onChange={(e) => setText(e.target.value)} required />
      </div>

      {needsImage && (
        <div>
          <label className={labelClass} style={labelStyle}>IMAGEN</label>
          <div className="flex items-center gap-3">
            {(imageDataUrl || existingImage) && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageDataUrl || existingImage}
                alt=""
                className="w-16 h-16 object-cover border"
                style={{ borderColor: "var(--rg-red-line)" }}
              />
            )}
            <div className="flex flex-col gap-1.5">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handleImageChange}
                className="text-[10px]"
                style={{ color: "var(--rg-text-faint)" }}
              />
              {(imageDataUrl || existingImage) && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="text-[10px] tracking-[0.1em] self-start px-2 py-1 border"
                  style={{ borderColor: "var(--rg-red-line)", color: "var(--rg-text-faint)" }}
                >
                  QUITAR IMAGEN
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {needsVideo && (
        <div>
          <label className={labelClass} style={labelStyle}>LINK DE VIDEO (YouTube, TikTok, etc.)</label>
          <input className={inputClass} style={inputStyle} value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://..." />
        </div>
      )}

      <div>
        <label className={labelClass} style={labelStyle}>PROYECTO RELACIONADO (opcional)</label>
        <select className={inputClass} style={inputStyle} value={projectSlug} onChange={(e) => setProjectSlug(e.target.value)}>
          <option value="">— ninguno —</option>
          {projects.map((p) => (
            <option key={p.slug} value={p.slug}>{p.name}</option>
          ))}
        </select>
      </div>

      <label className="flex items-center gap-2 text-[10px] tracking-[0.15em] cursor-pointer" style={labelStyle}>
        <input type="checkbox" checked={hidden} onChange={(e) => setHidden(e.target.checked)} />
        OCULTAR DEL MURO PÚBLICO
      </label>

      <div className="flex gap-3 mt-2">
        <button
          type="submit"
          disabled={saving}
          className="text-xs tracking-[0.15em] px-4 py-2.5 border disabled:opacity-50"
          style={{ borderColor: "var(--rg-red)", color: "var(--rg-red-soft)" }}
        >
          {saving ? "GUARDANDO..." : isEdit ? "GUARDAR CAMBIOS" : "PUBLICAR"}
        </button>
        <button
          type="button"
          onClick={goBack}
          className="text-xs tracking-[0.15em] px-4 py-2.5 border"
          style={{ borderColor: "var(--rg-red-line)", color: "var(--rg-text-faint)" }}
        >
          CANCELAR
        </button>
      </div>
    </form>
  );
}
