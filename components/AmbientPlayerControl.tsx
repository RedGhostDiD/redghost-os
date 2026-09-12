"use client";

import { useEffect, useRef, useState } from "react";
import { useAudio } from "@/lib/audio";

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * Small popover with playback controls for the background ambience —
 * kept entirely separate from <AudioToggle> (mute on/off) so that
 * button's behavior and look stay exactly as they were.
 */
export default function AmbientPlayerControl() {
  const { ambientPlaying, ambientPosition, ambientDuration, ambientPause, ambientResume, ambientSeek } =
    useAudio();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  if (ambientDuration <= 0) return null;

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 border px-2 py-1 transition-colors"
        style={{ borderColor: "var(--rg-red-line)", color: "var(--rg-text-faint)" }}
        aria-expanded={open}
        title="AMBIENT TRACK"
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: ambientPlaying ? "var(--rg-orange)" : "var(--rg-text-faint)" }}
        />
        <span className="hidden sm:inline">{formatTime(ambientPosition)}</span>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1.5 z-30 border p-2.5 flex flex-col gap-2 rg-neo-panel"
          style={{ borderColor: "var(--rg-red-line)", minWidth: 180 }}
        >
          <p className="text-[9px] tracking-[0.15em]" style={{ color: "var(--rg-text-faint)" }}>
            AMBIENT TRACK
          </p>
          <p className="text-xs tracking-[0.1em] text-center" style={{ color: "var(--rg-text)" }}>
            {formatTime(ambientPosition)} / {formatTime(ambientDuration)}
          </p>
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => ambientSeek(-10)}
              className="text-[10px] tracking-[0.1em] px-2 py-1 border"
              style={{ borderColor: "var(--rg-red-line)", color: "var(--rg-text-dim)" }}
              title="-10s"
            >
              «10
            </button>
            <button
              type="button"
              onClick={() => (ambientPlaying ? ambientPause() : ambientResume())}
              className="text-[10px] tracking-[0.1em] px-3 py-1 border"
              style={{ borderColor: "var(--rg-red)", color: "var(--rg-red-soft)" }}
            >
              {ambientPlaying ? "PAUSE" : "PLAY"}
            </button>
            <button
              type="button"
              onClick={() => ambientSeek(10)}
              className="text-[10px] tracking-[0.1em] px-2 py-1 border"
              style={{ borderColor: "var(--rg-red-line)", color: "var(--rg-text-dim)" }}
              title="+10s"
            >
              10»
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
