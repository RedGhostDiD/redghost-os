"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { sortTunelPhotos, type TunelPhoto } from "@/lib/tunel";

/** A photo in the editor; new ones carry the git blob made on upload. */
type Item = TunelPhoto & { pending?: { ext: string; blobSha: string } };
type Upload = { key: string; name: string; status: "subiendo" | "error"; error?: string };

const NOW = new Date().getFullYear();
const YEARS = Array.from({ length: NOW + 2 - 2010 }, (_, i) => NOW + 1 - i);
/** Long edge of uploaded photos. Keeps each upload small (Vercel body limit) and the tunnel fast. */
const MAX_SIDE = 2400;
const JPEG_QUALITY = 0.86;

const rgCode = (i: number) => `RG-${String(i + 1).padStart(4, "0")}`;
const newId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
const yearValue = (v: string) => (v === "" ? null : Number(v));

/** Resizes in the browser and re-encodes as JPEG; returns base64 without the data: prefix. */
async function prepareImage(file: File): Promise<{ base64: string; ext: string; preview: string }> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo procesar la imagen");
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", JPEG_QUALITY));
  if (!blob) throw new Error("No se pudo comprimir la imagen");
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
  return { base64: dataUrl.split(",")[1], ext: "jpg", preview: URL.createObjectURL(blob) };
}

