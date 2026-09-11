import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { readProjects, writeProjects } from "@/lib/github-content";

async function requireAdmin() {
  const session = await auth();
  const login = session?.user?.login;
  if (!login || login !== process.env.ADMIN_GITHUB_LOGIN) {
    return null;
  }
  return session;
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { slug } = await params;
  const { projects, sha } = await readProjects();

  const next = projects.filter((p) => p.slug !== slug);
  if (next.length === projects.length) {
    return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });
  }

  await writeProjects(next, sha, `admin: delete project ${slug}`);
  return NextResponse.json({ ok: true });
}
