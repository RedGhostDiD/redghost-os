import type { Metadata } from "next";
import Link from "next/link";
import { BASE, HORARIO_TEXTO, NEGOCIO, waLink } from "../../_lib/data";

export const metadata: Metadata = {
  title: "Contacto y horarios",
  description: `Black Crown Barber Club: ${NEGOCIO.direccion}, ${NEGOCIO.ciudad}. Horarios, WhatsApp y ubicación en el mapa.`,
  alternates: { canonical: `${BASE}/contacto` },
};

export default function Contacto() {
  return (
    <>
      <header className="bc-page-head">
        <p className="bc-label">Contacto</p>
        <h1 className="bc-h1">Te esperamos</h1>
      </header>

      <section className="bc-section bc-contact">
        <div className="bc-contact-info">
          <div>
            <p className="bc-label">Dirección</p>
            <p className="bc-big">{NEGOCIO.direccion}<br />{NEGOCIO.ciudad}, C.P. {NEGOCIO.cp}</p>
          </div>
          <div>
            <p className="bc-label">Horarios</p>
            <dl className="bc-hours">
              {HORARIO_TEXTO.map((h) => (
                <div key={h.dias}>
                  <dt>{h.dias}</dt>
                  <dd className={h.horas === "Cerrado" ? "bc-dim" : undefined}>{h.horas}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <p className="bc-label">WhatsApp e Instagram</p>
            <p className="bc-big">{NEGOCIO.telefono}<br />@{NEGOCIO.instagram}</p>
          </div>
          <div className="bc-actions">
            <a href={waLink("Hola Black Crown, tengo una pregunta.")} target="_blank" rel="noopener" className="bc-btn bc-btn-gold">
              Escribir por WhatsApp
            </a>
            <Link href={`${BASE}/reservaciones`} className="bc-btn bc-btn-line">Reservar cita</Link>
          </div>
        </div>
        <div className="bc-map">
          <iframe
            title="Ubicación de Black Crown Barber Club en el mapa"
            src={`https://www.google.com/maps?q=${encodeURIComponent(NEGOCIO.mapa)}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  );
}
