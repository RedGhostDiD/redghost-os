"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { sortTunelPhotos, type TunelPhoto, type TunelSettings } from "@/lib/tunel";
import { readPhotoDate } from "@/lib/photo-date";
import { developRaw, isRawFile, RAW_ACCEPT } from "@/lib/raw-develop";

/** A photo in the editor; new ones carry the git blobs made on upload. */
type Item = TunelPhoto & { pending?: { ext: string; blobSha: string; fullBlobSha: string } };
type Upload = { key: string; name: string; status: "subiendo" | "error"; error?: string };

const NOW = new Date().getFullYear();
const YEARS = Array.from({ length: NOW + 2 - 2010 }, (_, i) => NOW + 1 - i);
/** Light version: what the tunnel and the INDEX load. Small so the site stays fast. */
const LIGHT_SIDE = 1000;
const LIGHT_QUALITY = 0.72;
/** Original version: shown when a photo is opened. As big as one upload allows (Vercel body limit). */
const FULL_SIDE = 4096;
const FULL_MAX_BYTES = 3_000_000;

const rgCode = (i: number) => `RG-${String(i + 1).padStart(4, "0")}`;
const newId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
const yearValue = (v: string) => (v === "" ? null : Number(v));

/**
 * Redraws the photo on a canvas and encodes a new JPEG. The new file carries
 * none of the original metadata (GPS location, camera, date): only pixels.
 * The EXIF rotation is applied to the pixels first, so nothing ends up sideways.
 */
async function encodeJpeg(bitmap: ImageBitmap, maxSide: number, quality: number): Promise<Blob> {
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo procesar la imagen");
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", quality));
  if (!blob) throw new Error("No se pudo comprimir la imagen");
  return blob;
}

/** Highest quality that still fits in one upload: lowers quality, then size, until it fits. */
async function encodeFull(bitmap: ImageBitmap): Promise<Blob> {
  let side = Math.min(FULL_SIDE, Math.max(bitmap.width, bitmap.height));
  for (;;) {
    for (const q of [0.92, 0.88, 0.84]) {
      const blob = await encodeJpeg(bitmap, side, q);
      if (blob.size <= FULL_MAX_BYTES) return blob;
    }
    side = Math.round(side * 0.85);
  }
}

const toBase64 = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });

async function uploadBlob(blob: Blob): Promise<string> {
  const res = await fetch("/api/admin/tunel/blob", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contentBase64: await toBase64(blob) }),
  });
  const data = (await res.json().catch(() => ({}))) as { blobSha?: string; error?: string };
  if (!res.ok || !data.blobSha) throw new Error(data.error || `Error ${res.status}`);
  return data.blobSha;
}

