import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { uploadPublicFile } from "@/lib/github-content";

const MAX_BYTES = 5 * 1024 * 1024;

async function requireAdmin() {
  const session = await auth();
  const login = session?.user?.login;
  if (!login || login !== process.env.ADMIN_GITHUB_LOGIN) return null;
  return session;
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = (await req.json()) as { path?: string; contentBase64?: string };
  const { path, contentBase64 } = body;

  if (!path || !contentBase64) {
    return NextResponse.json({ error: "path y contentBase64 son requeridos" }, { status: 400 });
  }
  if (!/^[a-zA-Z0-9/_-]+\.(png|jpe?g|webp|gif|svg)$/i.test(path)) {
    return NextResponse.json({ error: "Ruta o extensión de imagen inválida" }, { status: 400 });
  }
  const approxBytes = (contentBase64.length * 3) / 4;
  if (approxBytes > MAX_BYTES) {
    return NextResponse.json({ error: "Imagen demasiado grande (máx 5MB)" }, { status: 400 });
  }

  const publicPath = await uploadPublicFile(path, contentBase64, `admin: upload ${path}`);
  return NextResponse.json({ ok: true, path: publicPath });
}
