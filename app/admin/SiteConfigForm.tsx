"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { SiteConfig, SocialLink } from "@/lib/site-config";

interface SocialRow extends SocialLink {
  _newAvatarDataUrl?: string;
  _newAvatarExt?: string;
}

export default function SiteConfigForm({ initial }: { initial: SiteConfig }) {
  const router = useRouter();
  const [email, setEmail] = useState(initial.email);
  const [socials, setSocials] = useState<SocialRow[]>(initial.socials.map((s) => ({ ...s })));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
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

  function updateRow(i: number, patch: Partial<SocialRow>) {
    setSocials((rows) => rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
    setDirty(true);
  }

  function addRow() {
    setSocials((rows) => [...rows, { label: "", href: "" }]);
    setDirty(true);
  }

  function removeRow(i: number) {
    setSocials((rows) => rows.filter((_, idx) => idx !== i));
    setDirty(true);
  }

  function handleAvatarChange(i: number, file: File | undefined) {
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const reader = new FileReader();
    reader.onload = () => {
      updateRow(i, { _newAvatarDataUrl: reader.result as string, _newAvatarExt: ext });
    };
    reader.readAsDataURL(file);
  }

  function goBack() {
    if (dirty && !confirm("Tenés cambios sin guardar. ¿Salir igual?")) return;
    router.push("/admin");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const resolvedSocials: SocialLink[] = [];
      for (const row of socials) {
        if (!row.label.trim() || !row.href.trim()) continue;
        let avatar = row.avatar;
        if (row._newAvatarDataUrl) {
          const base64 = row._newAvatarDataUrl.split(",")[1] ?? "";
          const slug = row.label.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
          const uploadRes = await fetch("/api/admin/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              path: `redes/${slug}.${row._newAvatarExt ?? "jpg"}`,
              contentBase64: base64,
            }),
          });
          const uploadData = await uploadRes.json();
          if (!uploadRes.ok) throw new Error(uploadData.error ?? "Error al subir avatar");
          avatar = uploadData.path;
        }
        resolvedSocials.push({
          label: row.label.trim(),
          href: row.href.trim(),
          handle: row.handle?.trim() || undefined,
          avatar: avatar || undefined,
        });
      }

      const config: SiteConfig = { ...initial, email: email.trim(), socials: resolvedSocials };

      const res = await fetch("/api/admin/site-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al guardar");
      setDirty(false);
      setSuccess(true);
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
      {success && !dirty && (
        <p className="text-xs tracking-[0.05em] border px-3 py-2" style={{ borderColor: "var(--rg-green)", color: "var(--rg-green)" }}>
          Guardado — se hizo commit a data/site-config.json.
        </p>
      )}

      <div>
        <label className={labelClass} style={labelStyle}>EMAIL DE CONTACTO</label>
        <input type="email" className={inputClass} style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>

      <div className="flex flex-col gap-3">
        <label className={labelClass} style={labelStyle}>REDES SOCIALES</label>
        {socials.map((row, i) => (
          <fieldset key={i} className="border p-3 flex flex-col gap-2" style={{ borderColor: "var(--rg-red-line)" }}>
            <div className="grid sm:grid-cols-2 gap-2">
              <div>
                <label className={labelClass} style={labelStyle}>LABEL</label>
                <input className={inputClass} style={inputStyle} value={row.label} onChange={(e) => updateRow(i, { label: e.target.value })} placeholder="YOUTUBE" />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>HANDLE (opcional)</label>
                <input className={inputClass} style={inputStyle} value={row.handle ?? ""} onChange={(e) => updateRow(i, { handle: e.target.value })} placeholder="@redghost.did" />
              </div>
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>LINK</label>
              <input className={inputClass} style={inputStyle} value={row.href} onChange={(e) => updateRow(i, { href: e.target.value })} placeholder="https://..." />
            </div>
            <div className="flex items-center gap-3">
              {(row._newAvatarDataUrl || row.avatar) && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={row._newAvatarDataUrl || row.avatar}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover border"
                  style={{ borderColor: "var(--rg-red-line)" }}
                />
              )}
              <div className="flex flex-col gap-1">
                <label className={labelClass} style={labelStyle}>AVATAR (opcional)</label>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={(e) => handleAvatarChange(i, e.target.files?.[0])}
                  className="text-[10px]"
                  style={{ color: "var(--rg-text-faint)" }}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeRow(i)}
              className="text-[10px] tracking-[0.1em] self-start px-2 py-1 border"
              style={{ borderColor: "var(--rg-red-line)", color: "var(--rg-red-soft)" }}
            >
              QUITAR RED
            </button>
          </fieldset>
        ))}
        <button
          type="button"
          onClick={addRow}
          className="text-[10px] tracking-[0.1em] self-start px-2.5 py-1.5 border"
          style={{ borderColor: "var(--rg-red-line)", color: "var(--rg-text-faint)" }}
        >
          + AGREGAR RED
        </button>
      </div>

      <div className="flex gap-3 mt-2">
        <button
          type="submit"
          disabled={saving}
          className="text-xs tracking-[0.15em] px-4 py-2.5 border disabled:opacity-50"
          style={{ borderColor: "var(--rg-red)", color: "var(--rg-red-soft)" }}
        >
          {saving ? "GUARDANDO..." : "GUARDAR"}
        </button>
        <button
          type="button"
          onClick={goBack}
          className="text-xs tracking-[0.15em] px-4 py-2.5 border"
          style={{ borderColor: "var(--rg-red-line)", color: "var(--rg-text-faint)" }}
        >
          VOLVER
        </button>
      </div>
    </form>
  );
}
