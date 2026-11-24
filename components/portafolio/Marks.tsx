/**
 * Small technical marks used across /portafolio (crosshairs, chevrons,
 * barcode…) plus the RedGhost ghost glyph. All inherit currentColor.
 */

type P = { className?: string; size?: number };

/** RedGhost glyph: a ghost outline with a zig-zag hem and two block eyes. */
export function GhostMark({ className, eyes = "var(--pf-red)" }: { className?: string; eyes?: string }) {
  return (
    <svg viewBox="0 0 120 140" className={className} fill="none" aria-hidden="true">
      <path
        d="M14 132V60a46 46 0 0 1 92 0v72l-15-14-15.5 14L60 118l-15.5 14L29 118z"
        stroke="currentColor"
        strokeWidth="11"
        strokeLinejoin="miter"
      />
      <rect x="37" y="52" width="13" height="26" fill={eyes} />
      <rect x="70" y="52" width="13" height="26" fill={eyes} />
    </svg>
  );
}

export function Crosshair({ className, size = 76 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 76 76" className={className} aria-hidden="true">
      <path d="M38 0v76M0 38h76" stroke="currentColor" strokeWidth="1.2" />
      <rect x="34" y="34" width="8" height="8" fill="currentColor" />
    </svg>
  );
}

export function TargetMark({ className, size = 76 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 76 76" className={className} fill="none" aria-hidden="true">
      <circle cx="38" cy="38" r="26" stroke="currentColor" strokeWidth="1.2" />
      <path d="M38 0v76M0 38h76" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function PlusThin({ className, size = 32 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path d="M16 2v28M2 16h28" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function Chevrons({ className }: P) {
  return (
    <svg width="54" height="20" viewBox="0 0 54 20" className={className} fill="none" aria-hidden="true">
      <path d="M2 3l7 7-7 7M10 3l7 7-7 7" stroke="currentColor" strokeWidth="3" />
      <path d="M34 3l7 7-7 7M42 3l7 7-7 7" stroke="currentColor" strokeWidth="3" opacity="0.3" />
    </svg>
  );
}

/** Stacked horizontal lines with a block in the middle. */
export function StackIcon({ className }: P) {
  return (
    <svg width="40" height="22" viewBox="0 0 40 22" className={className} aria-hidden="true">
      <path d="M0 3h40M0 11h40M0 19h40" stroke="currentColor" strokeWidth="2.4" />
      <rect x="9" y="6" width="22" height="10" rx="2" fill="currentColor" />
    </svg>
  );
}

export function BaselineIcon({ className }: P) {
  return (
    <svg width="40" height="22" viewBox="0 0 40 22" className={className} aria-hidden="true">
      <path d="M0 14h40M20 4v16M0 20h40" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function ArrowUpRight({ className, size = 22 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" className={className} fill="none" aria-hidden="true">
      <path d="M5 17L17 5M7 5h10v10" stroke="currentColor" strokeWidth="2.6" />
    </svg>
  );
}

export function ArrowRight({ className, size = 22 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" className={className} fill="none" aria-hidden="true">
      <path d="M2 11h17M12 4l7 7-7 7" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function CrossX({ className, size = 22 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" className={className} aria-hidden="true">
      <path d="M3 3l16 16M19 3L3 19" stroke="currentColor" strokeWidth="3.2" />
      <rect x="8" y="8" width="6" height="6" fill="currentColor" transform="rotate(45 11 11)" />
    </svg>
  );
}

export function SquareDot({ className, size = 22 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" className={className} fill="none" aria-hidden="true">
      <rect x="2" y="2" width="18" height="18" stroke="currentColor" strokeWidth="1.6" />
      <rect x="9.5" y="9.5" width="3" height="3" fill="currentColor" />
    </svg>
  );
}

export function PixelStairs({ className, size = 30 }: P) {
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 30 18" className={className} aria-hidden="true">
      <path d="M0 12h6v6H0zM6 6h6v6H6zM12 0h6v6h-6zM18 6h6v6h-6zM24 12h6v6h-6zM12 12h6v6h-6z" fill="currentColor" />
    </svg>
  );
}

/** Vertical barcode with a rotated code label. */
export function Barcode({ className, code }: P & { code: string }) {
  const bars = [3, 1, 2, 1, 4, 1, 1, 2, 3, 1, 2, 2, 1, 4, 1, 2, 1, 3, 1, 1, 2, 4, 1, 2];
  let y = 0;
  return (
    <div className={`pf-barcode ${className ?? ""}`} aria-hidden="true">
      <svg width="64" height="170" viewBox="0 0 64 170">
        {bars.map((h, i) => {
          const rect = i % 2 === 0 ? <rect key={i} x="0" y={y} width="64" height={h * 2.4} fill="currentColor" /> : null;
          y += h * 2.4 + 1.6;
          return rect;
        })}
      </svg>
      <span>{code}</span>
    </div>
  );
}

/** Small L-shaped corner bracket; rotate with the `corner` prop. */
export function Corner({ corner = "tl", className }: { corner?: "tl" | "tr" | "bl" | "br"; className?: string }) {
  const rot = { tl: 0, tr: 90, br: 180, bl: 270 }[corner];
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" className={className} style={{ transform: `rotate(${rot}deg)` }} aria-hidden="true">
      <path d="M1 14V1h13" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
