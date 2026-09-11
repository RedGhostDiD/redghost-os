function randomBinaryBlock(rows: number): string {
  const lines: string[] = [];
  for (let i = 0; i < rows; i++) {
    const a = Math.round(Math.random() * 255).toString(2).padStart(8, "0");
    const b = Math.round(Math.random() * 255).toString(2).padStart(8, "0");
    lines.push(`${a} ${b}`);
  }
  return lines.join("\n");
}

const COLUMNS = [
  { left: "8%", duration: "48s", delay: "-6s" },
  { left: "30%", duration: "62s", delay: "-22s" },
  { left: "52%", duration: "55s", delay: "-14s" },
  { left: "71%", duration: "70s", delay: "-40s" },
  { left: "90%", duration: "58s", delay: "-30s" },
];

/**
 * Decorative only, "muy tenue" per spec: a near-invisible column of binary
 * scrolling behind every page. Never load-bearing, never above content.
 */
export default function BinaryRain() {
  return (
    <div className="rg-binary-rain" aria-hidden="true">
      {COLUMNS.map((col, i) => {
        const block = randomBinaryBlock(24);
        return (
          <pre
            key={i}
            className="rg-binary-rain-col"
            style={{
              left: col.left,
              animationDuration: col.duration,
              animationDelay: col.delay,
            }}
          >
            {block}
            {"\n"}
            {block}
          </pre>
        );
      })}
    </div>
  );
}
