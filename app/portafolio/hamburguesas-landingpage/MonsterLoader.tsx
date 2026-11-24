"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// Loading screen: the monster chomps the progress bar from right to left.
// Progress follows the real page load (window load + fonts) with a minimum
// duration so the animation reads. When it finishes it adds `mb-ready` to the
// page wrapper, which releases the hero's pop-in animations.
const MIN_MS = 2200;
const MAX_MS = 7000; // never block the page longer than this

export default function MonsterLoader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const page = el.closest(".mb");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const minMs = reduce ? 300 : MIN_MS;

    let pageLoaded = document.readyState === "complete";
    let fontsLoaded = false;
    const onLoad = () => { pageLoaded = true; };
    window.addEventListener("load", onLoad);
    document.fonts?.ready.then(() => { fontsLoaded = true; });

    const start = performance.now();
    let current = 0;
    let raf = 0;
    let hideTimer: ReturnType<typeof setTimeout> | undefined;

    const tick = (now: number) => {
      const elapsed = now - start;
      const ready = (pageLoaded && fontsLoaded) || elapsed > MAX_MS;
      const timeShare = Math.min(1, elapsed / minMs);
      // hold at 90% until the page is actually ready
      const target = ready ? timeShare : Math.min(timeShare, 0.9);
      current += (target - current) * 0.1;
      if (ready && timeShare >= 1 && current > 0.995) current = 1;

      el.style.setProperty("--p", current.toFixed(4));
      if (pctRef.current) pctRef.current.textContent = String(Math.round(current * 100));

      if (current < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setDone(true);
        page?.classList.add("mb-ready");
        hideTimer = setTimeout(() => setGone(true), 700);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(hideTimer);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  if (gone) return null;

  return (
    <div
      ref={rootRef}
      className={`mb-loader${done ? " is-done" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Cargando Monster Burger"
    >
      <div className="mb-loader-inner">
        <p className="mb-loader-brand" aria-hidden="true">
          Monster<span>Burger</span>
        </p>

        <div className="mb-loader-track">
          <div className="mb-loader-bar" />
          <div className="mb-loader-eater">
            <Image
              src="/portafolio/hamburguesas/monstruo-comiendo.webp"
              alt=""
              width={1185}
              height={1143}
              priority
              sizes="180px"
              className="mb-loader-monster"
            />
            <span className="mb-crumb" />
            <span className="mb-crumb" />
            <span className="mb-crumb" />
            <span className="mb-crumb" />
          </div>
        </div>

        <p className="mb-loader-pct">
          <span ref={pctRef}>0</span>%
        </p>
      </div>
    </div>
  );
}
