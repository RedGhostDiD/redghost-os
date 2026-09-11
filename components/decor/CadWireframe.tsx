/**
 * Faint mechanical wireframe with a couple of CAD-style callouts, tucked
 * into a corner as flavor. Doesn't represent a real part.
 */
export default function CadWireframe() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 220 160"
      className="pointer-events-none absolute right-2 top-10 w-32 sm:w-44 opacity-[0.14]"
      style={{ color: "var(--rg-orange)" }}
    >
      <g fill="none" stroke="currentColor" strokeWidth="0.75">
        <rect x="30" y="20" width="120" height="80" rx="4" />
        <circle cx="90" cy="60" r="26" />
        <circle cx="90" cy="60" r="6" />
        <line x1="30" y1="60" x2="10" y2="60" />
        <line x1="150" y1="60" x2="170" y2="60" />
        <line x1="90" y1="20" x2="90" y2="6" />
        <line x1="90" y1="100" x2="90" y2="118" />
        <path d="M150 40 L190 40 L190 130 L60 130 L60 100" strokeDasharray="2 3" />
      </g>
      <text x="94" y="58" fontSize="7" fill="currentColor">Ø24</text>
      <text x="12" y="118" fontSize="7" fill="currentColor">R3</text>
      <text x="150" y="140" fontSize="7" fill="currentColor">45°</text>
      <text x="8" y="14" fontSize="7" fill="currentColor">REV 03</text>
    </svg>
  );
}
