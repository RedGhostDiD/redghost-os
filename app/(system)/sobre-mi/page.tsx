import Panel from "@/components/Panel";
import SkillBar from "@/components/SkillBar";
import { SKILLS } from "@/lib/skills";

export const metadata = { title: "IDENTITY // REDGHOST_OS" };

const WHAT_I_BUILD = [
  "Robots",
  "Sistemas electrónicos",
  "Software",
  "PCBs",
  "Prototipos",
  "Diseños y modelos",
  "Proyectos experimentales",
  "Prótesis y tecnología de asistencia",
  "Y eventualmente, una marca que sea reconocible por sí misma",
];

const FORMATION_TECHNICAL = [
  "Preparatoria técnica en Programación",
  "Técnico en Programación",
  "Ingeniería en Mecatrónica",
  "Robótica",
  "Electrónica",
  "Python",
  "C#",
  "C++",
  "CAD",
  "KiCad / diseño de PCB",
  "Reparación de PC",
  "Mecánica automotriz",
];

const FORMATION_SELF_TAUGHT = [
  "Música",
  "Dibujo",
  "Todo aquello que haya terminado necesitando para construir algo",
];

const CURRENT_SYSTEM: [string, string][] = [
  ["IDENTITY", "REDGHOST"],
  ["D.I.D", "DIBUJO / INTELIGENCIA / DESARROLLO"],
  ["SPECIALTY", "MECHATRONICS / ROBOTICS / SOFTWARE"],
  ["PROJECTS", "20+"],
  ["BUDGET", "QUESTIONABLE"],
  ["SLEEP SCHEDULE", "ALSO QUESTIONABLE"],
  ["STATUS", "BUILDING"],
];

