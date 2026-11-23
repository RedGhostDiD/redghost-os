import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createImageBlob } from "@/lib/github-content";

// Vercel rejects request bodies above ~4.5 MB; the admin resizes photos
// in the browser before uploading, so real uploads stay well below this.
const MAX_BYTES = 3.2 * 1024 * 1024;

async function requireAdmin() {
  const session = await auth();
  const login = session?.user?.login;
  if (!login || login !== process.env.ADMIN_GITHUB_LOGIN) return null;
  return session;
}

/** Checks the file signature so only real images reach the repo. */
function imageExt(buf: Buffer): string | null {
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg";
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
  if (buf.subarray(0, 4).toString("ascii") === "RIFF" && buf.subarray(8, 12).toString("ascii") === "WEBP") return "webp";
  if (buf.subarray(0, 4).toString("ascii") === "GIF8") return "gif";
  return null;
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { contentBase64 } = (await req.json()) as { contentBase64?: string };
  if (typeof contentBase64 !== "string" || !contentBase64) {
    return NextResponse.json({ error: "contentBase64 es requerido" }, { status: 400 });
  }
  const buf = Buffer.from(contentBase64, "base64");
  if (buf.length > MAX_BYTES) {
    return NextResponse.json({ error: "Imagen demasiado grande" }, { status: 400 });
  }
  const ext = imageExt(buf);
  if (!ext) return NextResponse.json({ error: "El archivo no es una imagen válida" }, { status: 400 });

  const blobSha = await createImageBlob(contentBase64);
  return NextResponse.json({ ok: true, blobSha, ext });
}