export default function TunelAdmin({ initial }: { initial: TunelPhoto[] }) {
  const [items, setItems] = useState<Item[]>(initial);
  const [saved, setSaved] = useState<TunelPhoto[]>(initial);
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [uploadYear, setUploadYear] = useState<string>(String(NOW));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  // Local previews for photos whose files are not deployed yet.
  const previews = useRef(new Map<string, string>());
  const fileInput = useRef<HTMLInputElement>(null);

  const ordered = useMemo(() => sortTunelPhotos(items), [items]);
  const dirty = useMemo(
    () =>
      JSON.stringify(ordered.map(({ id, year }) => [id, year])) !==
      JSON.stringify(sortTunelPhotos(saved).map(({ id, year }) => [id, year])),
    [ordered, saved]
  );
  const busy = uploads.some((u) => u.status === "subiendo");

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!dirty && !busy) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty, busy]);

  async function addFiles(files: FileList | File[]) {
    setMessage(null);
    const year = yearValue(uploadYear);
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      const key = newId();
      setUploads((u) => [...u, { key, name: file.name, status: "subiendo" }]);
      try {
        const img = await prepareImage(file);
        const res = await fetch("/api/admin/tunel/blob", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contentBase64: img.base64 }),
        });
        const data = (await res.json().catch(() => ({}))) as { blobSha?: string; ext?: string; error?: string };
        if (!res.ok || !data.blobSha) throw new Error(data.error || `Error ${res.status}`);
        previews.current.set(key, img.preview);
        setItems((list) => [
          ...list,
          { id: key, src: img.preview, year, pending: { ext: data.ext || img.ext, blobSha: data.blobSha! } },
        ]);
        setUploads((u) => u.filter((x) => x.key !== key));
      } catch (err) {
        const text = err instanceof Error ? err.message : "Error al subir";
        setUploads((u) => u.map((x) => (x.key === key ? { ...x, status: "error", error: text } : x)));
      }
    }
  }

  function setYear(id: string, year: number | null) {
    setItems((list) => list.map((p) => (p.id === id ? { ...p, year } : p)));
  }

  function remove(id: string) {
    setItems((list) => list.filter((p) => p.id !== id));
  }

  /** Moves a photo one place earlier/later inside its year. */
  function move(id: string, dir: -1 | 1) {
    setItems((list) => {
      const sorted = sortTunelPhotos(list);
      const i = sorted.findIndex((p) => p.id === id);
      const j = i + dir;
      if (j < 0 || j >= sorted.length || sorted[j].year !== sorted[i].year) return list;
      [sorted[i], sorted[j]] = [sorted[j], sorted[i]];
      return sorted;
    });
  }

  function discard() {
    if (!confirm("¿Descartar los cambios sin publicar?")) return;
    setItems(saved);
    setMessage(null);
  }

  async function publish() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/tunel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          photos: ordered.map(({ id, year }) => ({ id, year })),
          added: ordered.filter((p) => p.pending).map((p) => ({ id: p.id, ...p.pending })),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { photos?: TunelPhoto[]; error?: string };
      if (!res.ok || !data.photos) throw new Error(data.error || `Error ${res.status}`);
      // New files are not deployed yet: keep showing their local previews.
      const withPreviews = data.photos.map((p) => ({ ...p, src: previews.current.get(p.id) ?? p.src }));
      setSaved(data.photos);
      setItems(withPreviews);
      setMessage({
        kind: "ok",
        text: "Publicado en GitHub. Vercel actualiza el túnel en 1–2 minutos.",
      });
    } catch (err) {
      setMessage({ kind: "error", text: err instanceof Error ? err.message : "No se pudo publicar" });
    } finally {
      setSaving(false);
    }
  }

  const groups = useMemo(() => {
    const map = new Map<number | null, { photo: Item; index: number }[]>();
    ordered.forEach((photo, index) => {
      if (!map.has(photo.year)) map.set(photo.year, []);
      map.get(photo.year)!.push({ photo, index });
    });
    return [...map.entries()];
  }, [ordered]);

  const btn = "text-[10px] tracking-[0.12em] px-2 py-1 border disabled:opacity-30";
  const line = { borderColor: "var(--rg-red-line)" };

  return (
    <div className="flex flex-col gap-6">
      {/* Upload */}
      <section
        className="border p-4 flex flex-col gap-3"
        style={{
          borderColor: dragOver ? "var(--rg-red)" : "var(--rg-red-line)",
          background: "var(--rg-panel)",
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          addFiles(e.dataTransfer.files);
        }}
      >
        <h2 className="text-xs tracking-[0.2em]" style={{ color: "var(--rg-text-dim)" }}>
          AÑADIR FOTOS
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-[11px] tracking-[0.1em] flex items-center gap-2" style={{ color: "var(--rg-text-dim)" }}>
            AÑO
            <select
              value={uploadYear}
              onChange={(e) => setUploadYear(e.target.value)}
              className="bg-transparent border px-2 py-1.5 text-xs"
              style={{ ...line, color: "var(--rg-text)" }}
            >
              {YEARS.map((y) => (
                <option key={y} value={y} style={{ background: "#000" }}>
                  {y}
                </option>
              ))}
              <option value="" style={{ background: "#000" }}>
                Sin año
              </option>
            </select>
          </label>
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="text-xs tracking-[0.15em] px-4 py-2.5 border"
            style={{ borderColor: "var(--rg-red)", color: "var(--rg-red-soft)" }}
          >
            + ELEGIR FOTOS
          </button>
          <span className="text-[10px]" style={{ color: "var(--rg-text-faint)" }}>
            o arrástralas aquí. Se reducen a {MAX_SIDE}px y el túnel las muestra en B/N.
          </span>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => {
              if (e.target.files) addFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>
        {uploads.length > 0 && (
          <ul className="flex flex-col gap-1 text-[11px]">
            {uploads.map((u) => (
              <li key={u.key} style={{ color: u.status === "error" ? "var(--rg-red-soft)" : "var(--rg-text-dim)" }}>
                {u.status === "subiendo" ? "▸ subiendo" : "✕ error"} — {u.name}
                {u.error ? `: ${u.error}` : ""}
                {u.status === "error" && (
                  <button
                    type="button"
                    className="ml-2 underline"
                    onClick={() => setUploads((list) => list.filter((x) => x.key !== u.key))}
                  >
                    quitar
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Publish bar */}
      <div
        className="sticky top-0 z-10 flex flex-wrap items-center gap-3 border px-4 py-3"
        style={{ ...line, background: "var(--rg-void)" }}
      >
        <span className="text-[11px] tracking-[0.1em]" style={{ color: "var(--rg-text-dim)" }}>
          {ordered.length} FOTO(S){dirty ? " · cambios sin publicar" : " · todo publicado"}
        </span>
        <div className="flex-1" />
        {dirty && (
          <button type="button" onClick={discard} disabled={saving} className={btn} style={{ ...line, color: "var(--rg-text-faint)" }}>
            DESCARTAR
          </button>
        )}
        <button
          type="button"
          onClick={publish}
          disabled={!dirty || saving || busy}
          className="text-xs tracking-[0.15em] px-4 py-2.5 border disabled:opacity-30"
          style={{ borderColor: "var(--rg-red)", color: "var(--rg-red-soft)" }}
        >
          {saving ? "PUBLICANDO…" : busy ? "ESPERA A QUE SUBAN…" : "PUBLICAR CAMBIOS"}
        </button>
      </div>
      {message && (
        <p
          className="text-xs border px-3 py-2"
          style={{
            borderColor: message.kind === "ok" ? "var(--rg-red-line)" : "var(--rg-red)",
            color: message.kind === "ok" ? "var(--rg-text)" : "var(--rg-red-soft)",
          }}
        >
          {message.text}
        </p>
      )}

      {/* Photos by year */}
      {ordered.length === 0 && (
        <p className="text-xs" style={{ color: "var(--rg-text-faint)" }}>
          Todavía no hay fotos: el túnel muestra fotos de ejemplo hasta que publiques la primera.
        </p>
      )}
      {groups.map(([year, list]) => (
        <section key={String(year)} className="flex flex-col gap-3">
          <h2 className="text-sm tracking-[0.25em] border-b pb-2" style={{ ...line, color: "var(--rg-text)" }}>
            {year ?? "SIN AÑO"}{" "}
            <span className="text-[10px]" style={{ color: "var(--rg-text-faint)" }}>
              · {list.length}
            </span>
          </h2>
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
            {list.map(({ photo, index }, k) => (
              <figure key={photo.id} className="border flex flex-col" style={{ ...line, background: "var(--rg-panel)" }}>
                <div className="relative aspect-square overflow-hidden bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.src}
                    alt=""
                    className="w-full h-full object-cover"
                    style={{ filter: "grayscale(1) contrast(1.15)" }}
                  />
                  <span
                    className="absolute left-1.5 bottom-1 text-[10px] tracking-[0.12em]"
                    style={{ color: photo.pending ? "var(--rg-red-soft)" : "#ebe3d3", textShadow: "0 0 4px #000" }}
                  >
                    {rgCode(index)}
                    {photo.pending ? " · NUEVA" : ""}
                  </span>
                </div>
                <figcaption className="flex flex-wrap items-center gap-1.5 p-2">
                  <select
                    value={photo.year ?? ""}
                    onChange={(e) => setYear(photo.id, yearValue(e.target.value))}
                    aria-label="Año"
                    className="bg-transparent border px-1 py-1 text-[11px]"
                    style={{ ...line, color: "var(--rg-text)" }}
                  >
                    {YEARS.map((y) => (
                      <option key={y} value={y} style={{ background: "#000" }}>
                        {y}
                      </option>
                    ))}
                    <option value="" style={{ background: "#000" }}>
                      Sin año
                    </option>
                  </select>
                  <button type="button" aria-label="Mover antes" disabled={k === 0} onClick={() => move(photo.id, -1)} className={btn} style={line}>
                    ←
                  </button>
                  <button
                    type="button"
                    aria-label="Mover después"
                    disabled={k === list.length - 1}
                    onClick={() => move(photo.id, 1)}
                    className={btn}
                    style={line}
                  >
                    →
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(photo.id)}
                    className={`${btn} ml-auto`}
                    style={{ ...line, color: "var(--rg-red-soft)" }}
                  >
                    BORRAR
                  </button>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
