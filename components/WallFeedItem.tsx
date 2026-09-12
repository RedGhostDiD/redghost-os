"use client";

import { useEffect, useRef, useState } from "react";
import WallPostCard from "./WallPostCard";
import type { WallPost } from "@/lib/wall";

const FALLBACK_HEIGHT = 220;
/** How far outside the viewport a post can be before its heavy content
 * (images, video embeds) gets unmounted to keep the feed light. */
const KEEP_MARGIN = "800px 0px 800px 0px";

export default function WallFeedItem({ post, index }: { post: WallPost; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [inRange, setInRange] = useState(false);
  const [lastHeight, setLastHeight] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          setInRange(true);
        } else {
          if (el.offsetHeight) setLastHeight(el.offsetHeight);
          setInRange(false);
        }
      },
      { rootMargin: KEEP_MARGIN, threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`rg-wall-item ${visible ? "rg-wall-item-visible" : ""}`}
      style={{
        transitionDelay: `${Math.min(index, 6) * 60}ms`,
        minHeight: !inRange ? lastHeight ?? FALLBACK_HEIGHT : undefined,
      }}
    >
      {inRange && <WallPostCard post={post} />}
    </div>
  );
}
