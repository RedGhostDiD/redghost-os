import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { readSiteConfig, writeSiteConfig } from "@/lib/github-content";
import type { SiteConfig } from "@/lib/site-config";

async function requireAdmin() {
  const session = await auth();
  const login = session?.user?.login;
  if (!login || login !== process.env.ADMIN_GITHUB_LOGIN) return null;
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { config } = await readSiteConfig();
  return NextResponse.json({ config });
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = (await req.json()) as { config: SiteConfig };
  const { config: newConfig } = body;

  if (!newConfig?.email) {
    return NextResponse.json({ error: "email es requerido" }, { status: 400 });
  }

  const { sha } = await readSiteConfig();
  await writeSiteConfig(newConfig, sha, "admin: update site config (redes/contacto)");
  return NextResponse.json({ ok: true, config: newConfig });
}
