"use client";

import { useState } from "react";

const STORE_URL = "https://redghost.store";

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

export default function BlackMarketButton() {
  const [phase, setPhase] = useState<Phase>("idle");

  function handleClick() {
    if (phase !== "idle") return;
    setPhase("authenticating");
    setTimeout(() => setPhase("verified"), 600);
    setTimeout(() => setPhase("opening"), 1200);
    setTimeout(() => {
      window.open(STORE_URL, "_blank", "noopener,noreferrer");
      setPhase("idle");
    }, 1800);
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
