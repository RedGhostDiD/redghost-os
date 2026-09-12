"use client";

import { useState } from "react";

type Phase = "idle" | "authenticating" | "verified" | "opening";

const PHASE_LINES: Record<Exclude<Phase, "idle">, string> = {
  authenticating: "> AUTHENTICATING...",
  verified: "> CLEARANCE VERIFIED",
  opening: "> OPENING MARKET...",
};

const PHASE_COLOR: Record<Exclude<Phase, "idle">, string> = {
  authenticating: "var(--rg-red)",
  verified: "var(--rg-green)",
  opening: "var(--rg-red)",
};

export default function BlackMarketButton({
  url,
  enabled,
}: {
  url: string;
  enabled: boolean;
}) {
  const [phase, setPhase] = useState<Phase>("idle");

  function handleClick() {
    if (!enabled || phase !== "idle") return;
    setPhase("authenticating");
    setTimeout(() => setPhase("verified"), 600);
    setTimeout(() => setPhase("opening"), 1200);
    setTimeout(() => {
      window.open(url, "_blank", "noopener,noreferrer");
      setPhase("idle");
    }, 1800);
  }

  if (!enabled) {
    return (
      <button type="button" disabled className="rg-market-btn rg-store-offline">
        {"> ACCESS BLACK MARKET"}
        <span className="block text-[10px] tracking-[0.3em] mt-1">OFFLINE</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={phase !== "idle"}
      className="group rg-market-btn"
      style={
        phase !== "idle"
          ? { borderColor: PHASE_COLOR[phase], color: PHASE_COLOR[phase] }
          : undefined
      }
    >
      {phase === "idle" ? (
        <>
          {"> ACCESS BLACK MARKET"}
          <span className="rg-blink ml-1 inline-block opacity-0 group-hover:opacity-100">█</span>
        </>
      ) : (
        PHASE_LINES[phase]
      )}
    </button>
  );
}
