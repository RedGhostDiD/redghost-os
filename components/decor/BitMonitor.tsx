"use client";

import { useEffect, useState } from "react";

const GRID = 20;
const CELL_COUNT = GRID * GRID;
const HEX_GROUPS_PER_LINE = 10;
const HEX_LINES = 12;

function hexByte() {
  return Math.floor(Math.random() * 256)
    .toString(16)
    .padStart(2, "0")
    .toUpperCase();
}

function randomHexLine() {
  return Array.from({ length: HEX_GROUPS_PER_LINE }, hexByte).join(" ");
}

function randomHexLines() {
  return Array.from({ length: HEX_LINES }, randomHexLine);
}

// Deterministic starting pattern so server and client render the same
// markup on first paint; real flicker only starts once mounted.
const INITIAL_CELLS = Array.from({ length: CELL_COUNT }, (_, i) => i % 5 === 0);
const INITIAL_HEX_LINES = Array.from({ length: HEX_LINES }, () => "00 00 00 00 00 00 00 00 00 00");

/**
 * Fake "bit monitor" — a dense square grid of lights that flicker on/off,
 * paired with a random hex readout the same size. Decorative only.
 */
export default function BitMonitor() {
  const [cells, setCells] = useState<boolean[]>(INITIAL_CELLS);
  const [hexLines, setHexLines] = useState<string[]>(INITIAL_HEX_LINES);

  useEffect(() => {
    setCells(Array.from({ length: CELL_COUNT }, () => Math.random() > 0.62));
    setHexLines(randomHexLines());

    const flicker = setInterval(() => {
      setCells((prev) => {
        const next = [...prev];
        const flips = 4 + Math.floor(Math.random() * 16);
        for (let i = 0; i < flips; i++) {
          const idx = Math.floor(Math.random() * CELL_COUNT);
          next[idx] = !next[idx];
        }
        return next;
      });
    }, 220);

    const hexTick = setInterval(() => {
      setHexLines((prev) => [...prev.slice(1), randomHexLine()]);
    }, 260);

    return () => {
      clearInterval(flicker);
      clearInterval(hexTick);
    };
  }, []);

  return (
    <div className="rg-mono text-[10px] tracking-[0.1em]">
      <div className="flex flex-col sm:flex-row gap-4 items-stretch">
        <div className="flex flex-col w-full sm:w-[260px]">
          <p className="mb-2" style={{ color: "var(--rg-text-faint)" }}>
            BIT MONITOR
          </p>
          <div
            className="grid gap-[2px] p-2 border w-full aspect-square"
            style={{
              gridTemplateColumns: `repeat(${GRID}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${GRID}, minmax(0, 1fr))`,
              borderColor: "var(--rg-red-line)",
              background: "rgba(255, 22, 61,0.04)",
            }}
          >
            {cells.map((on, i) => (
              <span
                key={i}
                style={{
                  background: on ? "var(--rg-orange)" : "rgba(255,138,43,0.08)",
                  boxShadow: on ? "0 0 3px rgba(255,138,43,0.8)" : "none",
                  transition: "background 150ms ease, box-shadow 150ms ease",
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col w-full sm:w-[260px]">
          <p className="mb-2" style={{ color: "var(--rg-text-faint)" }}>
            ASCII // HEX
          </p>
          <div
            className="flex flex-col justify-between w-full flex-1 p-3 border text-[10px] sm:text-xs leading-none"
            style={{ borderColor: "var(--rg-red-line)", background: "rgba(255, 22, 61,0.04)" }}
          >
            {hexLines.map((line, i) => (
              <p
                key={i}
                className="tracking-[0.05em] whitespace-nowrap"
                style={{
                  color: "var(--rg-text-dim)",
                  opacity: Math.max(0.4, 1 - (HEX_LINES - 1 - i) * 0.08),
                }}
              >
                <span style={{ color: "var(--rg-orange)" }}>{">"}</span>{" "}
                <span style={{ color: "var(--rg-text)" }}>{line}</span>
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
