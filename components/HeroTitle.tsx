export default function HeroTitle() {
  return (
    <div className="text-center px-6">
      <h1 className="rg-neo-title text-5xl sm:text-7xl font-semibold tracking-[0.25em] sm:tracking-[0.3em]">
        REDGHOST
      </h1>
      <div className="rg-brand-rule mx-auto mt-5" />
      <p className="mt-5 text-xs sm:text-sm tracking-[0.35em] text-[var(--rg-text-faint)]">
        D.I.D // DRAW • INTEL • BUILD
      </p>
      <p className="mt-2 text-sm sm:text-base tracking-[0.15em] text-[var(--rg-text-dim)]">
        CREADOR DE <span className="text-[var(--rg-red-dim)]">DiD</span> — DIBUJO • INTELIGENCIA • DESARROLLO
      </p>
    </div>
  );
}
