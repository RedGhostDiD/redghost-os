"use client";

import Link from "next/link";
import { useAudio } from "@/lib/audio";

type Tone = "red" | "red-dim" | "orange" | "green";

const TONE_VAR: Record<Tone, string> = {
  red: "var(--rg-red)",
  "red-dim": "var(--rg-red-dim)",
  orange: "var(--rg-orange)",
  green: "var(--rg-green)",
};

interface ModuleWidgetProps {
  href: string;
  label: string;
  readout: string;
  tone?: Tone;
  icon: React.ReactNode;
}

export default function ModuleWidget({
  href,
  label,
  readout,
  tone = "red-dim",
  icon,
}: ModuleWidgetProps) {
  const { play } = useAudio();
  const color = TONE_VAR[tone];

  return (
    <Link
      href={href}
      onMouseEnter={() => play("ui-hover")}
      onClick={() => play("ui-click")}
      className="rg-neo-widget group relative flex flex-1 min-w-[128px] basis-[128px] flex-col items-center gap-2 px-3 py-5 text-center"
      style={{ color }}
      onMouseOver={(e) => {
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.boxShadow = `0 0 18px color-mix(in srgb, ${color} 45%, transparent), 0 0 36px color-mix(in srgb, ${color} 25%, transparent)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "";
        e.currentTarget.style.boxShadow = "";
      }}
    >
      <span className="rg-neo-icon w-7 h-7">{icon}</span>
      <span className="text-[10px] tracking-[0.18em] text-[var(--rg-text)]">
        [ {label} ]
      </span>
      <span
        className="rg-neo-readout absolute -top-2 right-2 text-[8px] tracking-[0.1em] px-1.5 py-0.5 border"
        style={{ color, borderColor: color, background: "rgba(6,3,9,0.85)" }}
      >
        {readout}
      </span>
    </Link>
  );
}
