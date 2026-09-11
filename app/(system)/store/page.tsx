import BlackMarketButton from "@/components/BlackMarketButton";

export const metadata = { title: "BLACK MARKET // REDGHOST_OS" };

const CATEGORIES = [
  "SUDADERAS",
  "DROPS",
  "COLABS",
  "MERCH D.I.D",
  "PLANOS",
  "CIRCUITOS",
  "PIEZAS",
];

export default function StorePage() {
  return (
    <div className="min-h-[65vh] flex flex-col items-center justify-center text-center gap-2 px-4">
      <p
        className="text-[9px] tracking-[0.15em] mb-4"
        style={{ color: "var(--rg-danger)" }}
      >
        {"> ENCRYPTED ZONE // AUTHORIZED PERSONNEL ONLY"}
      </p>

      <h1
        className="rg-market-title text-3xl sm:text-5xl font-semibold tracking-[0.15em] sm:tracking-[0.2em]"
      >
        BLACK MARKET
      </h1>
      <p
        className="text-[10px] sm:text-xs tracking-[0.35em] rg-glow-purple"
        style={{ color: "var(--rg-purple)" }}
      >
        D.I.D COMMERCE NODE
      </p>

      <p className="rg-market-warning mt-6">
        <span className="rg-blink">⚠</span>&nbsp; ACCESO RESTRINGIDO — ZONA COMERCIAL &nbsp;<span className="rg-blink">⚠</span>
      </p>

      <div className="mt-6">
        <BlackMarketButton />
      </div>

      <p
        className="mt-8 text-[9px] sm:text-[10px] tracking-[0.25em] max-w-md"
        style={{ color: "var(--rg-purple)" }}
      >
        {CATEGORIES.join(" · ")}
      </p>

      <p
        className="mt-10 text-[8px] tracking-[0.2em]"
        style={{ color: "var(--rg-text-faint)" }}
      >
        ALL ITEMS // DESIGNED / BUILT / DISTRIBUTED BY REDGHOST
      </p>
    </div>
  );
}
