import Panel from "@/components/Panel";

export const metadata = { title: "IDENTITY // REDGHOST_OS" };

export default function SobreMiPage() {
  return (
    <div className="flex flex-col gap-5">
      <Panel id="MOD_080" title="Identity File" status={{ label: "VERIFIED" }}>
        <h1 className="text-xl tracking-[0.2em] text-[var(--rg-red)] rg-glow-red mb-2">
          REDGHOST
        </h1>
        <p className="text-xs tracking-[0.3em] text-[var(--rg-text-dim)]">
          CREADOR DE <span className="text-[var(--rg-orange)]">DiD</span> — DIBUJO • INTELIGENCIA • DESARROLLO
        </p>
      </Panel>

      <Panel id="MOD_081" title="Perfil" delayMs={80}>
        <p className="text-sm text-[var(--rg-text-dim)] leading-relaxed">
          Placeholder — cuenta en un par de párrafos quién eres y qué haces:
          robótica, software, hardware, diseño. El tono puede ser directo y
          técnico, sin caer en el lenguaje de portafolio corporativo.
        </p>
      </Panel>

      <Panel id="MOD_082" title="Habilidades" delayMs={160}>
        <div className="flex flex-wrap gap-1.5">
          {["ROBOTICS", "ELECTRONICS", "SOFTWARE", "CAD", "PCB DESIGN", "AI/ML"].map((s) => (
            <span
              key={s}
              className="text-[9px] tracking-[0.1em] px-1.5 py-0.5 border"
              style={{ borderColor: "var(--rg-red-line)", color: "var(--rg-text-dim)" }}
            >
              {s}
            </span>
          ))}
        </div>
      </Panel>

      <Panel id="MOD_083" title="Formación" delayMs={240}>
        <p className="text-sm text-[var(--rg-text-dim)] leading-relaxed">
          Placeholder — educación formal, cursos, certificaciones o
          autoaprendizaje relevante.
        </p>
      </Panel>

      <Panel id="MOD_084" title="Filosofía" delayMs={320}>
        <p className="text-sm text-[var(--rg-text-dim)] leading-relaxed">
          Placeholder — tu forma de entender el crear, aprender y desarrollar.
          Esta sección es la más personal del sistema.
        </p>
      </Panel>
    </div>
  );
}
