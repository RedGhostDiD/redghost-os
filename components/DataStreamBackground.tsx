const LINES = [
  "0x4F2A SYNC_OK",
  "0x18B3 ROUTE_04",
  "0x991C PKT_LOSS0",
  "0xA210 NODE_UP",
  "0x552E CACHE_HIT",
  "0x0FA4 AUTH_OK",
  "0x77D1 TX_QUEUE3",
  "0x2C9B LINK_STAB",
];

const COLUMNS = [
  { left: "4%", duration: "26s", delay: "-4s" },
  { left: "22%", duration: "34s", delay: "-12s" },
  { left: "58%", duration: "29s", delay: "-8s" },
  { left: "78%", duration: "38s", delay: "-2s" },
  { left: "94%", duration: "31s", delay: "-18s" },
];

/** Decorative only — no live data. Scoped to the page that renders it. */
export default function DataStreamBackground() {
  const text = [...LINES, ...LINES].join("\n");

  return (
    <div className="rg-datastream" aria-hidden="true">
      {COLUMNS.map((col, i) => (
        <pre
          key={i}
          className="rg-datastream-col"
          style={{
            left: col.left,
            animationDuration: col.duration,
            animationDelay: col.delay,
          }}
        >
          {text}
        </pre>
      ))}
    </div>
  );
}
