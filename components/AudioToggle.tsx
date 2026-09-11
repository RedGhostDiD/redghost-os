"use client";

import { useAudio } from "@/lib/audio";

export default function AudioToggle() {
  const { enabled, toggle } = useAudio();

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex items-center gap-1.5 border px-2 py-1 transition-colors"
      style={{
        borderColor: enabled ? "rgba(51, 224, 138, 0.4)" : "var(--rg-red-line)",
        color: enabled ? "var(--rg-green)" : "var(--rg-text-faint)",
      }}
      aria-pressed={enabled}
      title={enabled ? "AUDIO: ON" : "AUDIO: OFF"}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: enabled ? "var(--rg-green)" : "var(--rg-text-faint)" }}
      />
      <span className="hidden sm:inline">AUDIO: {enabled ? "ON" : "OFF"}</span>
    </button>
  );
}
