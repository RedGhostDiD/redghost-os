import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { readProjects, writeProjects } from "@/lib/github-content";
import type { Project } from "@/lib/projects";

async function requireAdmin() {
  const session = await auth();
  const login = session?.user?.login;
  if (!login || login !== process.env.ADMIN_GITHUB_LOGIN) {
    return null;
  }
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { projects } = await readProjects();
  return NextResponse.json({ projects });
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = (await req.json()) as { project: Project; originalSlug?: string };
  const { project, originalSlug } = body;

  if (!project?.slug || !project?.name) {
    return NextResponse.json({ error: "slug y name son requeridos" }, { status: 400 });
  }

  const { projects, sha } = await readProjects();

  const targetSlug = originalSlug ?? project.slug;
  const existingIndex = projects.findIndex((p) => p.slug === targetSlug);

  const duplicate = projects.some((p) => p.slug === project.slug && p.slug !== targetSlug);
  if (duplicate) {
    return NextResponse.json({ error: `Ya existe un proyecto con slug "${project.slug}"` }, { status: 409 });
  }

  project.lastModified = new Date().toISOString();

  let next: Project[];
  let message: string;
  if (existingIndex >= 0) {
    next = [...projects];
    next[existingIndex] = project;
    message = `admin: update project ${project.slug}`;
  } else {
    next = [...projects, project];
    message = `admin: add project ${project.slug}`;
  }

  await writeProjects(next, sha, message);
  return NextResponse.json({ ok: true, project });
}
