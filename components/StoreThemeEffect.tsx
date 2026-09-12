"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Toggles .rg-store-theme on <body> while browsing /store. Done on body
 * (not a wrapping div) so the swap reaches everything, including decor
 * layers rendered outside the (system) layout tree — BinaryRain, the
 * atmosphere glow, the grid — not just nav/panels/footer.
 */
export default function StoreThemeEffect() {
  const pathname = usePathname();

  useEffect(() => {
    const isStore = pathname?.startsWith("/store") ?? false;
    document.body.classList.toggle("rg-store-theme", isStore);
    return () => {
      document.body.classList.remove("rg-store-theme");
    };
  }, [pathname]);

  return null;
}
