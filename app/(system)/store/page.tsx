import Panel from "@/components/Panel";
import { STORE_ITEMS } from "@/lib/store";

export const metadata = { title: "STORE // REDGHOST_OS" };

export default function StorePage() {
  return (
    <div className="flex flex-col gap-5">
      <Panel id="MOD_070" title="RedGhost Store" status={{ label: "AVAILABLE" }}>
        <h2 className="text-sm tracking-[0.2em] text-[var(--rg-red)] rg-glow-red mb-2">
          DIGITAL ASSETS
        </h2>
        <p className="text-xs text-[var(--rg-text-dim)] leading-relaxed">
          SVG, PCB, archivos KiCad, modelos y diseños de robots. Catálogo
          visual — el checkout se activa en una siguiente fase.
        </p>
      </Panel>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {STORE_ITEMS.map((item, i) => (
          <Panel
            key={item.code}
            id={item.code}
            title={item.type}
            status={{ label: "SOON", tone: "orange" }}
            delayMs={220 + i * 130}
          >
            <h3 className="text-sm tracking-[0.15em] text-[var(--rg-text)] mb-3">
              {item.name}
            </h3>
            <span
              className="inline-block text-[10px] tracking-[0.15em] border px-3 py-1.5"
              style={{
                borderColor: "var(--rg-red-line)",
                color: "var(--rg-text-faint)",
              }}
            >
              [ COMING SOON ]
            </span>
          </Panel>
        ))}
      </div>
    </div>
  );
}
