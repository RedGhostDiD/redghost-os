import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BASE, FOTOS, SERVICIOS, TODAS_LAS_FOTOS, precio } from "../_lib/data";
import { CrownA, CrownB, CrownC, Lockup } from "../_lib/logos";

export const metadata: Metadata = {
  title: "Caso de estudio — Branding y web",
  description: "Proyecto RG-001 de RedGhost: marca, manual de identidad, wireframes y sitio con reservaciones para Black Crown Barber Club, un cliente ficticio.",
};

const BRIEF = [
  ["Nombre", "Black Crown Barber Club"],
  ["Industria", "Barbería"],
  ["Servicios", "Cortes, barba, cejas y tratamientos"],
  ["Público", "Hombres de 18 a 40 años"],
  ["Nivel de mercado", "Medio-premium"],
  ["Diferenciador", "Atención personalizada y reservaciones"],
  ["Competencia", "Barberías tradicionales y modernas"],
  ["Objetivo digital", "Conseguir clientes y reservaciones"],
];

const PERSONALIDAD = [
  ["Elegante", "sin parecer una peluquería anticuada."],
  ["Urbana", "con influencias de la cultura streetwear."],
  ["Segura", "transmite profesionalismo."],
  ["Minimalista", "pocos elementos, bien utilizados."],
  ["Exclusiva", "experiencia cuidada, sin pretender ser inaccesible."],
];

const PALETA = [
  { n: "Negro", hex: "#101010", uso: "Fondo principal" },
  { n: "Dorado", hex: "#C5A46D", uso: "Acciones y acentos" },
  { n: "Marfil", hex: "#F0EDE7", uso: "Texto y fondos claros" },
  { n: "Gris", hex: "#555555", uso: "Texto secundario y líneas" },
];

const MAPA = [
  { r: "/", n: "Inicio", d: "Presentación, eslogan y botón de reservación" },
  { r: "/servicios", n: "Servicios", d: "Catálogo con descripciones y precios" },
  { r: "/galeria", n: "Galería", d: "Fotografías de trabajos realizados" },
  { r: "/nosotros", n: "Nosotros", d: "Historia, equipo y filosofía" },
  { r: "/contacto", n: "Contacto", d: "Dirección, horarios, WhatsApp y mapa" },
  { r: "/reservaciones", n: "Reservaciones", d: "Servicio, barbero, fecha y horario" },
];

const OBJETIVOS = [
  ["Reservaciones", "Conseguir citas por internet", "Reserva en 4 pasos; solo se muestran horarios libres"],
  ["WhatsApp", "Facilitar contacto", "Botón en contacto y confirmación con el mensaje ya escrito"],
  ["Catálogo", "Mostrar servicios y precios", "Página de servicios; cada uno enlaza a reservar con ese servicio elegido"],
  ["Galería", "Mostrar calidad del trabajo", "Galería en mosaico con fotos de cortes y barbas"],
  ["SEO local", "Aparecer en búsquedas locales", "Títulos por página, datos estructurados BarberShop con dirección y horario en Tepic"],
  ["Móvil", "Facilitar reservas desde celular", "Diseño responsive; selectores grandes para el dedo"],
];

const ENTREGABLES = [
  ["Tres propuestas de logotipo", true],
  ["Propuesta elegida y justificada", true],
  ["Manual básico de identidad", true],
  ["Moodboard / estilo fotográfico", true],
  ["Mapa del sitio", true],
  ["Wireframes de escritorio y móvil", true],
  ["Sitio web desarrollado", true],
  ["Sistema de reservaciones (simulado)", true],
  ["Panel administrativo (demo)", true],
] as const;

