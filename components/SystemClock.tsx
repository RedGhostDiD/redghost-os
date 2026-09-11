"use client";

import { useEffect, useRef, useState } from "react";

const DAY = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTH = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function SystemClock() {
  const mountedAt = useRef<number | null>(null);
  const [now, setNow] = useState<Date | null>(null);
  const [uptimeMs, setUptimeMs] = useState(0);

  useEffect(() => {
    mountedAt.current = Date.now();
    const tick = () => {
      const n = Date.now();
      setNow(new Date(n));
      setUptimeMs(n - (mountedAt.current ?? n));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) return null;

  const upSeconds = Math.floor(uptimeMs / 1000);
  const upH = Math.floor(upSeconds / 3600);
  const upM = Math.floor((upSeconds % 3600) / 60);
  const upS = upSeconds % 60;

  return (
    <div className="flex items-center gap-4 text-[10px] tracking-[0.12em]" style={{ color: "var(--rg-text-faint)" }}>
      <span>
        {pad(now.getHours())}:{pad(now.getMinutes())}:{pad(now.getSeconds())}
      </span>
      <span>
        {DAY[now.getDay()]} // {pad(now.getDate())} {MONTH[now.getMonth()]} {now.getFullYear()}
      </span>
      <span>
        UPTIME {pad(upH)}H {pad(upM)}M {pad(upS)}S
      </span>
    </div>
  );
}
