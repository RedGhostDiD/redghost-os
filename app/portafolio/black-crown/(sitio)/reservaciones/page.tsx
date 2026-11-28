import type { Metadata } from "next";
import { BASE } from "../../_lib/data";
import Reservar from "../../_lib/Reservar";

export const metadata: Metadata = {
  title: "Reservaciones",
  description: "Reserva tu cita en Black Crown Barber Club: elige servicio, barbero, fecha y hora en menos de un minuto.",
  alternates: { canonical: `${BASE}/reservaciones` },
};

export default async function Reservaciones({ searchParams }: { searchParams: Promise<{ servicio?: string; barbero?: string }> }) {
  const { servicio, barbero } = await searchParams;
  return (
    <>
      <header className="bc-page-head">
        <p className="bc-label">Reservaciones</p>
        <h1 className="bc-h1">Reserva tu próxima cita</h1>
        <p className="bc-lead">Servicio, barbero, fecha y hora. Solo verás horarios libres.</p>
      </header>
      <section className="bc-section">
        {/* key: a new link (?servicio=…) starts a fresh form */}
        <Reservar key={`${servicio}-${barbero}`} servicioInicial={servicio} barberoInicial={barbero} />
      </section>
    </>
  );
}
