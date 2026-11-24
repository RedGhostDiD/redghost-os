import type { Metadata, Viewport } from "next";
import { Anton, Mouse_Memoirs, Titan_One } from "next/font/google";
import "./monster.css";

// Demo landing for the portfolio: one-page burger shop (up to 6 blocks,
// WhatsApp CTA, responsive, basic SEO). Fonts mirror the reference:
// tall condensed headline, bubbly display face, condensed hand-drawn body.
const display = Anton({ variable: "--mb-font-tall", subsets: ["latin"], weight: "400" });
const bubbly = Titan_One({ variable: "--mb-font-bubbly", subsets: ["latin"], weight: "400" });
const body = Mouse_Memoirs({ variable: "--mb-font-body", subsets: ["latin"], weight: "400" });

const description =
  "Hamburguesas smash monstruosas: carne 100% de res, queso cheddar fundido y salsas de la casa. Pide por WhatsApp.";

export const metadata: Metadata = {
  title: "Monster Burger — Hamburguesas smash monstruosas",
  description,
  keywords: ["hamburguesas", "smash burger", "hamburguesería", "pedidos por WhatsApp", "Monster Burger"],
  alternates: { canonical: "/portafolio/hamburguesas-landingpage" },
  openGraph: {
    title: "Monster Burger — Hamburguesas smash monstruosas",
    description,
    type: "website",
    locale: "es_AR",
    siteName: "Monster Burger",
  },
  twitter: { card: "summary_large_image", title: "Monster Burger", description },
};

export const viewport: Viewport = { themeColor: "#f5e3cf" };

export default function MonsterBurgerLayout({ children }: { children: React.ReactNode }) {
  return <div className={`mb ${display.variable} ${bubbly.variable} ${body.variable}`}>{children}</div>;
}
