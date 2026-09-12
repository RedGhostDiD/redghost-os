"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const GLITCH_DURATION_MS = 550;

/**
 * Toggles .rg-store-theme on <body> while browsing /store — done on body
 * (not a wrapping div) so the swap reaches everything, including decor
 * layers rendered outside the (system) layout tree (BinaryRain, the
 * atmosphere glow, the grid) — and fires a one-shot full-screen glitch
 * burst whenever that boundary is crossed, entering or leaving.
 */
export default function StoreThemeEffect() {
  const pathname = usePathname();
  const prevIsStoreRef = useRef<boolean | null>(null);
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    const isStore = pathname?.startsWith("/store") ?? false;
    document.body.classList.toggle("rg-store-theme", isStore);

    const prev = prevIsStoreRef.current;
    prevIsStoreRef.current = isStore;
    if (prev === null || prev === isStore) return;

    setGlitching(true);
    const t = setTimeout(() => setGlitching(false), GLITCH_DURATION_MS);
    return () => clearTimeout(t);
  }, [pathname]);

  if (!glitching) return null;

  return (
    <>
      <div className="rg-page-glitch-flicker" aria-hidden="true" />
      <div className="rg-page-glitch-scan" aria-hidden="true" />
    </>
  );
}
