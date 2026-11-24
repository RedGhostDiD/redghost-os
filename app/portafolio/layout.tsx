import type { Metadata, Viewport } from "next";
import { Inter_Tight } from "next/font/google";
import { LANG_BOOT_SCRIPT } from "@/components/portafolio/Lang";
import "./portafolio.css";

const sans = Inter_Tight({
  variable: "--pf-font-sans",
  subsets: ["latin", "greek"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "RedGhost — Desarrollo web freelance en México",
  description:
    "Diseño y programo páginas web, tiendas en línea y paneles de administración a la medida con Next.js. Paquetes desde $4,500 MXN.",
  openGraph: {
    title: "RedGhost — Desarrollo web freelance",
    description: "Páginas web, tiendas en línea y paneles a la medida. Cotiza por WhatsApp.",
    locale: "es_MX",
    type: "website",
    images: ["/portafolio/perfil.jpg"],
  },
};

export const viewport: Viewport = { themeColor: "#050509" };

export default function PortafolioLayout({ children }: { children: React.ReactNode }) {
  // The boot script may set data-lang/lang before hydration, hence suppressHydrationWarning.
  return (
    <div className={`pf ${sans.variable}`} lang="es" suppressHydrationWarning>
      <script dangerouslySetInnerHTML={{ __html: LANG_BOOT_SCRIPT }} />
      {children}
    </div>
  );
}
