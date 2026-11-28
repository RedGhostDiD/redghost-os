"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { BARBEROS, BASE, SERVICIOS, precio, waLink } from "./data";
import { crearReserva, deISO, fechaLarga, hora, huecos, proximosDias, useEstado, type Reserva } from "./reservas";

const noop = () => () => {};
/** False during SSR/hydration: dates and free slots depend on the visitor's clock and storage. */
const useMontado = () => useSyncExternalStore(noop, () => true, () => false);

const nombreBarbero = (id: string) => BARBEROS.find((b) => b.id === id)?.nombre ?? id;

export default function Reservar({ servicioInicial, barberoInicial }: { servicioInicial?: string; barberoInicial?: string }) {
  const montado = useMontado();
  const estado = useEstado();

  const [servicio, setServicio] = useState(SERVICIOS.some((s) => s.id === servicioInicial) ? servicioInicial! : "");
  const [barbero, setBarbero] = useState(BARBEROS.some((b) => b.id === barberoInicial) ? barberoInicial! : "cualquiera");
  const [fecha, setFecha] = useState("");
  const [inicio, setInicio] = useState<number | null>(null);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [error, setError] = useState("");
  const [hecha, setHecha] = useState<Reserva | null>(null);

  const s = SERVICIOS.find((x) => x.id === servicio);
  const dias = useMemo(() => (montado ? proximosDias() : []), [montado]);
  const dia = fecha || dias[0] || "";
  const libres = useMemo(
    () => (montado && s && dia ? huecos(estado, dia, s.minutos, barbero) : []),
    [montado, s, dia, barbero, estado],
  );
  // A slot picked earlier may have been taken meanwhile (other tab, other choice).
  const horaValida = inicio !== null && libres.some((h) => h.inicio === inicio) ? inicio : null;

  function confirmar(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!s || horaValida === null) {
      setError("Elige servicio, fecha y hora.");
      return;
    }
    const r = crearReserva({ servicio, barbero, fecha: dia, inicio: horaValida, nombre, telefono });
    if (!r.ok) {
      setError(r.error);
      setInicio(null);
      return;
    }
    setHecha(r.reserva);
  }

  if (hecha) {
    const sv = SERVICIOS.find((x) => x.id === hecha.servicio)!;
    const texto = `Hola Black Crown, soy ${hecha.nombre}. Reservé ${sv.nombre} con ${nombreBarbero(hecha.barbero)} el ${fechaLarga(hecha.fecha)} a las ${hora(hecha.inicio)}.`;
    return (
      <div className="bc-done" role="status">
        <p className="bc-label bc-gold">Reserva confirmada</p>
        <h2 className="bc-h2">Te esperamos, {hecha.nombre.split(" ")[0]}.</h2>
        <dl className="bc-summary">
          <div><dt>Servicio</dt><dd>{sv.nombre} · {precio(sv.precio)}</dd></div>
          <div><dt>Barbero</dt><dd>{nombreBarbero(hecha.barbero)}</dd></div>
          <div><dt>Fecha</dt><dd className="bc-cap">{fechaLarga(hecha.fecha)}</dd></div>
          <div><dt>Hora</dt><dd>{hora(hecha.inicio)} – {hora(hecha.fin)}</dd></div>
        </dl>
        <p className="bc-dim">Llega 5 minutos antes. Si no puedes venir, avísanos por WhatsApp para liberar el horario.</p>
        <div className="bc-actions">
          <a href={waLink(texto)} target="_blank" rel="noopener" className="bc-btn bc-btn-gold">Enviar a WhatsApp</a>
          <button
            type="button"
            className="bc-btn bc-btn-line"
            onClick={() => { setHecha(null); setInicio(null); setNombre(""); setTelefono(""); }}
          >
            Hacer otra reserva
          </button>
        </div>
        <p className="bc-demo-note">
          Demo: la reserva se guardó solo en tu navegador. Mírala en el <Link href={`${BASE}/admin`}>panel admin</Link>.
        </p>
      </div>
    );
  }

  return (
    <form className="bc-book" onSubmit={confirmar}>
      {/* 1 · servicio */}
      <fieldset>
        <legend><span>1</span> Servicio</legend>
        <div className="bc-options bc-options-services">
          {SERVICIOS.map((x) => (
            <label key={x.id} className={`bc-option ${servicio === x.id ? "is-on" : ""}`}>
              <input type="radio" name="servicio" value={x.id} checked={servicio === x.id} onChange={() => setServicio(x.id)} />
              <span className="bc-option-name">{x.nombre}</span>
              <span className="bc-option-meta">{precio(x.precio)} · {x.minutos} min</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* 2 · barbero */}
      <fieldset>
        <legend><span>2</span> Barbero</legend>
        <div className="bc-options">
          {[{ id: "cualquiera", nombre: "Cualquiera", rol: "El primero disponible" }, ...BARBEROS].map((b) => (
            <label key={b.id} className={`bc-option ${barbero === b.id ? "is-on" : ""}`}>
              <input type="radio" name="barbero" value={b.id} checked={barbero === b.id} onChange={() => setBarbero(b.id)} />
              <span className="bc-option-name">{b.nombre}</span>
              <span className="bc-option-meta">{b.rol}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* 3 · fecha y hora */}
      <fieldset>
        <legend><span>3</span> Fecha y hora</legend>
        {!montado ? (
          <p className="bc-dim">Cargando agenda…</p>
        ) : (
          <>
            <div className="bc-days" role="radiogroup" aria-label="Fecha">
              {dias.map((d) => {
                const dt = deISO(d);
                return (
                  <button
                    key={d}
                    type="button"
                    role="radio"
                    aria-checked={dia === d}
                    className={`bc-day ${dia === d ? "is-on" : ""}`}
                    onClick={() => { setFecha(d); setInicio(null); }}
                  >
                    <span>{dt.toLocaleDateString("es-MX", { weekday: "short" })}</span>
                    <strong>{dt.getDate()}</strong>
                    <span>{dt.toLocaleDateString("es-MX", { month: "short" })}</span>
                  </button>
                );
              })}
            </div>
            {!s ? (
              <p className="bc-dim">Elige un servicio para ver los horarios libres.</p>
            ) : libres.length === 0 ? (
              <p className="bc-dim">No quedan horarios libres este día. Prueba otro día u otro barbero.</p>
            ) : (
              <div className="bc-slots" role="radiogroup" aria-label="Hora">
                {libres.map((h) => (
                  <button
                    key={h.inicio}
                    type="button"
                    role="radio"
                    aria-checked={horaValida === h.inicio}
                    className={`bc-slot ${horaValida === h.inicio ? "is-on" : ""}`}
                    onClick={() => setInicio(h.inicio)}
                  >
                    {hora(h.inicio)}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </fieldset>

      {/* 4 · datos */}
      <fieldset>
        <legend><span>4</span> Tus datos</legend>
        <div className="bc-fields">
          <label>
            Nombre
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="name" required maxLength={60} />
          </label>
          <label>
            Teléfono / WhatsApp
            <input value={telefono} onChange={(e) => setTelefono(e.target.value)} type="tel" inputMode="tel" autoComplete="tel" required maxLength={20} placeholder="311 123 4567" />
          </label>
        </div>
      </fieldset>

      <div className="bc-book-foot">
        <p className="bc-book-sum">
          {s ? <><strong>{s.nombre}</strong> · {precio(s.precio)}</> : "Sin servicio"}
          {horaValida !== null && dia && <> · <span className="bc-cap">{fechaLarga(dia)}</span>, {hora(horaValida)}</>}
        </p>
        {error && <p className="bc-error" role="alert">{error}</p>}
        <button type="submit" className="bc-btn bc-btn-gold" disabled={!s || horaValida === null}>Confirmar reserva</button>
      </div>
    </form>
  );
}
