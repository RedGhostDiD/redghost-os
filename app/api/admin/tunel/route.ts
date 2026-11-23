import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { commitTunel, readTunelPhotos, readTunelSettings } from "@/lib/github-content";
import { isTunelPhoto, normalizeTunelSettings, sortTunelPhotos, TUNEL_UPLOAD_DIR, type TunelPhoto } from "@/lib/tunel";

async function requireAdmin() {
  const session = await auth();
  const login = session?.user?.login;
  if (!login || login !== process.env.ADMIN_GITHUB_LOGIN) return null;
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const [photos, settings] = await Promise.all([readTunelPhotos(), readTunelSettings()]);
  return NextResponse.json({ photos, settings });
}

type Added = { id: string; ext: string; blobSha: string; fullBlobSha: string };

/**
 * Saves the whole list in one commit. Body:
 *   photos: the final list (id + year; src is decided here, never trusted)
 *   added:  new photos, with the git blob created by /api/admin/tunel/blob
 * Photos missing from the list are removed, and their image files deleted.
 */
export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = (await req.json()) as { photos?: unknown; added?: unknown; settings?: unknown };
  if (!Array.isArray(body.photos) || !Array.isArray(body.added)) {
    return NextResponse.json({ error: "photos y added son requeridos" }, { status: 400 });
  }

  const added = new Map<string, Added>();
  for (const a of body.added as Added[]) {
    if (
      !a ||
      typeof a.id !== "string" ||
      !/^[a-z0-9-]{4,40}$/.test(a.id) ||
      !/^(jpg|png|webp|gif)$/.test(a.ext) ||
      typeof a.blobSha !== "string" ||
      !/^[0-9a-f]{40}$/.test(a.blobSha) ||
      typeof a.fullBlobSha !== "string" ||
      !/^[0-9a-f]{40}$/.test(a.fullBlobSha)
    ) {
      return NextResponse.json({ error: "Foto nueva inválida" }, { status: 400 });
    }
    added.set(a.id, a);
  }

  const old = await readTunelPhotos();
  const oldById = new Map(old.map((p) => [p.id, p]));
  const seen = new Set<string>();
  const next: TunelPhoto[] = [];
  const files: { path: string; blobSha: string }[] = [];

  for (const raw of body.photos) {
    const candidate = { ...(raw as object), src: "" } as TunelPhoto;
    if (!isTunelPhoto(candidate) || seen.has(candidate.id)) {
      return NextResponse.json({ error: "Lista de fotos inválida" }, { status: 400 });
    }
    seen.add(candidate.id);
    const existing = oldById.get(candidate.id);
    if (existing) {
      next.push({ ...existing, year: candidate.year });
      continue;
    }
    const a = added.get(candidate.id);
    if (!a) return NextResponse.json({ error: `Falta la imagen de ${candidate.id}` }, { status: 400 });
    // Light version for the tunnel + original quality for the viewer.
    const dir = `${candidate.year ?? "sin-ano"}`;
    const rel = `${dir}/${a.id}.${a.ext}`;
    const relFull = `${dir}/${a.id}-full.${a.ext}`;
    files.push({ path: `${TUNEL_UPLOAD_DIR}/${rel}`, blobSha: a.blobSha });
    files.push({ path: `${TUNEL_UPLOAD_DIR}/${relFull}`, blobSha: a.fullBlobSha });
    next.push({ id: a.id, src: `/uploads/tunel/${rel}`, full: `/uploads/tunel/${relFull}`, year: candidate.year });
  }

  const removed = old
    .filter((p) => !seen.has(p.id))
    .flatMap((p) => [p.src, p.full])
    .filter((src): src is string => !!src && src.startsWith("/uploads/tunel/"))
    .map((src) => `public${src}`);

  const parts = [
    files.length && `+${files.length / 2}`,
    removed.length && `-${removed.length}`,
  ].filter(Boolean);
  const message = `admin: update tunel photos${parts.length ? ` (${parts.join(" ")})` : ""}`;

  // Settings: what the admin sent, or the current ones if it sent none.
  const settings = body.settings === undefined ? await readTunelSettings() : normalizeTunelSettings(body.settings);

  const sorted = sortTunelPhotos(next);
  const sha = await commitTunel(sorted, settings, files, removed, message);
  return NextResponse.json({ ok: true, commit: sha, photos: sorted, settings });
}
