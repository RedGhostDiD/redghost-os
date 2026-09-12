import { readWallPosts, readProjects } from "@/lib/github-content";
import WallForm from "../../WallForm";

export const dynamic = "force-dynamic";

export default async function NuevaPublicacionPage() {
  const { posts } = await readWallPosts();
  const { projects } = await readProjects();

  return (
    <>
      <h1 className="text-sm tracking-[0.2em]" style={{ color: "var(--rg-red)" }}>
        NUEVA PUBLICACIÓN
      </h1>
      <WallForm existingPosts={posts} projects={projects} />
    </>
  );
}
