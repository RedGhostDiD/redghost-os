export default function GlitchText({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <svg
        viewBox="0 0 24 24"
        className="w-3 h-3 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ color: "var(--rg-orange)", filter: "drop-shadow(0 0 5px rgba(255,138,43,0.7))" }}
      >
        <path d="M12 3l9 16H3z" />
        <path d="M12 10v4" />
        <circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none" />
      </svg>
      <span className="rg-glitch" data-text={text}>
        {text}
      </span>
    </span>
  );
}
