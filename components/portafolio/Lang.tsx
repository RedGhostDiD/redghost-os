import type { ReactNode } from "react";

/**
 * Bilingual text for /portafolio. Both versions are rendered; CSS shows the
 * one that matches `data-lang` on the .pf wrapper (set by LangToggle), so the
 * switch is instant and there is no flash of the wrong language.
 */
export default function T({ es, en }: { es: ReactNode; en: ReactNode }) {
  return (
    <>
      <span data-l="es">{es}</span>
      <span data-l="en">{en}</span>
    </>
  );
}

/** Runs before paint: applies the saved language so English visitors never see Spanish first. */
export const LANG_BOOT_SCRIPT =
  "try{if(/^\\/portafolio\\/?$/.test(location.pathname)&&localStorage.getItem('pf-lang')==='en'){var d=document.currentScript.parentElement;d.dataset.lang='en';d.lang='en'}}catch(e){}";
