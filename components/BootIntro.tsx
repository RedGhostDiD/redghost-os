"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import HeroTitle from "./HeroTitle";
import { useAudio } from "@/lib/audio";

export const BOOT_INTRO_FLAG = "rg-boot-intro";

/**
 * REDGHOST lives free-standing, centered in the first screen, always at the
 * same spot — the boot hand-off never moves or hides it, it just gets a
 * one-shot glitch pulse. `children` (the MOD panel stack) is briefly held
 * back so it visibly appears *after* the glitch, only right after boot.
 * Any other way of landing on /inicio renders everything immediately.
 */
export default function BootIntro({ children }: { children: React.ReactNode }) {
  const { play } = useAudio();
  const playRef = useRef(play);
  useEffect(() => {
    playRef.current = play;
  }, [play]);
  const [ready, setReady] = useState(true);
  const [glitching, setGlitching] = useState(false);
  // Dev Strict Mode runs this effect twice (mount -> cleanup -> mount). The
  // sessionStorage flag must only be read/consumed on the first of those —
  // a ref survives the cleanup in between, unlike a value re-read from
  // storage on the second pass (which would already be gone).
  const consumedRef = useRef<boolean | null>(null);

  useLayoutEffect(() => {
    if (consumedRef.current === null) {
      consumedRef.current = sessionStorage.getItem(BOOT_INTRO_FLAG) === "1";
      sessionStorage.removeItem(BOOT_INTRO_FLAG);
    }
    if (!consumedRef.current) return;

    setReady(false);
    setGlitching(true);
    playRef.current("boot-glitch");
    const t1 = setTimeout(() => setGlitching(false), 380);
    const t2 = setTimeout(() => setReady(true), 900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <>
      <div className={`flex items-center justify-center min-h-[75vh] sm:min-h-[80vh] ${glitching ? "rg-boot-glitch" : ""}`}>
        <HeroTitle />
      </div>
      {ready && children}
    </>
  );
}
