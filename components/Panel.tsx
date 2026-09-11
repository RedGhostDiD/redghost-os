"use client";

import { useEffect, useRef, useState } from "react";
import { useAudio } from "@/lib/audio";

type Stage = "dot" | "line" | "box" | "content";
type Tone = "green" | "orange" | "orange-dim" | "red" | "red-dim";

interface PanelProps {
  id?: string;
  title: string;
  status?: { label: string; tone?: Tone };
  delayMs?: number;
  className?: string;
  children: React.ReactNode;
}

const TONE_VAR: Record<Tone, string> = {
  green: "var(--rg-green)",
  orange: "var(--rg-orange)",
  "orange-dim": "var(--rg-orange-dim)",
  red: "var(--rg-red)",
  "red-dim": "var(--rg-red-dim)",
};

/**
 * Panel entrance sequence per RedGhost.OS spec:
 * dot -> vertical line (+sound) -> horizontal box (+sound) -> content fade-in.
 * The real content is always in the DOM (opacity 0 while "building") so it
 * defines the panel's final size and the build overlay never causes reflow.
 */
export default function Panel({
  id,
  title,
  status,
  delayMs = 0,
  className = "",
  children,
}: PanelProps) {
  const { play } = useAudio();
  const [stage, setStage] = useState<Stage>("dot");
  const lineRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setStage("line"), delayMs + 140);
    return () => clearTimeout(t);
  }, [delayMs]);

  useEffect(() => {
    if (stage !== "line") return;
    const el = lineRef.current;
    if (!el) return;
    const onEnd = () => {
      play("panel-vertical");
      setStage("box");
    };
    el.addEventListener("transitionend", onEnd, { once: true });
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        el.style.transform = "scaleY(1)";
      })
    );
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("transitionend", onEnd);
    };
  }, [stage, play]);

  useEffect(() => {
    if (stage !== "box") return;
    const el = boxRef.current;
    if (!el) return;
    const onEnd = () => {
      play("panel-horizontal");
      setStage("content");
    };
    el.addEventListener("transitionend", onEnd, { once: true });
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        el.style.transform = "scaleX(1)";
      })
    );
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("transitionend", onEnd);
    };
  }, [stage, play]);

  const building = stage !== "content";

  return (
    <div className={`relative ${className}`}>
      {building && (
        <div className="absolute inset-0 flex items-center justify-center">
          {stage === "dot" && (
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--rg-red)]" />
          )}
          {stage === "line" && (
            <div
              ref={lineRef}
              className="w-px h-full bg-[var(--rg-red)] origin-center transition-transform duration-300 ease-out"
              style={{ transform: "scaleY(0)" }}
            />
          )}
          {stage === "box" && (
            <div
              ref={boxRef}
              className="w-full h-full border origin-center transition-transform duration-300 ease-out"
              style={{
                transform: "scaleX(0)",
                borderColor: "var(--rg-red-line)",
              }}
            />
          )}
        </div>
      )}

      <div
        className={`relative border backdrop-blur-[1px] transition-opacity duration-300 rg-neo-panel ${
          stage === "content" ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="rg-neo-panel-header flex items-center justify-between gap-3 px-3 py-2 border-b text-[10px] tracking-[0.15em]">
          <span className="min-w-0 flex-1 truncate">
            {id ?? "MOD"} // {title.toUpperCase()}
          </span>
          {status && (
            <span
              className="flex items-center gap-1.5 shrink-0"
              style={{ color: TONE_VAR[status.tone ?? "green"] }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: TONE_VAR[status.tone ?? "green"] }}
              />
              {status.label}
            </span>
          )}
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
