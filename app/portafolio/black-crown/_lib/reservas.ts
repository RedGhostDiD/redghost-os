"use client";

import { useMemo, useSyncExternalStore } from "react";
import { BARBEROS, HORARIO, SERVICIOS } from "./data";

// Simulated booking system. Bookings live in the visitor's localStorage, so the
// demo works without a database and nobody sees anyone else's data. To make the
// agenda look real, every open day also has a few seeded "demo" bookings that
// block their slots (they can be cancelled from the admin panel).
//
// In production this same logic moves to the database: a unique/exclusion
// constraint on (barbero, fecha, rango de horas) is what really prevents
// double bookings; the checks here mirror it.

export interface Reserva {
  id: string;
  servicio: string;
  barbero: string;
  fecha: string; // YYYY-MM-DD, local time
  inicio: number; // minutes from midnight
  fin: number;
  nombre: string;
  telefono: string;
  creada: string;
  demo?: boolean;
}

interface Estado { reservas: Reserva[]; canceladas: string[] }

const KEY = "bc-reservas-v1";
const PASO = 15; // minutes between possible start times
const DIAS_ADELANTE = 21;
const VACIO: Estado = { reservas: [], canceladas: [] };

/* ---------- dates ---------- */
const pad = (n: number) => String(n).padStart(2, "0");
export const fechaISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const deISO = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
export const hora = (min: number) => `${Math.floor(min / 60)}:${pad(min % 60)}`;
export const fechaLarga = (s: string) =>
  deISO(s).toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" });

/** Next days the shop is open (skips closed days), starting today. */
export function proximosDias(desde = new Date()): string[] {
  const out: string[] = [];
  for (let i = 0; i < DIAS_ADELANTE; i++) {
    const d = new Date(desde.getFullYear(), desde.getMonth(), desde.getDate() + i);
    if (HORARIO[d.getDay()]) out.push(fechaISO(d));
  }
  return out;
}

/* ---------- store ---------- */
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
function subscribe(cb: () => void) {
  listeners.add(cb);
  const on = (e: StorageEvent) => { if (e.key === KEY) cb(); };
  window.addEventListener("storage", on);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", on);
  };
}
const snapshot = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
function leer(raw: string | null = snapshot()): Estado {
  if (!raw) return VACIO;
  try {
    const e = JSON.parse(raw) as Estado;
    return { reservas: e.reservas ?? [], canceladas: e.canceladas ?? [] };
  } catch {
    return VACIO;
  }
}
function escribir(e: Estado) {
  localStorage.setItem(KEY, JSON.stringify(e));
  emit();
}

/** The visitor's saved state; empty on the server. */
export function useEstado(): Estado {
  const raw = useSyncExternalStore(subscribe, snapshot, () => null);
  return useMemo(() => leer(raw), [raw]);
}

/* ---------- seeded demo bookings ---------- */
function rng(seed: string) {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}
const NOMBRES_DEMO = ["Carlos M.", "Iván R.", "Jorge L.", "Emilio S.", "Diego P.", "Rafa G.", "Toño V.", "Luis A."];

function semilla(fecha: string): Reserva[] {
  const h = HORARIO[deISO(fecha).getDay()];
  if (!h) return [];
  const r = rng(fecha);
  const out: Reserva[] = [];
  for (const b of BARBEROS) {
    const n = 2 + Math.floor(r() * 3);
    for (let k = 0; k < n; k++) {
      const s = SERVICIOS[Math.floor(r() * SERVICIOS.length)];
      const pasos = Math.floor((h.cierra - h.abre - s.minutos) / PASO);
      const inicio = h.abre + Math.floor(r() * (pasos + 1)) * PASO;
      const fin = inicio + s.minutos;
      if (out.some((o) => o.barbero === b.id && inicio < o.fin && o.inicio < fin)) continue;
      out.push({
        id: `demo-${fecha}-${b.id}-${k}`,
        servicio: s.id,
        barbero: b.id,
        fecha,
        inicio,
        fin,
        nombre: NOMBRES_DEMO[Math.floor(r() * NOMBRES_DEMO.length)],
        telefono: "",
        creada: "",
        demo: true,
      });
    }
  }
  return out;
}

/** Every active booking for a date: seeded + the visitor's, minus cancelled ones. */
export function reservasDelDia(e: Estado, fecha: string): Reserva[] {
  return [...semilla(fecha), ...e.reservas.filter((x) => x.fecha === fecha)]
    .filter((x) => !e.canceladas.includes(x.id))
    .sort((a, b) => a.inicio - b.inicio);
}

/* ---------- availability ---------- */
const ocupado = (lista: Reserva[], barbero: string, inicio: number, fin: number) =>
  lista.some((x) => x.barbero === barbero && inicio < x.fin && x.inicio < fin);

export interface Hueco { inicio: number; barberos: string[] }

/** Free start times for a service. `barbero` = "cualquiera" lists times where anyone is free. */
export function huecos(e: Estado, fecha: string, minutos: number, barbero: string, ahora = new Date()): Hueco[] {
  const h = HORARIO[deISO(fecha).getDay()];
  if (!h) return [];
  const lista = reservasDelDia(e, fecha);
  const minimo = fecha === fechaISO(ahora) ? ahora.getHours() * 60 + ahora.getMinutes() + 30 : 0;
  const candidatos = barbero === "cualquiera" ? BARBEROS.map((b) => b.id) : [barbero];
  const out: Hueco[] = [];
  for (let t = h.abre; t + minutos <= h.cierra; t += PASO) {
    if (t < minimo) continue;
    const libres = candidatos.filter((b) => !ocupado(lista, b, t, t + minutos));
    if (libres.length) out.push({ inicio: t, barberos: libres });
  }
  return out;
}

export type Resultado = { ok: true; reserva: Reserva } | { ok: false; error: string };

/** Re-checks against the latest saved state, so two tabs can't take the same slot. */
export function crearReserva(datos: {
  servicio: string;
  barbero: string;
  fecha: string;
  inicio: number;
  nombre: string;
  telefono: string;
}): Resultado {
  const s = SERVICIOS.find((x) => x.id === datos.servicio);
  if (!s) return { ok: false, error: "Elige un servicio." };
  if (datos.nombre.trim().length < 2) return { ok: false, error: "Escribe tu nombre." };
  if (datos.telefono.replace(/\D/g, "").length < 10) return { ok: false, error: "Escribe un teléfono de 10 dígitos." };

  const e = leer();
  const hueco = huecos(e, datos.fecha, s.minutos, datos.barbero).find((x) => x.inicio === datos.inicio);
  if (!hueco) return { ok: false, error: "Ese horario se acaba de ocupar. Elige otro, por favor." };

  const reserva: Reserva = {
    id: `r-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    servicio: s.id,
    barbero: hueco.barberos[0],
    fecha: datos.fecha,
    inicio: datos.inicio,
    fin: datos.inicio + s.minutos,
    nombre: datos.nombre.trim().slice(0, 60),
    telefono: datos.telefono.replace(/[^\d+ ]/g, "").slice(0, 20),
    creada: new Date().toISOString(),
  };
  try {
    escribir({ ...e, reservas: [...e.reservas, reserva] });
  } catch {
    return { ok: false, error: "Tu navegador no permitió guardar la reserva." };
  }
  return { ok: true, reserva };
}

export function cancelarReserva(id: string) {
  const e = leer();
  escribir({ reservas: e.reservas.filter((x) => x.id !== id), canceladas: id.startsWith("demo-") ? [...e.canceladas, id] : e.canceladas });
}

export function reiniciarDemo() {
  try { localStorage.removeItem(KEY); } catch {}
  emit();
}
