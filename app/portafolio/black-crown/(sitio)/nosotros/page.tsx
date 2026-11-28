import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BARBEROS, BASE, FOTOS, NEGOCIO } from "../../_lib/data";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "La historia, el equipo y la filosofía de Black Crown Barber Club en Tepic, Nayarit.",
  alternates: { canonical: `${BASE}/nosotros` },
};

const VALORES = [
  { t: "Precisión", d: "Líneas limpias y transiciones que duran. Revisamos cada detalle antes de quitarte la capa." },
  { t: "Puntualidad", d: "Tu hora es tu hora. Reservas y te atendemos a tiempo, sin filas." },
  { t: "Criterio", d: "Te escuchamos y te decimos qué te va. Si algo no te favorece, también te lo decimos." },
];

export default function Nosotros() {
  return (
    <>
      <header className="bc-page-head">
        <p className="bc-label">Nosotros</p>
        <h1 className="bc-h1">Una corona se gana</h1>
      </header>

      <section className="bc-section">
        <div className="bc-feature">
          <figure>
            <Image src={FOTOS.interior[2].src} alt={FOTOS.interior[2].alt} fill sizes="(min-width: 900px) 45vw, 100vw" />
          </figure>
          <div>
            <p className="bc-label">Historia</p>
            <p className="bc-lead">
              Black Crown abrió en {NEGOCIO.fundada} en el centro de Tepic con una idea simple: una barbería que se tomara
              en serio el oficio sin parecer anticuada ni de franquicia.
            </p>
            <p className="bc-lead">
              Tomamos la técnica de la barbería clásica, la cultura urbana de la calle y una regla: cada cliente sale
              como entró a buscar. Tu estilo. Tus reglas.
            </p>
          </div>
        </div>
      </section>

      <section className="bc-section">
        <p className="bc-label">Filosofía</p>
        <div className="bc-values">
          {VALORES.map((v, i) => (
            <div key={v.t}>
              <span className="bc-card-num">0{i + 1}</span>
              <h3>{v.t}</h3>
              <p>{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bc-section">
        <div className="bc-section-head">
          <div>
            <p className="bc-label">Equipo</p>
            <h2 className="bc-h2">Los barberos</h2>
          </div>
        </div>
        <div className="bc-team">
          {BARBEROS.map((b) => (
            <article key={b.id}>
              <figure>
                <Image src={b.foto} alt={`Trabajo de ${b.nombre}`} fill sizes="(min-width: 900px) 30vw, 100vw" />
              </figure>
              <h3>{b.nombre}</h3>
              <p className="bc-dim">{b.rol} · {b.anios} años de oficio</p>
              <Link href={`${BASE}/reservaciones?barbero=${b.id}`} className="bc-link">Reservar con {b.nombre.split(" ")[0]} →</Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
