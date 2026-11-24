"use client";

import { useEffect } from "react";

// Adds `is-in` to every .mb-reveal once it scrolls into view, which starts its
// pop animation (CSS). Each element keeps its own --d delay, so words pop one
// after another. Runs once per element.
export default function ScrollReveal() {
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>(".mb .mb-reveal, .mb .mb-waves");
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      },
      { threshold: 0.25, rootMargin: "0px 0px -8% 0px" },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