export default function Caso() {
  return (
    <div className="bc-cs">
      {/* ---------- portada ---------- */}
      <header className="bc-cs-hero">
        <div className="bc-cs-hero-top">
          <Link href="/portafolio" className="bc-link">← Portafolio</Link>
          <span className="bc-label">Proyecto RG-001 · Cliente ficticio</span>
        </div>
        <Lockup stacked className="bc-cs-lockup" />
        <p className="bc-cs-claim">Tu estilo. Tus reglas.</p>
        <dl className="bc-cs-facts">
          <div><dt>Servicio</dt><dd>Branding + Web</dd></div>
          <div><dt>Ubicación</dt><dd>Tepic, Nayarit, México</dd></div>
          <div><dt>Concepto</dt><dd>Barbería urbana premium</dd></div>
          <div><dt>Objetivo</dt><dd>Marca reconocible y reservaciones en línea</dd></div>
        </dl>
        <div className="bc-actions">
          <Link href={BASE} className="bc-btn bc-btn-gold">Ver el sitio</Link>
          <Link href={`${BASE}/reservaciones`} className="bc-btn bc-btn-line">Probar una reserva</Link>
          <Link href={`${BASE}/admin`} className="bc-btn bc-btn-line">Panel admin</Link>
        </div>
      </header>

      {/* ---------- 01 brief ---------- */}
      <section className="bc-cs-sec">
        <p className="bc-cs-num">01</p>
        <div>
          <h2 className="bc-h2">Brief del negocio</h2>
          <dl className="bc-cs-table">
            {BRIEF.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>
        </div>
      </section>

      {/* ---------- 02 personalidad ---------- */}
      <section className="bc-cs-sec">
        <p className="bc-cs-num">02</p>
        <div>
          <h2 className="bc-h2">Personalidad de marca</h2>
          <ul className="bc-cs-traits">
            {PERSONALIDAD.map(([t, d]) => <li key={t}><strong>{t}</strong> {d}</li>)}
          </ul>
          <p className="bc-cs-note">No debe parecer una barbería de barrio improvisada ni una franquicia corporativa.</p>
        </div>
      </section>

      {/* ---------- 03 logotipo ---------- */}
      <section className="bc-cs-sec">
        <p className="bc-cs-num">03</p>
        <div>
          <h2 className="bc-h2">Tres propuestas de logotipo</h2>
          <div className="bc-cs-logos">
            <figure className="is-chosen">
              <div className="bc-cs-logo-box"><CrownA className="bc-cs-logo" /></div>
              <figcaption><strong>A · Corona geométrica</strong> Un solo polígono de cinco puntas y una banda sólida. <span className="bc-gold">Elegida</span></figcaption>
            </figure>
            <figure>
              <div className="bc-cs-logo-box"><CrownB className="bc-cs-logo" /></div>
              <figcaption><strong>B · Monograma</strong> Corona en línea fina que corona las iniciales BC.</figcaption>
            </figure>
            <figure>
              <div className="bc-cs-logo-box"><CrownC className="bc-cs-logo" /></div>
              <figcaption><strong>C · Corona urbana</strong> Tres cuchillas de distinta altura, como los dientes de una máquina.</figcaption>
            </figure>
          </div>
          <div className="bc-cs-why">
            <h3>Por qué la A</h3>
            <ul>
              <li><strong>Es la que pide el brief:</strong> una corona geométrica y minimalista, reconocible sin el nombre al lado.</li>
              <li><strong>Funciona en pequeño:</strong> al ser una sola forma rellena, se lee igual como favicon de 16 px, en un sello o bordada en una capa.</li>
              <li><strong>Equilibra las dos caras de la marca:</strong> la simetría y la banda le dan lo elegante; los ángulos rectos y sin adornos, lo urbano.</li>
              <li><strong>B</strong> depende de las letras y la línea fina se pierde en tamaños pequeños. <strong>C</strong> es la más callejera, pero se aleja de la elegancia y puede leerse como un edificio.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- 04 manual ---------- */}
      <section className="bc-cs-sec">
        <p className="bc-cs-num">04</p>
        <div>
          <h2 className="bc-h2">Manual básico de identidad</h2>

          <h3 className="bc-cs-h3">Versiones del logotipo</h3>
          <div className="bc-cs-versions">
            <div className="v-dark"><Lockup /></div>
            <div className="v-light"><Lockup /></div>
            <div className="v-gold"><Lockup /></div>
            <div className="v-dark"><Lockup stacked /></div>
          </div>

          <div className="bc-cs-rules">
            <div>
              <h3 className="bc-cs-h3">Área de protección</h3>
              <div className="bc-cs-clear"><CrownA className="bc-cs-clear-logo" /></div>
              <p className="bc-dim">Deja libre alrededor del logo al menos la altura de la banda de la corona × 2. Ningún texto o borde entra en esa zona.</p>
            </div>
            <div>
              <h3 className="bc-cs-h3">Tamaño mínimo</h3>
              <div className="bc-cs-sizes">
                <CrownA className="s-48" /><CrownA className="s-32" /><CrownA className="s-16" />
              </div>
              <p className="bc-dim">Corona sola: 16 px en pantalla, 5 mm impresa. Logotipo completo: 120 px de ancho.</p>
            </div>
          </div>

          <h3 className="bc-cs-h3">Paleta de colores</h3>
          <div className="bc-cs-palette">
            {PALETA.map((c) => (
              <div key={c.hex}>
                <span className="bc-cs-swatch" style={{ background: c.hex }} />
                <strong>{c.n}</strong>
                <code>{c.hex}</code>
                <span className="bc-dim">{c.uso}</span>
              </div>
            ))}
          </div>
          <p className="bc-dim">Proporción: 70 % negro, 20 % marfil, 8 % gris, 2 % dorado. El dorado solo marca lo importante: si todo es dorado, nada lo es.</p>

          <h3 className="bc-cs-h3">Tipografías</h3>
          <div className="bc-cs-type">
            <div><span className="bc-label">Títulos · Cinzel</span><p className="t-title">Tu estilo. Tus reglas.</p></div>
            <div><span className="bc-label">Subtítulos · Montserrat</span><p className="t-sub">Barber Club · Est. 2024</p></div>
            <div><span className="bc-label">Texto · Inter</span><p className="t-text">En Black Crown combinamos técnica, precisión y estilo para crear una imagen que represente quién eres.</p></div>
          </div>

          <h3 className="bc-cs-h3">Estilo fotográfico</h3>
          <div className="bc-cs-mood">
            {[FOTOS.galeria[1], FOTOS.herramientas[0], FOTOS.galeria[3], FOTOS.interior[0], FOTOS.galeria[0]].map((f) => (
              <figure key={f.src}><Image src={f.src} alt={f.alt} fill sizes="20vw" /></figure>
            ))}
          </div>
          <p className="bc-dim">Iluminación contrastada, fondos oscuros, primeros planos de cortes y herramientas. Nada de fotos de stock sonrientes ni fondos blancos.</p>

          <div className="bc-cs-dodont">
            <div>
              <h3 className="bc-cs-h3">Sí</h3>
              <ul><li>Logo dorado o marfil sobre negro</li><li>Mucho espacio negro alrededor</li><li>Dorado solo en botones y acentos</li></ul>
            </div>
            <div>
              <h3 className="bc-cs-h3">No</h3>
              <ul><li>Deformar, rotar o delinear la corona</li><li>Logo sobre fotos sin oscurecerlas</li><li>Agregar sombras, degradados o brillos</li></ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- 05 mapa ---------- */}
      <section className="bc-cs-sec">
        <p className="bc-cs-num">05</p>
        <div>
          <h2 className="bc-h2">Mapa del sitio</h2>
          <div className="bc-cs-map">
            <div className="bc-cs-map-root"><CrownA className="bc-cs-map-crown" /> Inicio <code>/</code></div>
            <div className="bc-cs-map-kids">
              {MAPA.slice(1).map((m) => (
                <div key={m.r} className={m.r === "/reservaciones" ? "is-gold" : undefined}>
                  <strong>{m.n}</strong>
                  <code>{m.r}</code>
                  <span>{m.d}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="bc-dim">Reservaciones se alcanza desde todas las páginas: es la meta del sitio.</p>
        </div>
      </section>

      {/* ---------- 06 wireframes ---------- */}
      <section className="bc-cs-sec">
        <p className="bc-cs-num">06</p>
        <div>
          <h2 className="bc-h2">Wireframes</h2>
          <div className="bc-cs-wires">
            <figure>
              <div className="wf wf-desk" aria-hidden="true">
                <div className="wf-nav"><i className="wf-logo" /><i /><i /><i /><b /></div>
                <div className="wf-hero"><span>Fotografía principal</span><i className="wf-t1" /><i className="wf-t2" /><b /></div>
                <div className="wf-cards"><i /><i /><i /><i /></div>
                <div className="wf-strip"><i /><i /><i /><i /></div>
                <div className="wf-cta"><i className="wf-t2" /><b /></div>
                <div className="wf-foot"><i /><i /><i /><i /></div>
              </div>
              <figcaption>Escritorio · 1440 px</figcaption>
            </figure>
            <figure>
              <div className="wf wf-mob" aria-hidden="true">
                <div className="wf-nav"><i className="wf-logo" /><em /></div>
                <div className="wf-hero"><span>Foto</span><i className="wf-t1" /><b /></div>
                <div className="wf-cards"><i /><i /></div>
                <div className="wf-strip"><i /><i /></div>
                <div className="wf-cta"><b /></div>
              </div>
              <figcaption>Móvil · 375 px</figcaption>
            </figure>
          </div>
          <p className="bc-dim">El orden de la página principal sigue el wireframe del brief: navegación, eslogan con foto y botón de reserva, servicios, trabajos, llamado final y pie.</p>
        </div>
      </section>

      {/* ---------- 07 cliente ideal ---------- */}
      <section className="bc-cs-sec">
        <p className="bc-cs-num">07</p>
        <div>
          <h2 className="bc-h2">Cliente ideal</h2>
          <div className="bc-cs-persona">
            <div className="bc-cs-avatar">C</div>
            <div>
              <h3>Carlos, 25 años</h3>
              <p className="bc-dim">Cliente ficticio representativo</p>
              <ul className="bc-checks">
                <li>Trabaja y estudia</li><li>Usa Instagram</li><li>Busca cortes modernos</li>
                <li>Prefiere reservar antes de llegar</li><li>Valora la puntualidad</li><li>Paga por un buen servicio</li>
              </ul>
              <p className="bc-cs-note">Para Carlos se diseñó la reserva: desde el celular, sin crear cuenta y en menos de un minuto.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- 08 desarrollo ---------- */}
      <section className="bc-cs-sec">
        <p className="bc-cs-num">08</p>
        <div>
          <h2 className="bc-h2">Desarrollo</h2>
          <div className="bc-cs-table-wrap">
            <table className="bc-table">
              <thead><tr><th>Objetivo</th><th>Meta</th><th>Cómo lo resuelve el sitio</th></tr></thead>
              <tbody>{OBJETIVOS.map(([a, b, c]) => <tr key={a}><td>{a}</td><td className="bc-dim">{b}</td><td>{c}</td></tr>)}</tbody>
            </table>
          </div>
          <div className="bc-cs-tech">
            <div>
              <h3 className="bc-cs-h3">Hecho con</h3>
              <p>Next.js 16 y React 19 · CSS propio con las variables de la marca · Fuentes Cinzel, Montserrat e Inter · Datos estructurados para SEO local · Mapa de Google</p>
            </div>
            <div>
              <h3 className="bc-cs-h3">Reservaciones sin duplicados</h3>
              <p>
                Cada cita ocupa un rango de minutos de un barbero. Solo se ofrecen horas donde ese rango está libre, y al
                confirmar se vuelve a comprobar con los datos más recientes: si alguien tomó el horario un segundo antes, la
                reserva se rechaza y se pide otra hora. En esta demo los datos viven en el navegador; en producción la misma
                regla va en la base de datos (Supabase), con una restricción que impide dos citas que se crucen.
              </p>
            </div>
          </div>
          <p className="bc-cs-note">
            Catálogo: {SERVICIOS.map((s) => `${s.nombre} ${precio(s.precio)}`).join(" · ")}.
          </p>
        </div>
      </section>

      {/* ---------- 09 entregables ---------- */}
      <section className="bc-cs-sec">
        <p className="bc-cs-num">09</p>
        <div>
          <h2 className="bc-h2">Orden de trabajo</h2>
          <ul className="bc-cs-done">
            {ENTREGABLES.map(([t]) => <li key={t}>{t}</li>)}
          </ul>
          <div className="bc-actions">
            <Link href={BASE} className="bc-btn bc-btn-gold">Ver el sitio</Link>
            <Link href="/portafolio#contacto" className="bc-btn bc-btn-line">Quiero algo así para mi negocio</Link>
          </div>
        </div>
      </section>

      <footer className="bc-cs-credits">
        <p>
          Black Crown Barber Club es un negocio ficticio creado para este portafolio. Fotografías de Unsplash:{" "}
          {[...new Map(TODAS_LAS_FOTOS.map((f) => [f.autor, f])).values()].map((f, i, arr) => (
            <span key={f.autor}>
              <a href={`https://unsplash.com/photos/${f.unsplash}`} target="_blank" rel="noopener noreferrer">{f.autor}</a>
              {i < arr.length - 1 ? ", " : "."}
            </span>
          ))}
        </p>
      </footer>
    </div>
  );
}
