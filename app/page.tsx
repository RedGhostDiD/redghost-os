"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAudio } from "@/lib/audio";
import { SITE_CONFIG } from "@/lib/site-config";
import { BOOT_INTRO_FLAG } from "@/components/BootIntro";

const BOOT_LINES = [
  "initializing REDGHOST system...",
  "loading DiD brand assets...",
  "checking modules...",
  "loading project database...",
  "establishing connection...",
  "identity verified...",
];

const CHAR_MS = 16;
const LINE_PAUSE_MS = 220;

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

type Phase = "gate" | "booting" | "ready" | "leaving";

export default function BootPage() {
  const router = useRouter();
  const { unlock, play } = useAudio();
  const [phase, setPhase] = useState<Phase>("gate");
  const [completedLines, setCompletedLines] = useState<string[]>([]);
  const [typing, setTyping] = useState("");
  const startedRef = useRef(false);

  const runBoot = useCallback(async () => {
    if (startedRef.current) return;
    startedRef.current = true;
    setPhase("booting");

    for (const line of BOOT_LINES) {
      for (let i = 1; i <= line.length; i++) {
        setTyping(line.slice(0, i));
        await delay(CHAR_MS);
      }
      play("boot-line");
      setCompletedLines((prev) => [...prev, line]);
      setTyping("");
      await delay(LINE_PAUSE_MS);
    }

    setPhase("ready");
    play("boot-ready");
    await delay(900);
    setPhase("leaving");
    await delay(500);
    sessionStorage.setItem(BOOT_INTRO_FLAG, "1");
    router.push("/inicio");
  }, [play, router]);

  const handleStart = useCallback(() => {
    unlock();
    void runBoot();
  }, [unlock, runBoot]);

  useEffect(() => {
    window.addEventListener("keydown", handleStart);
    window.addEventListener("pointerdown", handleStart);
    return () => {
      window.removeEventListener("keydown", handleStart);
      window.removeEventListener("pointerdown", handleStart);
    };
  }, [handleStart]);

  return (
    <main
      className={`flex-1 flex items-center justify-center px-6 transition-opacity duration-500 ${
        phase === "leaving" ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="rg-grid-matrix" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-xl">
        <div className="px-6 py-12 sm:px-10 sm:py-16">
          {phase === "gate" && (
            <div className="text-center select-none">
              <p className="text-[var(--rg-red)] rg-glow-red text-lg sm:text-xl font-semibold tracking-[0.35em] mb-3">
                REDGHOST_OS
              </p>
              <p className="text-[var(--rg-text-faint)] text-[10px] tracking-[0.3em] mb-8">
                DIBUJO • INTELIGENCIA • DESARROLLO
              </p>
              <p className="text-[var(--rg-text-dim)] text-xs tracking-[0.2em] rg-blink">
                PRESS ANY KEY OR CLICK TO INITIALIZE
              </p>
            </div>
          )}

          {phase !== "gate" && (
            <div className="rg-mono text-sm leading-relaxed">
              <p className="text-[var(--rg-red-dim)] tracking-[0.15em] mb-4">
                REDGHOST SYSTEM // BOOT SEQUENCE
              </p>
              <div className="space-y-1">
                {completedLines.map((line, i) => (
                  <p key={`${i}-${line}`} className="text-[var(--rg-text-dim)]">
                    <span className="text-[var(--rg-red-dim)]">{">"}</span> {line}
                  </p>
                ))}
                {phase === "booting" && (
                  <p className="text-[var(--rg-text)]">
                    <span className="text-[var(--rg-red-dim)]">{">"}</span> {typing}
                    <span className="inline-block w-2 h-4 align-middle ml-0.5 bg-[var(--rg-red-dim)] rg-blink" />
                  </p>
                )}
                {(phase === "ready" || phase === "leaving") && (
                  <p className="text-[var(--rg-green)] rg-glow-green mt-4 tracking-[0.25em]">
                    SYSTEM READY
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between text-[9px] tracking-[0.15em] text-[var(--rg-text-faint)]">
          <span>REDGHOST.OS BUILD {SITE_CONFIG.buildVersion}</span>
          <span>DiD BRAND {SITE_CONFIG.didBrandVersion}</span>
        </div>
      </div>
    </main>
  );
}
