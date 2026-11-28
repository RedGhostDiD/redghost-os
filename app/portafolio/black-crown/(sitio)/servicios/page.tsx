import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BASE, FOTOS, SERVICIOS, precio } from "../../_lib/data";

export const metadata: Metadata = {
  title: "Servicios y precios",
  description: "Corte clásico, fade, corte + barba, perfilado de barba, diseño de ceja, corte infantil y la Experiencia Black Crown. Precios en Tepic.",
  alternates: { canonical: `${BASE}/servicios` },
};

export default function Servicios() {
  const exp = SERVICIOS.find((s) => s.destacado)!;
  const resto = SERVICIOS.filter((s) => !s.destacado);

  return (
    <>
      <header className="bc-page-head">
        <p className="bc-label">Servicios</p>
        <h1 className="bc-h1">Catálogo y precios</h1>
        <p className="bc-lead">Precios en pesos mexicanos. Cada servicio incluye lavado y acabado con producto.</p>
      </header>

      <section className="bc-section bc-menu-wrap">
        <ul className="bc-menu">
          {resto.map((s) => (
            <li key={s.id}>
              <div className="bc-menu-row">
                <h2>{s.nombre}</h2>
                <span className="bc-menu-dots" />
                <strong>{precio(s.precio)}</strong>
              </div>
              <p>{s.desc}</p>
              <p className="bc-menu-meta">
                <span>{s.minutos} min</span>
                <Link href={`${BASE}/reservaciones?servicio=${s.id}`} className="bc-link">Reservar →</Link>
              </p>
            </li>
          ))}
        </ul>
        <figure className="bc-menu-photo">
          <Image src={FOTOS.herramientas[2].src} alt={FOTOS.herramientas[2].alt} fill sizes="(min-width: 900px) 35vw, 100vw" />
        </figure>
      </section>

      <section className="bc-section">
        <div className="bc-feature">
          <figure>
            <Image src={FOTOS.galeria[1].src} alt={FOTOS.galeria[1].alt} fill sizes="(min-width: 900px) 45vw, 100vw" />
          </figure>
          <div>
            <p className="bc-label bc-gold">Servicio insignia</p>
            <h2 className="bc-h2">{exp.nombre}</h2>
            <p className="bc-lead">{exp.desc}</p>
            <ul className="bc-checks">
              <li>Corte a elección</li>
              <li>Arreglo de barba con toalla caliente</li>
              <li>Asesoría de estilo y productos para casa</li>
            </ul>
            <p className="bc-feature-price">{precio(exp.precio)} <span>· {exp.minutos} min</span></p>
            <Link href={`${BASE}/reservaciones?servicio=${exp.id}`} className="bc-btn bc-btn-gold">Reservar la experiencia</Link>
          </div>
        </div>
      </section>
    </>
  );
}
