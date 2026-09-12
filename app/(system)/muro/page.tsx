import Panel from "@/components/Panel";
import WallPostCard from "@/components/WallPostCard";
import { WALL_POSTS } from "@/lib/wall";

export const metadata = { title: "RG//WALL // REDGHOST_OS" };

export default function MuroPage() {
  return (
    <div className="flex flex-col gap-5">
      <Panel id="MOD_060" title="RG//WALL" status={{ label: "LIVE", tone: "green" }}>
        <p className="text-xs text-[var(--rg-text-dim)] leading-relaxed">
          Registro de actividad — proyectos, fallas, ideas y momentos. No es la ficha completa de un
          proyecto, es lo que está pasando mientras se construye.
        </p>
      </Panel>

      {WALL_POSTS.length > 0 ? (
        <div className="flex flex-col gap-3">
          {WALL_POSTS.map((post) => (
            <WallPostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-xs" style={{ color: "var(--rg-text-faint)" }}>
          Sin publicaciones todavía.
        </p>
      )}
    </div>
  );
}