const DID_PIPELINE = ["IDEA", "DIBUJO", "INTELIGENCIA", "DESARROLLO", "RESULTADO"];

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
        <p className="mt-3 text-[10px] tracking-[0.15em]" style={{ color: "var(--rg-text-faint)" }}>
          ROBOTICS // SOFTWARE // ELECTRONICS // DESIGN — 20+ PROJECTS // 0 PRESUPUESTO // DEMASIADAS IDEAS
        </p>
      </Panel>

      <Panel id="MOD_081" title="¿Quién es RedGhost?" delayMs={80}>
        <div className="space-y-3 text-sm text-[var(--rg-text-dim)] leading-relaxed">
          <p>Soy RedGhost.</p>
          <p>
            <strong style={{ color: "var(--rg-text)" }}>Rojo</strong>, para que los malos no me vean sangrar.{" "}
            <strong style={{ color: "var(--rg-text)" }}>Ghost</strong>, porque normalmente ni me verías en la
            calle si no fuera porque parezco cono de tránsito con la sudadera roja.
          </p>
          <p>
            Soy un wey con más de 20 proyectos, presupuesto cuestionable y una obsesión bastante seria con
            construir cosas.
          </p>
          <p>
            Robots, software, electrónica, diseño, experimentos y cualquier cosa que parezca suficientemente
            complicada como para hacerme perder horas tratando de descubrir por qué dejó de funcionar.
          </p>
          <p>También tengo una obsesión con Wagurimeow.</p>
          <p
            className="text-[10px] tracking-[0.15em] pl-3 border-l"
            style={{ color: "var(--rg-red-soft)", borderColor: "var(--rg-red-line)" }}
          >
            {"> "}BRO.
            <br />
            {"> "}SOLO MÍRALA.
            <br />
            {"> "}ES WAGURY PERO EN GATO.
          </p>
        </div>
      </Panel>

      <Panel id="MOD_082" title="Qué construyo" delayMs={160}>
        <ul className="space-y-1 text-sm text-[var(--rg-text-dim)]">
          {WHAT_I_BUILD.map((item) => (
            <li key={item}>+ {item}</li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-[var(--rg-text-dim)] leading-relaxed">
          La idea no es solamente hacer proyectos. Es aprender lo suficiente para poder hacer cosas que antes
          no podía hacer.
        </p>
      </Panel>

      <Panel id="MOD_083" title="El objetivo" delayMs={240}>
        <p className="text-sm mb-3" style={{ color: "var(--rg-red-soft)" }}>
          El vato al que llaman cuando todo vale madre con una máquina.
        </p>
        <div className="space-y-3 text-sm text-[var(--rg-text-dim)] leading-relaxed">
          <p>No quiero ser solamente alguien que sabe utilizar una herramienta.</p>
          <p>
            Quiero ser el tipo que recibe una máquina que dejó de funcionar, la abre, encuentra el problema y
            entiende por qué carajos ocurrió.
          </p>
          <p>Si hace falta aprender electrónica, aprendo electrónica.</p>
          <p>Si hace falta programar, programo.</p>
          <p>Si hace falta diseñar una pieza, la diseño.</p>
          <p>Si hace falta desmontar media máquina para encontrar una falla de 20 pesos, pues aparentemente eso toca.</p>
        </div>
      </Panel>

      <Panel id="MOD_084" title="Formación" delayMs={320}>
        <p className="text-[10px] tracking-[0.15em] mb-2" style={{ color: "var(--rg-text-faint)" }}>
          TECHNICAL
        </p>
        <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-0.5 text-sm text-[var(--rg-text-dim)] mb-5">
          {FORMATION_TECHNICAL.map((item) => (
            <li key={item}>+ {item}</li>
          ))}
        </ul>
        <p className="text-[10px] tracking-[0.15em] mb-2" style={{ color: "var(--rg-text-faint)" }}>
          SELF-TAUGHT
        </p>
        <ul className="space-y-0.5 text-sm text-[var(--rg-text-dim)]">
          {FORMATION_SELF_TAUGHT.map((item) => (
            <li key={item}>+ {item}</li>
          ))}
        </ul>
      </Panel>

      <Panel id="MOD_085" title="Cómo pienso" delayMs={400}>
        <div className="space-y-5 text-sm text-[var(--rg-text-dim)] leading-relaxed">
          <div>
            <p className="text-xs tracking-[0.1em] mb-1.5" style={{ color: "var(--rg-red)" }}>
              ¿POR QUÉ CONSTRUYO COSAS?
            </p>
            <p>Porque quiero cambiar el mundo con el presupuesto de un Gansito.</p>
            <p style={{ color: "var(--rg-text)" }}>Pero está congelado.</p>
            <p>
              Así que toca improvisar. No siempre tengo las herramientas, el dinero o los materiales ideales.
              Eso no significa que el proyecto se detenga. Significa que toca encontrar otra forma.
            </p>
          </div>
          <div>
            <p className="text-xs tracking-[0.1em] mb-1.5" style={{ color: "var(--rg-red)" }}>
              ¿QUÉ HAGO CUANDO ALGO FALLA?
            </p>
            <p>Le digo a la falla que chingue a su madre.</p>
            <p>Después la busco. O ella me encuentra a mí.</p>
            <p>
              Un proyecto que funciona está bien. Un proyecto que falla y me permite entender exactamente por
              qué falló también sirve. Prefiero saber que algo salió mal y entender la razón antes que fingir
              que funcionó.
            </p>
            <p>Y si me dicen que no hay tiempo... pues hago lo que pueda hasta que se acabe completamente.</p>
          </div>
          <div>
            <p className="text-xs tracking-[0.1em] mb-1.5" style={{ color: "var(--rg-red)" }}>
              ¿QUÉ SIGNIFICA APRENDER?
            </p>
            <p>No significa repetir la frase que escribió un libro.</p>
            <p>Significa entender qué estás haciendo. Y después poder utilizar ese conocimiento para crear algo que antes no podías crear.</p>
            <p className="tracking-[0.1em]" style={{ color: "var(--rg-text)" }}>
              ENTENDER → EXPERIMENTAR → CONSTRUIR → FALLAR → CORREGIR → REPETIR.
            </p>
          </div>
        </div>
      </Panel>

      <Panel id="MOD_086" title="RedGhost Principle" delayMs={480}>
        <div className="space-y-3 text-sm text-[var(--rg-text-dim)] leading-relaxed">
          <p style={{ color: "var(--rg-text)" }}>Libertad de expresión.</p>
          <p>Creatividad.</p>
          <p>
            Poder decir una mamada si quiero decir una mamada. Pero también tener la capacidad de reconocer
            cuando esa mamada estaba mal.
          </p>
          <p>
            RedGhost representa construir cosas nuevas, experimentar sin esperar condiciones perfectas y
            aprender de los errores en lugar de esconderlos.
          </p>
          <p>No necesito que todo salga bien. Necesito poder seguir construyendo.</p>
        </div>
      </Panel>

      <Panel id="MOD_087" title="Skills" delayMs={560}>
        <div className="flex flex-col gap-2">
          {SKILLS.map((skill) => (
            <SkillBar key={skill.label} skill={skill} />
          ))}
        </div>
        <p className="mt-4 text-[9px] tracking-[0.15em]" style={{ color: "var(--rg-text-faint)" }}>
          SKILL LEVELS ARE NOT FINAL VALUES. THEY CHANGE WHEN I BUILD SOMETHING THAT PROVES THEY SHOULD.
        </p>
      </Panel>

      <Panel id="MOD_088" title="Current System" delayMs={640}>
        <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-[10px] tracking-[0.1em]">
          {CURRENT_SYSTEM.map(([label, value]) => (
            <div key={label} className="flex items-baseline justify-between gap-2">
              <dt style={{ color: "var(--rg-text-faint)" }}>{label}</dt>
              <dd style={{ color: "var(--rg-text)" }}>{value}</dd>
            </div>
          ))}
        </dl>
      </Panel>

      <Panel id="MOD_089" title="D.I.D" delayMs={720}>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2 text-sm text-[var(--rg-text-dim)] leading-relaxed">
            <p>
              <span style={{ color: "var(--rg-red)" }}>DIBUJO</span> para imaginar y diseñar.
            </p>
            <p>
              <span style={{ color: "var(--rg-orange)" }}>INTELIGENCIA</span> para entender, investigar y
              resolver.
            </p>
            <p>
              <span style={{ color: "var(--rg-green)" }}>DESARROLLO</span> para convertir una idea en algo
              real.
            </p>
            <p className="pt-2">
              No se trata solamente de tener ideas. Se trata de llevarlas desde la cabeza hasta el mundo
              físico o digital.
            </p>
          </div>
          <div className="text-xs tracking-[0.15em]" style={{ color: "var(--rg-text-dim)" }}>
            {DID_PIPELINE.map((step, i) => (
              <div key={step}>
                <p style={{ color: i === DID_PIPELINE.length - 1 ? "var(--rg-green)" : "var(--rg-text)" }}>
                  {step}
                </p>
                {i < DID_PIPELINE.length - 1 && (
                  <p style={{ color: "var(--rg-text-faint)" }}>↓</p>
                )}
              </div>
            ))}
          </div>
        </div>
        <div
          className="mt-5 pt-4 border-t space-y-1 text-sm"
          style={{ borderColor: "var(--rg-red-line-soft)", color: "var(--rg-text-dim)" }}
        >
          <p>Si puedo imaginarlo, puedo intentar construirlo.</p>
          <p>Si falla, puedo descubrir por qué.</p>
          <p>Si entiendo por qué falló, puedo hacerlo mejor.</p>
        </div>
      </Panel>
    </div>
  );
}