export default function TunelAdmin({
  initial,
  initialSettings,
}: {
  initial: TunelPhoto[];
  initialSettings: TunelSettings;
}) {
  const [items, setItems] = useState<Item[]>(initial);
  const [saved, setSaved] = useState<TunelPhoto[]>(initial);
  const [settings, setSettings] = useState<TunelSettings>(initialSettings);
  const [savedSettings, setSavedSettings] = useState<TunelSettings>(initialSettings);
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [uploadYear, setUploadYear] = useState<string>(String(NOW));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  // Local previews for photos whose files are not deployed yet.
  const previews = useRef(new Map<string, string>());
  const fileInput = useRef<HTMLInputElement>(null);
  // Separate picker for RAW: mixing RAW extensions into the photo picker makes
  // phones show a plain file chooser (no Google Photos).
  const rawInput = useRef<HTMLInputElement>(null);

  const ordered = useMemo(() => sortTunelPhotos(items), [items]);
  const dirty = useMemo(
    () =>
      JSON.stringify(ordered.map(({ id, year, date }) => [id, year, date ?? null])) !==
        JSON.stringify(sortTunelPhotos(saved).map(({ id, year, date }) => [id, year, date ?? null])) ||
      JSON.stringify(settings) !== JSON.stringify(savedSettings),
    [ordered, saved, settings, savedSettings]
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
    const chosenYear = yearValue(uploadYear);
    for (const file of Array.from(files)) {
      const raw = isRawFile(file);
      if (!raw && !file.type.startsWith("image/")) continue;
      const key = newId();
      setUploads((u) => [...u, { key, name: file.name, status: "subiendo" }]);
      try {
        // Date taken, read before the metadata is stripped. Its year wins over the selected one.
        // RAW: developed here (LibRaw) and then saved as JPEG like any other photo.
        const developed = raw ? await developRaw(file) : null;
        const date = (developed?.date ?? (await readPhotoDate(file))) ?? undefined;
        const year = date ? Number(date.slice(0, 4)) : chosenYear;
        const bitmap = developed?.bitmap ?? (await createImageBitmap(file, { imageOrientation: "from-image" }));
        let light: Blob, full: Blob;
        try {
          light = await encodeJpeg(bitmap, LIGHT_SIDE, LIGHT_QUALITY);
          full = await encodeFull(bitmap);
        } finally {
          bitmap.close();
        }
        const [blobSha, fullBlobSha] = await Promise.all([uploadBlob(light), uploadBlob(full)]);
        const preview = URL.createObjectURL(light);
        previews.current.set(key, preview);
        setItems((list) => [...list, { id: key, src: preview, year, date, pending: { ext: "jpg", blobSha, fullBlobSha } }]);
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

  /** Date taken (empty = none). Changing it also moves the photo to that year. */
  function setDate(id: string, day: string, time: string) {
    setItems((list) =>
      list.map((p) => {
        if (p.id !== id) return p;
        if (!day) return { ...p, date: undefined };
        return { ...p, date: time ? `${day}T${time}` : day, year: Number(day.slice(0, 4)) };
      })
    );
  }

  function remove(id: string, code: string) {
    if (!confirm(`¿Borrar ${code}? Al publicar, la foto se elimina del túnel y de GitHub.`)) return;
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
    setSettings(savedSettings);
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
          photos: ordered.map(({ id, year, date }) => ({ id, year, date })),
          added: ordered.filter((p) => p.pending).map((p) => ({ id: p.id, ...p.pending })),
          settings,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        photos?: TunelPhoto[];
        settings?: TunelSettings;
        error?: string;
      };
      if (!res.ok || !data.photos) throw new Error(data.error || `Error ${res.status}`);
      // New files are not deployed yet: keep showing their local previews.
      const withPreviews = data.photos.map((p) => ({ ...p, src: previews.current.get(p.id) ?? p.src }));
      setSaved(data.photos);
      if (data.settings) {
        setSettings(data.settings);
        setSavedSettings(data.settings);
      }
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
          <button
            type="button"
            onClick={() => rawInput.current?.click()}
            className="text-xs tracking-[0.15em] px-4 py-2.5 border"
            style={{ ...line, color: "var(--rg-text-dim)" }}
          >
            + RAW
          </button>
          <span className="text-[10px]" style={{ color: "var(--rg-text-faint)" }}>
            o arrástralas aquí. Con + RAW (.dng, .cr2, .nef, .arw, .raf…) la foto se revela aquí y se guarda en JPEG. La fecha se lee de la foto (puedes cambiarla abajo). El túnel usa una versión ligera; al abrir la foto se ve la original. Se borran los metadatos (ubicación incluida).
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
          <input
            ref={rawInput}
            type="file"
            accept={RAW_ACCEPT}
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

      {/* Settings */}
      <section className="border p-4 flex flex-col gap-3" style={{ ...line, background: "var(--rg-panel)" }}>
        <h2 className="text-xs tracking-[0.2em]" style={{ color: "var(--rg-text-dim)" }}>
          CONFIGURACIÓN
        </h2>
        <label className="flex items-start gap-3 text-xs cursor-pointer">
          <input
            type="checkbox"
            checked={settings.viewerGrain}
            onChange={(e) => setSettings((st) => ({ ...st, viewerGrain: e.target.checked }))}
            className="mt-0.5 accent-[var(--rg-red)]"
          />
          <span>
            <span style={{ color: "var(--rg-text)" }}>Grano en la foto abierta</span>
            <span className="block text-[10px] mt-0.5" style={{ color: "var(--rg-text-faint)" }}>
              Filtro de grano tipo Instagram al hacer clic en una foto. El túnel no cambia.
            </span>
          </span>
        </label>
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
                  <div className="w-full flex flex-wrap items-center gap-1.5">
                    <input
                      type="date"
                      value={photo.date?.slice(0, 10) ?? ""}
                      min="1900-01-01"
                      max="2100-12-31"
                      onChange={(e) => setDate(photo.id, e.target.value, photo.date?.slice(11) ?? "")}
                      aria-label="Fecha de la foto"
                      title={photo.date ? "Fecha de la foto" : "Sin fecha: la foto no la traía. Escríbela aquí."}
                      className="bg-transparent border px-1 py-1 text-[11px] min-w-0 flex-1"
                      style={{ ...line, color: photo.date ? "var(--rg-text)" : "var(--rg-text-faint)", colorScheme: "dark" }}
                    />
                    <input
                      type="time"
                      value={photo.date?.slice(11) ?? ""}
                      disabled={!photo.date}
                      onChange={(e) => setDate(photo.id, photo.date!.slice(0, 10), e.target.value)}
                      aria-label="Hora de la foto"
                      className="bg-transparent border px-1 py-1 text-[11px] w-[5.5rem] disabled:opacity-40"
                      style={{ ...line, color: "var(--rg-text)", colorScheme: "dark" }}
                    />
                  </div>
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
                    onClick={() => remove(photo.id, rgCode(index))}
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
