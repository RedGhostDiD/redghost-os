import { DemoBar, Footer, Header } from "../_lib/Chrome";
import { NEGOCIO } from "../_lib/data";

// Local SEO: one BarberShop entity for every public page.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BarberShop",
  name: NEGOCIO.nombre,
  slogan: NEGOCIO.eslogan,
  telephone: NEGOCIO.telefono,
  priceRange: "$$",
  image: "/portafolio/black-crown/hero.webp",
  address: {
    "@type": "PostalAddress",
    streetAddress: NEGOCIO.direccion,
    addressLocality: "Tepic",
    addressRegion: "Nayarit",
    postalCode: NEGOCIO.cp,
    addressCountry: "MX",
  },
  openingHours: ["Tu-Fr 10:00-20:00", "Sa 09:00-20:00", "Su 10:00-15:00"],
};

export default function SitioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <DemoBar />
      <Header />
      <main className="bc-main">{children}</main>
      <Footer />
    </>
  );
}
