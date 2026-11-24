"use client";

import { useEffect, useRef } from "react";

const COLS = 24;
const ROWS = 18;
/** How much of the scroll each bar takes to vanish (0–1 of the whole run). */
const SPAN = 0.25;

/** Deterministic 0–1 noise per cell, so server and client render the same bars. */
function noise(c: number, r: number) {
  const s = Math.sin(c * 127.1 + r * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

const BARS = Array.from({ length: COLS * ROWS }, (_, i) => {
  const c = i % COLS;
  const r = Math.floor(i / COLS);
  const fromBottom = (ROWS - 1 - r) / (ROWS - 1);
  // Bottom rows go first, each column a little out of step with its neighbours.
  const delay = fromBottom * 0.55 + noise(Math.floor(c / 2), r) * 0.2;
  return { c, r, delay };
});

/**
 * Sticky reveal: the stage (the cream contact card) stays pinned while a grid
 * of black bars covering it thins out and disappears as the visitor scrolls.
 * When every bar is gone the stage unpins and the page scrolls on normally.
 *
 * Links to #contacto land at the end of the run, with the card fully open.
 */
export default function BarsReveal({ children }: { children: React.ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const bars = barsRef.current;
    if (!section || !stage || !bars) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    /** Scroll position where the bars are all gone and the card is complete. */
    const endOfRun = () =>
      section.getBoundingClientRect().top + window.scrollY + (section.offsetHeight - stage.offsetHeight);

    const layout = () => {
      // Scroll distance = stage height + 1.4 screens of "pinned" scrolling.
      const run = reduced.matches ? 0 : window.innerHeight * 1.4;
      section.style.height = `${stage.offsetHeight + run}px`;
    };

    const update = () => {
      frame = 0;
      let p = 1;
      if (!reduced.matches) {
        const rect = section.getBoundingClientRect();
        const run = rect.height - stage.offsetHeight;
        p = run > 0 ? Math.min(1, Math.max(0, -rect.top / run)) : 1;
      }
      bars.style.setProperty("--p", p.toFixed(4));
    };

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.('a[href="#contacto"]');
      if (!link) return;
      e.preventDefault();
      history.replaceState(null, "", "#contacto");
      window.scrollTo({ top: endOfRun(), behavior: reduced.matches ? "auto" : "smooth" });
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onResize = () => {
      layout();
      update();
    };

    onResize();
    bars.dataset.ready = "1";
    if (location.hash === "#contacto") window.scrollTo({ top: endOfRun(), behavior: "auto" });
    document.addEventListener("click", onClick);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    reduced.addEventListener("change", onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(stage);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      reduced.removeEventListener("change", onResize);
      ro.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} className="pf-reveal" id="contacto">
      <div ref={stageRef} className="pf-stage">
        {children}
        <div ref={barsRef} className="pf-bars" aria-hidden="true" style={{ ["--span" as string]: SPAN }}>
          {BARS.map(({ c, r, delay }) => (
            <i
              key={`${c}-${r}`}
              style={{
                left: `${(c / COLS) * 100}%`,
                top: `${(r / ROWS) * 100}%`,
                width: `calc(${100 / COLS}% + 1px)`,
                height: `calc(${100 / ROWS}% + 1px)`,
                ["--d" as string]: delay.toFixed(3),
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
