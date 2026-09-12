import Link from "next/link";
import { readWallPosts } from "@/lib/github-content";
import WallList from "../WallList";

export const dynamic = "force-dynamic";

export default async function AdminMuroPage() {
  const { posts } = await readWallPosts();

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-sm tracking-[0.2em]" style={{ color: "var(--rg-red)" }}>
          ADMIN // RG//WALL
        </h1>
        <Link
          href="/admin"
          className="text-[10px] tracking-[0.1em] px-3 py-1.5 border"
          style={{ borderColor: "var(--rg-red-line)", color: "var(--rg-text-faint)" }}
        >
          VOLVER
        </Link>
      </div>

      <Link
        href="/admin/muro/nuevo"
        className="text-xs tracking-[0.15em] self-start px-4 py-2.5 border"
        style={{ borderColor: "var(--rg-red)", color: "var(--rg-red-soft)" }}
      >
        + NUEVA PUBLICACIÓN
      </Link>

      <WallList posts={posts} />
    </>
  );
}
