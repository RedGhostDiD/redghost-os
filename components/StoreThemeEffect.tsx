"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { scramblePageText } from "@/lib/textScramble";

// Must match --rg-void in globals.css (default) and .rg-store-theme (store).
const VOID_DEFAULT = "#050509";
const VOID_STORE = "#140700";

function flickerBackground(finalIsStore: boolean, minDelay: number, maxDelay: number, minFlickers: number, maxFlickers: number) {
  const overlay = document.createElement("div");
  overlay.setAttribute("aria-hidden", "true");
  Object.assign(overlay.style, {
    position: "fixed",
    inset: "0",
    zIndex: "9998",
    pointerEvents: "none",
    mixBlendMode: "normal",
  } as CSSStyleDeclaration);
  document.body.appendChild(overlay);

  const flickers = minFlickers + Math.floor(Math.random() * (maxFlickers - minFlickers + 1));
  let shown = false;

  function step(i: number) {
    if (i >= flickers) {
      overlay.remove();
      return;
    }
    shown = !shown;
    overlay.style.background = shown ? VOID_STORE : VOID_DEFAULT;
    overlay.style.opacity = shown === finalIsStore ? "0.55" : "0.35";
    const delay = minDelay + Math.random() * (maxDelay - minDelay);
    setTimeout(() => step(i + 1), delay);
  }

  step(0);
}

/**
 * Toggles .rg-store-theme on <body> while browsing /store — done on body
 * (not a wrapping div) so the swap reaches everything, including decor
 * layers rendered outside the (system) layout tree (BinaryRain, the
 * atmosphere glow, the grid). Whenever that boundary is crossed it also
 * scrambles all visible page text for a moment and flickers the
 * background 3-4 times between the old and new void color. Same timing
 * both ways — entering and leaving feel identical.
 */
export default function StoreThemeEffect() {
  const pathname = usePathname();
  const prevIsStoreRef = useRef<boolean | null>(null);

  useEffect(() => {
    const isStore = pathname?.startsWith("/store") ?? false;
    const prev = prevIsStoreRef.current;
    prevIsStoreRef.current = isStore;

    document.body.classList.toggle("rg-store-theme", isStore);

    if (prev === null || prev === isStore) return;

    flickerBackground(isStore, 70, 190, 3, 4);
    const cancel = scramblePageText(document.body, 950, 120);
    return cancel;
  }, [pathname]);

  return null;
}
