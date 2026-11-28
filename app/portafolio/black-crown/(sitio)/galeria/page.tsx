import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BASE, FOTOS } from "../../_lib/data";

export const metadata: Metadata = {
  title: "Galería",
  description: "Fades, cortes clásicos y barbas hechas en Black Crown Barber Club, Tepic.",
  alternates: { canonical: `${BASE}/galeria` },
};

export default function Galeria() {
  const fotos = [...FOTOS.galeria, ...FOTOS.interior.slice(0, 2)];
  return (
    <>
      <header className="bc-page-head">
        <p className="bc-label">Galería</p>
        <h1 className="bc-h1">Trabajos realizados</h1>
        <p className="bc-lead">Cada corte sale con una foto. Esta es una parte de lo que hacemos.</p>
      </header>
      <section className="bc-section">
        <div className="bc-gallery">
          {fotos.map((f, i) => (
            <figure key={f.src} className={`bc-gallery-item g-${i % 5}`}>
              <Image src={f.src} alt={f.alt} fill sizes="(min-width: 900px) 33vw, 50vw" />
              <figcaption>{f.alt}</figcaption>
            </figure>
          ))}
        </div>
        <p className="bc-center">
          <Link href={`${BASE}/reservaciones`} className="bc-btn bc-btn-gold">Quiero un corte así</Link>
        </p>
      </section>
    </>
  );
}
