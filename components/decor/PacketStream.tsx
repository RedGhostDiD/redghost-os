"use client";

import { useEffect, useState } from "react";

function hex(len: number) {
  let out = "";
  for (let i = 0; i < len; i++) out += Math.floor(Math.random() * 16).toString(16);
  return out.toUpperCase();
}

function randomPacket() {
  return `${hex(4)}  ${hex(4)}  ${hex(4)}`;
}

type Row = { dir: "RX" | "TX"; data: string };

function makeRow(): Row {
  return { dir: Math.random() > 0.5 ? "RX" : "TX", data: randomPacket() };
}

/**
 * Fake network packet stream — RX/TX hex rows that scroll in on an
 * interval. Purely decorative; nothing here is real traffic.
 */
const PLACEHOLDER_ROWS: Row[] = [
  { dir: "RX", data: "0000  0000  0000" },
  { dir: "TX", data: "0000  0000  0000" },
  { dir: "RX", data: "0000  0000  0000" },
];

export default function PacketStream() {
  // Starts with static placeholder rows so server and client render the same
  // markup on first paint; real random packets only appear after mount.
  const [rows, setRows] = useState<Row[]>(PLACEHOLDER_ROWS);

  useEffect(() => {
    setRows([makeRow(), makeRow(), makeRow()]);
    const id = setInterval(() => {
      setRows((prev) => [makeRow(), ...prev].slice(0, 4));
    }, 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="rg-mono text-[10px] tracking-[0.1em] leading-relaxed">
      <p className="mb-1.5" style={{ color: "var(--rg-text-faint)" }}>
        PACKET MONITOR
      </p>
      {rows.map((row, i) => (
        <p key={i} style={{ color: i === 0 ? "var(--rg-text)" : "var(--rg-text-dim)", opacity: 1 - i * 0.18 }}>
          <span style={{ color: row.dir === "RX" ? "var(--rg-green)" : "var(--rg-orange)" }}>{row.dir}</span>{" "}
          {row.data}
        </p>
      ))}
    </div>
  );
}
