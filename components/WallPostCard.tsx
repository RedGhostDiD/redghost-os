import Link from "next/link";
import type { WallPost } from "@/lib/wall";
import { MOOD_TONE, STATUS_TONE, timeAgo } from "@/lib/wall";
import { getProject } from "@/lib/projects";

const TONE_VAR: Record<string, string> = {
  green: "var(--rg-green)",
  orange: "var(--rg-orange)",
  "orange-dim": "var(--rg-orange-dim)",
  red: "var(--rg-red)",
  "red-dim": "var(--rg-red-dim)",
};

function youtubeEmbedId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([\w-]{11})/);
  return m ? m[1] : null;
}

export default function WallPostCard({ post }: { post: WallPost }) {
  const project = post.projectSlug ? getProject(post.projectSlug) : undefined;
  const ytId = post.videoUrl ? youtubeEmbedId(post.videoUrl) : null;

  return (
    <div className="border p-3 sm:p-4" style={{ borderColor: "var(--rg-red-line)", background: "var(--rg-panel)" }}>
      <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
        <span className="text-[10px] tracking-[0.15em]" style={{ color: "var(--rg-text-faint)" }}>
          {post.id}
        </span>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className="text-[9px] tracking-[0.1em] px-1.5 py-0.5 border"
            style={{ borderColor: "var(--rg-red-line)", color: "var(--rg-text-dim)" }}
          >
            {post.type}
          </span>
          <span
            className="text-[9px] tracking-[0.1em] px-1.5 py-0.5 border"
            style={{ borderColor: "var(--rg-red-line)", color: TONE_VAR[MOOD_TONE[post.mood]] }}
          >
            {post.mood}
          </span>
          <span
            className="text-[9px] tracking-[0.1em] px-1.5 py-0.5 border"
            style={{ borderColor: "var(--rg-red-line)", color: TONE_VAR[STATUS_TONE[post.status]] }}
          >
            {post.status}
          </span>
        </div>
      </div>

      {post.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.image}
          alt=""
          className="w-full max-h-96 object-cover border mb-3"
          style={{ borderColor: "var(--rg-red-line)" }}
        />
      )}

      {post.videoUrl && (
        <div className="mb-3">
          {ytId ? (
            <div className="relative w-full border" style={{ borderColor: "var(--rg-red-line)", aspectRatio: "16/9" }}>
              <iframe
                src={`https://www.youtube.com/embed/${ytId}`}
                title={post.id}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <a
              href={post.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rg-action-link inline-block text-[10px] tracking-[0.15em] border px-3 py-1.5"
            >
              [ VER VIDEO ]
            </a>
          )}
        </div>
      )}

      <div className="space-y-1.5 text-sm text-[var(--rg-text-dim)] leading-relaxed">
        {post.text.map((line, i) => (
          <p key={i} style={line.startsWith(">") ? { color: "var(--rg-text-faint)" } : undefined}>
            {line}
          </p>
        ))}
      </div>

      <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t" style={{ borderColor: "var(--rg-red-line-soft)" }}>
        {project ? (
          <Link
            href={`/proyectos/${project.slug}`}
            className="text-[9px] tracking-[0.15em]"
            style={{ color: "var(--rg-red-soft)" }}
          >
            → {project.name}
          </Link>
        ) : (
          <span />
        )}
        <span className="text-[9px] tracking-[0.1em]" style={{ color: "var(--rg-text-faint)" }}>
          {timeAgo(post.createdAt)}
        </span>
      </div>
    </div>
  );
}
