import Link from "next/link";
import Panel from "@/components/Panel";
import BreachProtocol from "@/components/breach/BreachProtocol";

export const metadata = { title: "BREACH PROTOCOL // REDGHOST_OS" };

export default function BreachProtocolPage() {
  return (
    <div className="flex flex-col gap-5">
      <Link
        href="/laboratorio"
        className="rg-nav-link text-[10px] tracking-[0.15em] text-[var(--rg-text-faint)]"
      >
        {"<"} BACK TO EXPERIMENTAL LAB
      </Link>

      <Panel id="EXP_001" title="Breach Protocol" status={{ label: "EXPERIMENTAL", tone: "orange" }}>
        <p className="text-xs text-[var(--rg-text-dim)] leading-relaxed mb-5">
          Minijuego de intrusión inspirado en el breach protocol de Night
          City. Selecciona códigos en la matriz — empieza en la fila
          superior, luego alterna entre misma columna y misma fila — para
          reconstruir la secuencia de cada daemon antes de que el tiempo se
          agote.
        </p>
        <BreachProtocol />
      </Panel>
    </div>
  );
}
