const FORMULAS = [
  "F = ma",
  "V = IR",
  "P = VI",
  "τ = r × F",
  "ω = 2πf",
  "x̄ = Σx / n",
  "R = xmax - xmin",
];

const COLUMNS = [
  { left: "6%", duration: "40s", delay: "-4s" },
  { left: "36%", duration: "52s", delay: "-18s" },
  { left: "68%", duration: "46s", delay: "-10s" },
  { left: "90%", duration: "58s", delay: "-30s" },
];

/**
 * Faint drifting mechatronics/metrology formulas — a nod to the discipline
 * behind the DiD brand, not meant to be read closely.
 */
export default function FloatingFormulas() {
  const text = [...FORMULAS, ...FORMULAS].join("\n\n");

  return (
    <div className="rg-datastream" aria-hidden="true">
      {COLUMNS.map((col, i) => (
        <pre
          key={i}
          className="rg-datastream-col"
          style={{
            left: col.left,
            color: "var(--rg-text-faint)",
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
