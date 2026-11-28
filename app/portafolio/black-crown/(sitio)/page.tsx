import Image from "next/image";
import Link from "next/link";
import { BASE, FOTOS, NEGOCIO, SERVICIOS, precio } from "../_lib/data";
import { CrownA } from "../_lib/logos";

export const metadata = { alternates: { canonical: BASE } };

const DESTACADOS = ["clasico", "fade", "barba", "experiencia"];

export default function Inicio() {
  const servicios = DESTACADOS.map((id) => SERVICIOS.find((s) => s.id === id)!);

  return (
    <>
      {/* ---------- hero ---------- */}
      <section className="bc-hero">
        <Image src={FOTOS.hero.src} alt={FOTOS.hero.alt} fill priority sizes="100vw" className="bc-hero-img" />
        <div className="bc-hero-shade" />
        <div className="bc-hero-body">
          <p className="bc-kicker">{NEGOCIO.eslogan}</p>
          <h1 className="bc-hero-title">
            <CrownA className="bc-hero-crown" title="" />
            Black Crown
          </h1>
          <p className="bc-hero-sub">Barber Club · Est. {NEGOCIO.fundada}</p>
          <div className="bc-actions">
            <Link href={`${BASE}/reservaciones`} className="bc-btn bc-btn-gold">Reservar cita</Link>
            <Link href={`${BASE}/servicios`} className="bc-btn bc-btn-line">Ver servicios</Link>
          </div>
        </div>
        <p className="bc-hero-loc">{NEGOCIO.ciudad}</p>
      </section>

      {/* ---------- presentación ---------- */}
      <section className="bc-section bc-intro">
        <p className="bc-label">Black Crown</p>
        <p className="bc-statement">
          No se trata solamente de un corte. Se trata de <em>cómo te presentas al mundo.</em>
        </p>
        <p className="bc-lead">
          En Black Crown combinamos técnica, precisión y estilo para crear una imagen que represente quién eres.
          Reservas tu hora, llegas y te atendemos: sin filas, sin prisas.
        </p>
      </section>

      {/* ---------- servicios ---------- */}
      <section className="bc-section">
        <div className="bc-section-head">
          <div>
            <p className="bc-label">Nuestros servicios</p>
            <h2 className="bc-h2">Hechos a tu medida</h2>
          </div>
          <Link href={`${BASE}/servicios`} className="bc-link">Ver todos y precios →</Link>
        </div>
        <div className="bc-cards">
          {servicios.map((s, i) => (
            <Link key={s.id} href={`${BASE}/reservaciones?servicio=${s.id}`} className={`bc-card ${s.destacado ? "is-gold" : ""}`}>
              <span className="bc-card-num">0{i + 1}</span>
              <h3>{s.nombre}</h3>
              <p>{s.desc}</p>
              <span className="bc-card-foot">
                <strong>{precio(s.precio)}</strong>
                <span>{s.minutos} min</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- galería ---------- */}
      <section className="bc-section">
        <div className="bc-section-head">
          <div>
            <p className="bc-label">Trabajos</p>
            <h2 className="bc-h2">El detalle se nota</h2>
          </div>
          <Link href={`${BASE}/galeria`} className="bc-link">Ver galería →</Link>
        </div>
        <div className="bc-strip">
          {FOTOS.galeria.slice(0, 4).map((f) => (
            <figure key={f.src}>
              <Image src={f.src} alt={f.alt} fill sizes="(min-width: 900px) 25vw, 50vw" />
            </figure>
          ))}
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="bc-cta">
        <Image src={FOTOS.herramientas[0].src} alt="" fill sizes="100vw" className="bc-cta-img" />
        <div className="bc-cta-body">
          <CrownA className="bc-cta-crown" title="" />
          <h2 className="bc-h2">Tu próxima imagen comienza aquí.</h2>
          <p className="bc-lead">Agenda tu próxima visita en menos de un minuto.</p>
          <Link href={`${BASE}/reservaciones`} className="bc-btn bc-btn-gold">Reserva tu próxima cita</Link>
        </div>
      </section>
    </>
  );
}
