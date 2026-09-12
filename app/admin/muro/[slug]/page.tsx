import { notFound } from "next/navigation";
import { readWallPosts, readProjects } from "@/lib/github-content";
import WallForm from "../../WallForm";

export const dynamic = "force-dynamic";

export default async function EditarPublicacionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { posts } = await readWallPosts();
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();
  const { projects } = await readProjects();

  return (
    <>
      <h1 className="text-sm tracking-[0.2em]" style={{ color: "var(--rg-red)" }}>
        EDITAR // {post.id}
      </h1>
      <WallForm initial={post} existingPosts={posts} projects={projects} />
    </>
  );
}
