import type { Metadata, Viewport } from "next";
import { Cinzel, Inter, Montserrat } from "next/font/google";
import "./black-crown.css";

// Black Crown Barber Club — fictional client (portfolio project RG-001):
// branded site, simulated bookings, admin panel and case study.
const title = Cinzel({ variable: "--bc-font-title", subsets: ["latin"], weight: ["500", "700"] });
const sub = Montserrat({ variable: "--bc-font-sub", subsets: ["latin"], weight: ["500", "600"] });
const text = Inter({ variable: "--bc-font-text", subsets: ["latin"], weight: ["400", "500"] });

const description =
  "Barbería urbana premium en el centro de Tepic, Nayarit. Cortes, fades, barba, cejas y la Experiencia Black Crown. Reserva tu cita en línea.";

export const metadata: Metadata = {
  title: { default: "Black Crown Barber Club — Barbería en Tepic", template: "%s · Black Crown Barber Club" },
  description,
  keywords: ["barbería Tepic", "barbería en Tepic Nayarit", "fade Tepic", "corte de cabello hombre Tepic", "arreglo de barba", "reservar barbería"],
  openGraph: {
    title: "Black Crown Barber Club — Tu estilo. Tus reglas.",
    description,
    type: "website",
    locale: "es_MX",
    siteName: "Black Crown Barber Club",
    images: ["/portafolio/black-crown/hero.webp"],
  },
  twitter: { card: "summary_large_image", title: "Black Crown Barber Club", description },
};

export const viewport: Viewport = { themeColor: "#101010" };

export default function BlackCrownLayout({ children }: { children: React.ReactNode }) {
  return <div className={`bc ${title.variable} ${sub.variable} ${text.variable}`}>{children}</div>;
}
