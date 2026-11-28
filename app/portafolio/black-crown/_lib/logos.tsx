// Black Crown — three crown proposals. Proposal A is the chosen mark; B and C
// stay here for the case study. All use currentColor so they work on any background.

type P = { className?: string; title?: string };

/** A · Geometric crown: five points from one polygon, a solid band below. Chosen. */
export function CrownA({ className, title = "Black Crown" }: P) {
  return (
    <svg viewBox="0 0 64 48" className={className} role="img" aria-label={title} fill="currentColor">
      <path d="M0 6 L16 22 L32 0 L48 22 L64 6 L60 36 H4 Z" />
      <rect x="4" y="40" width="56" height="6" />
    </svg>
  );
}

/** B · Monogram: a crown outline crowning the BC initials. */
export function CrownB({ className, title = "Black Crown monograma" }: P) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label={title} fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M8 22 L20 32 L32 14 L44 32 L56 22 L52 46 H12 Z" strokeLinejoin="miter" />
      <text x="32" y="42" textAnchor="middle" fill="currentColor" stroke="none" fontSize="13" fontFamily="var(--bc-font-title), serif" letterSpacing="1">BC</text>
      <path d="M12 52 H52" />
    </svg>
  );
}

/** C · Street crown: three blades of different heights, like a clipper's teeth. */
export function CrownC({ className, title = "Black Crown corona urbana" }: P) {
  return (
    <svg viewBox="0 0 64 48" className={className} role="img" aria-label={title} fill="currentColor">
      <path d="M2 40 V18 L10 10 L18 18 V40 Z" />
      <path d="M24 40 V8 L32 0 L40 8 V40 Z" />
      <path d="M46 40 V18 L54 10 L62 18 V40 Z" />
      <rect x="2" y="43" width="60" height="5" />
    </svg>
  );
}

/** Full lockup: crown + BLACK CROWN + BARBER CLUB. */
export function Lockup({ className, stacked = false }: { className?: string; stacked?: boolean }) {
  return (
    <span className={`bc-lockup ${stacked ? "is-stacked" : ""} ${className ?? ""}`}>
      <CrownA className="bc-lockup-crown" title="" />
      <span className="bc-lockup-text">
        <span className="bc-lockup-name">BLACK CROWN</span>
        <span className="bc-lockup-sub">BARBER CLUB</span>
      </span>
    </span>
  );
}
