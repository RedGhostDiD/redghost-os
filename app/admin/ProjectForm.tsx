"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Project, ProjectType, ProjectStatus, PipelineStage } from "@/lib/projects";

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
const PIPELINES: PipelineStage[] = ["draw", "think", "build", "test", "iterate"];

type SpecRow = { key: string; value: string };

function toSpecRows(specs?: [string, string][]): SpecRow[] {
  if (!specs || specs.length === 0) return [{ key: "", value: "" }];
  return specs.map(([key, value]) => ({ key, value }));
}

interface Props {
  initial?: Project;
}

export default function ProjectForm({ initial }: Props) {
  const router = useRouter();
  const isEdit = !!initial;
  const originalSlug = initial?.slug;

  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [id, setId] = useState(initial?.id ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [type, setType] = useState<ProjectType>(initial?.type ?? "ROBOTICS");
  const [status, setStatus] = useState<ProjectStatus>(initial?.status ?? "WIP");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [systems, setSystems] = useState((initial?.systems ?? []).join(", "));
  const [stack, setStack] = useState((initial?.stack ?? []).join(", "));
  const [specRows, setSpecRows] = useState<SpecRow[]>(toSpecRows(initial?.specs));
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [description, setDescription] = useState((initial?.description ?? []).join("\n"));
  const [revision, setRevision] = useState(initial?.revision ?? "01");
  const [build, setBuild] = useState(String(initial?.build ?? 0));
  const [tests, setTests] = useState(String(initial?.tests ?? 0));
  const [failures, setFailures] = useState(String(initial?.failures ?? 0));
  const [pipeline, setPipeline] = useState<PipelineStage>(initial?.pipeline ?? "think");
  const [gitRepo, setGitRepo] = useState(initial?.git?.repo ?? "");
  const [gitCommits, setGitCommits] = useState(String(initial?.git?.commits ?? ""));
  const [gitBranch, setGitBranch] = useState(initial?.git?.branch ?? "main");
  const [gitLatest, setGitLatest] = useState(initial?.git?.latest ?? "");
  const [pmProblem, setPmProblem] = useState(initial?.postmortem?.problem ?? "");
  const [pmCause, setPmCause] = useState(initial?.postmortem?.cause ?? "");
  const [pmFix, setPmFix] = useState(initial?.postmortem?.fix ?? "");
  const [pmResult, setPmResult] = useState(initial?.postmortem?.result ?? "");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateSpecRow(i: number, field: "key" | "value", value: string) {
    setSpecRows((rows) => rows.map((r, idx) => (idx === i ? { ...r, [field]: value } : r)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const specs = specRows
      .filter((r) => r.key.trim() && r.value.trim())
      .map((r) => [r.key.trim(), r.value.trim()] as [string, string]);

    const project: Project = {
      slug: slug.trim(),
      id: id.trim(),
      name: name.trim(),
      type,
      status,
      summary: summary.trim(),
      description: description
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean),
      revision: revision.trim(),
      build: Number(build) || 0,
      tests: Number(tests) || 0,
      failures: Number(failures) || 0,
      lastModified: initial?.lastModified ?? new Date().toISOString(),
      pipeline,
    };

    if (category.trim()) project.category = category.trim();
    const systemsArr = systems.split(",").map((s) => s.trim()).filter(Boolean);
    if (systemsArr.length) project.systems = systemsArr;
    const stackArr = stack.split(",").map((s) => s.trim()).filter(Boolean);
    if (stackArr.length) project.stack = stackArr;
    if (specs.length) project.specs = specs;

    if (gitRepo.trim() || gitLatest.trim()) {
      project.git = {
        repo: gitRepo.trim(),
        commits: Number(gitCommits) || 0,
        branch: gitBranch.trim() || "main",
        latest: gitLatest.trim(),
      };
    }

    if (pmProblem.trim() || pmCause.trim() || pmFix.trim() || pmResult.trim()) {
      project.postmortem = {
        problem: pmProblem.trim(),
        cause: pmCause.trim(),
        fix: pmFix.trim(),
        result: pmResult.trim(),
      };
    }

    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project, originalSlug }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al guardar");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full bg-transparent border px-2.5 py-1.5 text-xs tracking-[0.05em] outline-none";
  const inputStyle = { borderColor: "var(--rg-red-line)", color: "var(--rg-text)" };
  const labelClass = "text-[10px] tracking-[0.15em] block mb-1";
  const labelStyle = { color: "var(--rg-text-faint)" };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <p
          className="text-xs tracking-[0.05em] border px-3 py-2"
          style={{ borderColor: "var(--rg-red-line)", color: "var(--rg-red-soft)" }}
        >
          {error}
        </p>
      )}

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className={labelClass} style={labelStyle}>SLUG</label>
          <input className={inputClass} style={inputStyle} value={slug} onChange={(e) => setSlug(e.target.value)} required />
        </div>
        <div>
          <label className={labelClass} style={labelStyle}>ID (ej. RG//RB-047)</label>
          <input className={inputClass} style={inputStyle} value={id} onChange={(e) => setId(e.target.value)} required />
        </div>
      </div>

      <div>
        <label className={labelClass} style={labelStyle}>NOMBRE</label>
        <input className={inputClass} style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <label className={labelClass} style={labelStyle}>TIPO</label>
          <select className={inputClass} style={inputStyle} value={type} onChange={(e) => setType(e.target.value as ProjectType)}>
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass} style={labelStyle}>ESTADO</label>
          <select className={inputClass} style={inputStyle} value={status} onChange={(e) => setStatus(e.target.value as ProjectStatus)}>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass} style={labelStyle}>PIPELINE</label>
          <select className={inputClass} style={inputStyle} value={pipeline} onChange={(e) => setPipeline(e.target.value as PipelineStage)}>
            {PIPELINES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass} style={labelStyle}>CATEGORÍA (opcional)</label>
        <input className={inputClass} style={inputStyle} value={category} onChange={(e) => setCategory(e.target.value)} />
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className={labelClass} style={labelStyle}>SYSTEMS (separado por comas)</label>
          <input className={inputClass} style={inputStyle} value={systems} onChange={(e) => setSystems(e.target.value)} placeholder="MECHANICAL, ELECTRONICS" />
        </div>
        <div>
          <label className={labelClass} style={labelStyle}>STACK (separado por comas)</label>
          <input className={inputClass} style={inputStyle} value={stack} onChange={(e) => setStack(e.target.value)} placeholder="TYPESCRIPT, NEXT.JS" />
        </div>
      </div>

      <div>
        <label className={labelClass} style={labelStyle}>SPECS</label>
        <div className="flex flex-col gap-1.5">
          {specRows.map((row, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-1.5">
              <input
                className={inputClass}
                style={inputStyle}
                placeholder="MCU"
                value={row.key}
                onChange={(e) => updateSpecRow(i, "key", e.target.value)}
              />
              <input
                className={inputClass}
                style={inputStyle}
                placeholder="ESP32-S3"
                value={row.value}
                onChange={(e) => updateSpecRow(i, "value", e.target.value)}
              />
              <button
                type="button"
                onClick={() => setSpecRows((rows) => rows.filter((_, idx) => idx !== i))}
                className="text-[10px] px-2 border"
                style={{ borderColor: "var(--rg-red-line)", color: "var(--rg-text-faint)" }}
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setSpecRows((rows) => [...rows, { key: "", value: "" }])}
            className="text-[10px] tracking-[0.1em] self-start px-2 py-1 border"
            style={{ borderColor: "var(--rg-red-line)", color: "var(--rg-text-faint)" }}
          >
            + SPEC
          </button>
        </div>
      </div>

      <div>
        <label className={labelClass} style={labelStyle}>RESUMEN</label>
        <textarea className={inputClass} style={{ ...inputStyle, minHeight: 60 }} value={summary} onChange={(e) => setSummary(e.target.value)} required />
      </div>

      <div>
        <label className={labelClass} style={labelStyle}>DESCRIPCIÓN (un párrafo por línea)</label>
        <textarea className={inputClass} style={{ ...inputStyle, minHeight: 100 }} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div className="grid sm:grid-cols-4 gap-3">
        <div>
          <label className={labelClass} style={labelStyle}>REVISIÓN</label>
          <input className={inputClass} style={inputStyle} value={revision} onChange={(e) => setRevision(e.target.value)} />
        </div>
        <div>
          <label className={labelClass} style={labelStyle}>BUILD</label>
          <input type="number" className={inputClass} style={inputStyle} value={build} onChange={(e) => setBuild(e.target.value)} />
        </div>
        <div>
          <label className={labelClass} style={labelStyle}>TESTS</label>
          <input type="number" className={inputClass} style={inputStyle} value={tests} onChange={(e) => setTests(e.target.value)} />
        </div>
        <div>
          <label className={labelClass} style={labelStyle}>FAILURES</label>
          <input type="number" className={inputClass} style={inputStyle} value={failures} onChange={(e) => setFailures(e.target.value)} />
        </div>
      </div>

      <fieldset className="border p-3" style={{ borderColor: "var(--rg-red-line)" }}>
        <legend className="text-[10px] tracking-[0.15em] px-1" style={labelStyle}>GIT (opcional)</legend>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className={labelClass} style={labelStyle}>REPO</label>
            <input className={inputClass} style={inputStyle} value={gitRepo} onChange={(e) => setGitRepo(e.target.value)} placeholder="github.com/RedGhostDiD/proyecto" />
          </div>
          <div>
            <label className={labelClass} style={labelStyle}>COMMITS</label>
            <input type="number" className={inputClass} style={inputStyle} value={gitCommits} onChange={(e) => setGitCommits(e.target.value)} />
          </div>
          <div>
            <label className={labelClass} style={labelStyle}>BRANCH</label>
            <input className={inputClass} style={inputStyle} value={gitBranch} onChange={(e) => setGitBranch(e.target.value)} />
          </div>
          <div>
            <label className={labelClass} style={labelStyle}>ÚLTIMO COMMIT</label>
            <input className={inputClass} style={inputStyle} value={gitLatest} onChange={(e) => setGitLatest(e.target.value)} />
          </div>
        </div>
      </fieldset>

      <fieldset className="border p-3" style={{ borderColor: "var(--rg-red-line)" }}>
        <legend className="text-[10px] tracking-[0.15em] px-1" style={labelStyle}>POSTMORTEM (opcional)</legend>
        <div className="flex flex-col gap-2">
          <input className={inputClass} style={inputStyle} placeholder="Problema" value={pmProblem} onChange={(e) => setPmProblem(e.target.value)} />
          <input className={inputClass} style={inputStyle} placeholder="Causa" value={pmCause} onChange={(e) => setPmCause(e.target.value)} />
          <input className={inputClass} style={inputStyle} placeholder="Solución" value={pmFix} onChange={(e) => setPmFix(e.target.value)} />
          <input className={inputClass} style={inputStyle} placeholder="Resultado" value={pmResult} onChange={(e) => setPmResult(e.target.value)} />
        </div>
      </fieldset>

      <div className="flex gap-3 mt-2">
        <button
          type="submit"
          disabled={saving}
          className="text-xs tracking-[0.15em] px-4 py-2.5 border disabled:opacity-50"
          style={{ borderColor: "var(--rg-red)", color: "var(--rg-red-soft)" }}
        >
          {saving ? "GUARDANDO..." : isEdit ? "GUARDAR CAMBIOS" : "CREAR PROYECTO"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="text-xs tracking-[0.15em] px-4 py-2.5 border"
          style={{ borderColor: "var(--rg-red-line)", color: "var(--rg-text-faint)" }}
        >
          CANCELAR
        </button>
      </div>
    </form>
  );
}
