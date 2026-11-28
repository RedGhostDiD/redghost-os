"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { BARBEROS, BASE, HORARIO, SERVICIOS, precio } from "./data";
import { Lockup } from "./logos";
import { cancelarReserva, deISO, fechaLarga, hora, proximosDias, reiniciarDemo, reservasDelDia, useEstado } from "./reservas";

const noop = () => () => {};
const useMontado = () => useSyncExternalStore(noop, () => true, () => false);
const PX_POR_MIN = 1.1;

export default function Admin() {
  const montado = useMontado();
  const estado = useEstado();
  const dias = useMemo(() => (montado ? proximosDias() : []), [montado]);
  const [fecha, setFecha] = useState("");
  const dia = fecha || dias[0] || "";
  const lista = useMemo(() => (dia ? reservasDelDia(estado, dia) : []), [estado, dia]);
  const h = dia ? HORARIO[deISO(dia).getDay()] : null;

  const ingresos = lista.reduce((t, r) => t + (SERVICIOS.find((s) => s.id === r.servicio)?.precio ?? 0), 0);
  const tuyas = estado.reservas.length;

  return (
    <div className="bc-admin">
      <header className="bc-admin-top">
        <Link href={BASE}><Lockup /></Link>
        <span className="bc-admin-tag">Panel admin</span>
        <Link href={`${BASE}/reservaciones`} className="bc-btn bc-btn-gold bc-btn-sm">Nueva reserva</Link>
      </header>

      <p className="bc-admin-demo">
        Demo sin inicio de sesión: ves las reservas de prueba de la agenda y las que hagas tú desde este navegador.
        En un proyecto real, este panel pide cuenta y los datos viven en la base de datos.
      </p>

      {!montado ? (
        <p className="bc-dim">Cargando agenda…</p>
      ) : (
        <>
          <div className="bc-days">
            {dias.map((d) => {
              const dt = deISO(d);
              return (
                <button key={d} type="button" className={`bc-day ${dia === d ? "is-on" : ""}`} aria-pressed={dia === d} onClick={() => setFecha(d)}>
                  <span>{dt.toLocaleDateString("es-MX", { weekday: "short" })}</span>
                  <strong>{dt.getDate()}</strong>
                  <span>{dt.toLocaleDateString("es-MX", { month: "short" })}</span>
                </button>
              );
            })}
          </div>

          <dl className="bc-stats">
            <div><dt>Día</dt><dd className="bc-cap">{fechaLarga(dia)}</dd></div>
            <div><dt>Citas</dt><dd>{lista.length}</dd></div>
            <div><dt>Ingreso estimado</dt><dd className="bc-gold">{precio(ingresos)}</dd></div>
            <div><dt>Hechas por ti</dt><dd>{tuyas}</dd></div>
          </dl>

          {h && (
            <div className="bc-agenda" style={{ "--alto": `${(h.cierra - h.abre) * PX_POR_MIN}px` } as React.CSSProperties}>
              <div className="bc-agenda-hours" aria-hidden="true">
                {Array.from({ length: Math.floor((h.cierra - h.abre) / 60) + 1 }, (_, i) => (
                  <span key={i} style={{ top: i * 60 * PX_POR_MIN }}>{hora(h.abre + i * 60)}</span>
                ))}
              </div>
              {BARBEROS.map((b) => (
                <div key={b.id} className="bc-agenda-col">
                  <p className="bc-agenda-name">{b.nombre}</p>
                  <div className="bc-agenda-track">
                    {lista.filter((r) => r.barbero === b.id).map((r) => {
                      const s = SERVICIOS.find((x) => x.id === r.servicio);
                      return (
                        <div
                          key={r.id}
                          className={`bc-agenda-item ${r.demo ? "" : "is-mine"}`}
                          style={{ top: (r.inicio - h.abre) * PX_POR_MIN, height: (r.fin - r.inicio) * PX_POR_MIN - 2 }}
                          title={`${hora(r.inicio)} ${s?.nombre} · ${r.nombre}`}
                        >
                          <strong>{hora(r.inicio)}</strong> {s?.nombre}
                          <span>{r.nombre}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          <h2 className="bc-admin-h2">Citas del día</h2>
          {lista.length === 0 ? (
            <p className="bc-dim">No hay citas este día.</p>
          ) : (
            <div className="bc-table-wrap">
              <table className="bc-table">
                <thead>
                  <tr><th>Hora</th><th>Cliente</th><th>Servicio</th><th>Barbero</th><th>Origen</th><th /></tr>
                </thead>
                <tbody>
                  {lista.map((r) => {
                    const s = SERVICIOS.find((x) => x.id === r.servicio);
                    return (
                      <tr key={r.id}>
                        <td>{hora(r.inicio)}–{hora(r.fin)}</td>
                        <td>{r.nombre}{r.telefono && <span className="bc-dim"> · {r.telefono}</span>}</td>
                        <td>{s?.nombre} <span className="bc-dim">{s && precio(s.precio)}</span></td>
                        <td>{BARBEROS.find((b) => b.id === r.barbero)?.nombre}</td>
                        <td>{r.demo ? <span className="bc-dim">Prueba</span> : <span className="bc-gold">Tuya</span>}</td>
                        <td>
                          <button type="button" className="bc-link-btn" onClick={() => cancelarReserva(r.id)}>Cancelar</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <p className="bc-admin-foot">
            <button type="button" className="bc-link-btn" onClick={() => { if (confirm("¿Borrar tus reservas y restaurar la agenda de prueba?")) reiniciarDemo(); }}>
              Reiniciar demo
            </button>
            <Link href={`${BASE}/caso`} className="bc-link">Ver caso de estudio →</Link>
          </p>
        </>
      )}
    </div>
  );
}
