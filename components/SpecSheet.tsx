export default function SpecSheet({ specs }: { specs: [string, string][] }) {
  return (
    <dl className="text-[10px] tracking-[0.1em] space-y-1">
      {specs.map(([label, value]) => (
        <div key={label} className="flex items-baseline gap-2">
          <dt style={{ color: "var(--rg-text-faint)" }}>{label}</dt>
          <span
            aria-hidden="true"
            className="flex-1 border-b border-dotted"
            style={{ borderColor: "var(--rg-text-faint)", opacity: 0.4, transform: "translateY(-3px)" }}
          />
          <dd style={{ color: "var(--rg-text)" }}>{value}</dd>
        </div>
      ))}
    </dl>
  );
}
