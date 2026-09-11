"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAudio } from "@/lib/audio";
import AudioToggle from "./AudioToggle";

const MODULES = [
  { label: "HOME", href: "/inicio" },
  { label: "PROJECTS", href: "/proyectos" },
  { label: "ROBOTICS", href: "/robotica" },
  { label: "SOFTWARE", href: "/software" },
  { label: "HARDWARE", href: "/hardware" },
  { label: "DESIGN", href: "/diseno" },
  { label: "LAB", href: "/laboratorio" },
  { label: "STORE", href: "/store" },
];

const UTILITY = [
  { label: "IDENTITY", href: "/sobre-mi" },
  { label: "NETWORK", href: "/redes" },
  { label: "CONTACT", href: "/contacto" },
];

export default function Nav() {
  const pathname = usePathname();
  const { play } = useAudio();

  return (
    <header className="rg-neo-header sticky top-0 z-20 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-11 text-[10px] tracking-[0.15em] gap-4">
          <Link
            href="/inicio"
            className="rg-nav-logo shrink-0 text-[var(--rg-red)] font-semibold tracking-[0.25em]"
            onClick={() => play("ui-click")}
          >
            REDGHOST_OS
          </Link>

          <div className="hidden md:flex items-center gap-4 text-[var(--rg-text-faint)] overflow-x-auto rg-scrollbar">
            {UTILITY.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onMouseEnter={() => play("ui-hover")}
                onClick={() => play("ui-click")}
                className="rg-nav-link whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span
              className="hidden sm:flex items-center gap-1.5"
              style={{ color: "var(--rg-green)", textShadow: "0 0 6px rgba(51,224,138,0.5)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--rg-green)]" />
              SYS: ONLINE
            </span>
            <span
              className="hidden sm:flex items-center gap-1.5"
              style={{ color: "var(--rg-green)", textShadow: "0 0 6px rgba(51,224,138,0.5)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--rg-green)]" />
              DiD: ACTIVE
            </span>
            <AudioToggle />
          </div>
        </div>

        <nav
          className="flex items-center gap-1 h-10 overflow-x-auto rg-scrollbar text-[11px] tracking-[0.1em] border-t"
          style={{ borderColor: "rgba(255, 22, 61, 0.16)" }}
        >
          {MODULES.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onMouseEnter={() => play("ui-hover")}
                onClick={() => play("ui-click")}
                className="px-3 py-1.5 whitespace-nowrap transition-colors border-b-2"
                style={{
                  color: active ? "var(--rg-red)" : "var(--rg-text-dim)",
                  borderColor: active ? "var(--rg-red)" : "transparent",
                  textShadow: active ? "0 0 8px rgba(255, 22, 61,0.6)" : "none",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div
          className="flex md:hidden items-center gap-3 h-8 overflow-x-auto rg-scrollbar text-[10px] tracking-[0.12em] text-[var(--rg-text-faint)] border-t"
          style={{ borderColor: "rgba(255, 22, 61, 0.16)" }}
        >
          {UTILITY.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => play("ui-click")}
              className="rg-nav-link whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
