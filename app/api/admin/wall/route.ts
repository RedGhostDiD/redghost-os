import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { readWallPosts, writeWallPosts } from "@/lib/github-content";
import type { WallPost } from "@/lib/wall";

async function requireAdmin() {
  const session = await auth();
  const login = session?.user?.login;
  if (!login || login !== process.env.ADMIN_GITHUB_LOGIN) return null;
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { posts } = await readWallPosts();
  return NextResponse.json({ posts });
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = (await req.json()) as { post: WallPost; originalSlug?: string };
  const { post, originalSlug } = body;

  if (!post?.slug || !post?.id || !post?.text?.length) {
    return NextResponse.json({ error: "slug, id y texto son requeridos" }, { status: 400 });
  }

  const { posts, sha } = await readWallPosts();

  const targetSlug = originalSlug ?? post.slug;
  const existingIndex = posts.findIndex((p) => p.slug === targetSlug);

  const duplicate = posts.some((p) => p.slug === post.slug && p.slug !== targetSlug);
  if (duplicate) {
    return NextResponse.json({ error: `Ya existe una publicación con slug "${post.slug}"` }, { status: 409 });
  }

  let next: WallPost[];
  let message: string;
  if (existingIndex >= 0) {
    next = [...posts];
    next[existingIndex] = post;
    message = `admin: update wall post ${post.id}`;
  } else {
    next = [...posts, post];
    message = `admin: add wall post ${post.id}`;
  }

  await writeWallPosts(next, sha, message);
  return NextResponse.json({ ok: true, post });
}
