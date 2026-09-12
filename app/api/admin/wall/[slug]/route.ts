import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { readWallPosts, writeWallPosts } from "@/lib/github-content";

async function requireAdmin() {
  const session = await auth();
  const login = session?.user?.login;
  if (!login || login !== process.env.ADMIN_GITHUB_LOGIN) return null;
  return session;
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { slug } = await params;
  const { posts, sha } = await readWallPosts();

  const next = posts.filter((p) => p.slug !== slug);
  if (next.length === posts.length) {
    return NextResponse.json({ error: "Publicación no encontrada" }, { status: 404 });
  }

  await writeWallPosts(next, sha, `admin: delete wall post ${slug}`);
  return NextResponse.json({ ok: true });
}
