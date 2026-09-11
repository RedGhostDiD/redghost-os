"use client";

import { useEffect, useState } from "react";

function jitter(base: number, spread: number) {
  return Math.round(base + (Math.random() - 0.5) * spread);
}

/**
 * Fake serial monitor readout — numbers drift on an interval but mean
 * nothing. Pure atmosphere for the Robotics module, not a real sensor feed.
 */
export default function SerialMonitor() {
  const [sensor1, setSensor1] = useState(482);
  const [sensor2, setSensor2] = useState(17);
  const [rpm, setRpm] = useState(1200);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setSensor1((v) => Math.max(0, jitter(v, 14)));
      setSensor2((v) => Math.max(0, jitter(v, 6)));
      setRpm((v) => Math.max(0, jitter(v, 40)));
      setTick((t) => t + 1);
    }, 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="rg-mono text-[10px] tracking-[0.1em] leading-relaxed">
      <p className="mb-1.5" style={{ color: "var(--rg-text-faint)" }}>
        SERIAL // COM3
      </p>
      <p style={{ color: "var(--rg-text-dim)" }}>
        <span style={{ color: "var(--rg-orange)" }}>{">"}</span> SENSOR_01:{" "}
        <span style={{ color: "var(--rg-text)" }}>{String(sensor1).padStart(3, "0")}</span>
      </p>
      <p style={{ color: "var(--rg-text-dim)" }}>
        <span style={{ color: "var(--rg-orange)" }}>{">"}</span> SENSOR_02:{" "}
        <span style={{ color: "var(--rg-text)" }}>{String(sensor2).padStart(3, "0")}</span>
      </p>
      <p style={{ color: "var(--rg-text-dim)" }}>
        <span style={{ color: "var(--rg-orange)" }}>{">"}</span> MOTOR:{" "}
        <span style={{ color: "var(--rg-text)" }}>{rpm}RPM</span>
      </p>
      <p style={{ color: "var(--rg-text-dim)" }}>
        <span style={{ color: "var(--rg-orange)" }}>{">"}</span> STATUS:{" "}
        <span style={{ color: "var(--rg-green)" }}>
          OK{tick % 2 === 0 ? "" : "."}
        </span>
      </p>
    </div>
  );
}
