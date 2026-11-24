"use client";

import { useEffect, useState } from "react";

/** Visitor's local time, e.g. "04:40:25 PM". Renders nothing until mounted. */
export default function LocalClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return <span suppressHydrationWarning>{time}</span>;
}
