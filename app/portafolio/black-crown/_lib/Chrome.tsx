"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BASE, HORARIO_TEXTO, NEGOCIO } from "./data";
import { Lockup } from "./logos";

const LINKS = [
  { href: BASE, label: "Inicio" },
  { href: `${BASE}/servicios`, label: "Servicios" },
  { href: `${BASE}/galeria`, label: "Galería" },
  { href: `${BASE}/nosotros`, label: "Nosotros" },
  { href: `${BASE}/contacto`, label: "Contacto" },
];

/** Thin top strip so nobody mistakes the demo for a real barbershop. */
export function DemoBar() {
  return (
    <div className="bc-demobar" role="note">
      <span className="bc-demobar-tag">Demo</span>
      <span className="bc-demobar-txt">
        Sitio de demostración: Black Crown es un negocio ficticio. Las reservas son de prueba y no se agenda ninguna cita real.
      </span>
      <Link href={`${BASE}/caso`} className="bc-demobar-link">Ver caso de estudio</Link>
    </div>
  );
}

export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className={`bc-header ${open ? "is-open" : ""}`}>
      <Link href={BASE} onClick={close} aria-label="Black Crown Barber Club — inicio">
        <Lockup />
      </Link>
      <button type="button" className="bc-burger" aria-expanded={open} aria-controls="bc-nav" onClick={() => setOpen((o) => !o)}>
        <span className="sr-only">{open ? "Cerrar menú" : "Abrir menú"}</span>
        <i /><i />
      </button>
      <nav id="bc-nav" className="bc-nav" aria-label="Principal">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} onClick={close} aria-current={path === l.href ? "page" : undefined}>
            {l.label}
          </Link>
        ))}
        <Link href={`${BASE}/reservaciones`} onClick={close} className="bc-btn bc-btn-gold">
          Reservar cita
        </Link>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bc-footer">
      <div className="bc-footer-grid">
        <div>
          <Lockup stacked />
          <p className="bc-footer-claim">{NEGOCIO.eslogan}</p>
        </div>
        <div>
          <p className="bc-label">Visítanos</p>
          <p>{NEGOCIO.direccion}<br />{NEGOCIO.ciudad}</p>
        </div>
        <div>
          <p className="bc-label">Horario</p>
          {HORARIO_TEXTO.map((h) => (
            <p key={h.dias}><span className="bc-dim">{h.dias}</span> · {h.horas}</p>
          ))}
        </div>
        <div>
          <p className="bc-label">Explora</p>
          {LINKS.slice(1).map((l) => (
            <p key={l.href}><Link href={l.href}>{l.label}</Link></p>
          ))}
          <p><Link href={`${BASE}/reservaciones`}>Reservaciones</Link></p>
        </div>
      </div>
      <div className="bc-footer-bottom">
        <span>BLACK CROWN BARBER CLUB · © 2026</span>
        <span className="bc-footer-demo">
          Proyecto de portafolio: negocio ficticio, hecho por RedGhost ·{" "}
          <Link href={`${BASE}/caso`}>Ver caso de estudio</Link> · <Link href={`${BASE}/admin`}>Panel admin</Link> ·{" "}
          <Link href="/portafolio">Portafolio</Link>
        </span>
      </div>
    </footer>
  );
}
