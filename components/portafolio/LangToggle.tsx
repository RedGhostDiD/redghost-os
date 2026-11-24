"use client";

import { useEffect, useSyncExternalStore } from "react";

type Lang = "es" | "en";
const KEY = "pf-lang";
const EVENT = "pf-lang";

function read(): Lang {
  try {
    return localStorage.getItem(KEY) === "en" ? "en" : "es";
  } catch {
    return "es";
  }
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

function choose(next: Lang) {
  try {
    localStorage.setItem(KEY, next);
  } catch {}
  window.dispatchEvent(new Event(EVENT)); // every toggle on the page re-reads
}

/** ES / EN switch for /portafolio. Remembers the choice in this browser. */
export default function LangToggle({ className = "" }: { className?: string }) {
  const lang = useSyncExternalStore(subscribe, read, () => "es" as Lang);

  // Show the chosen language (also covers client-side navigation, where the boot script doesn't run).
  useEffect(() => {
    document.querySelectorAll<HTMLElement>(".pf").forEach((el) => {
      el.dataset.lang = lang;
      el.lang = lang;
    });
  }, [lang]);

  return (
    <span className={`pf-lang ${className}`} role="group" aria-label="Idioma / Language">
      <button type="button" aria-pressed={lang === "es"} onClick={() => choose("es")} lang="es">
        ES
      </button>
      <span aria-hidden="true">/</span>
      <button type="button" aria-pressed={lang === "en"} onClick={() => choose("en")} lang="en">
        EN
      </button>
    </span>
  );
}
