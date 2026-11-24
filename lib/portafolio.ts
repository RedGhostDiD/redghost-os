import data from "@/data/portafolio.json";

export interface PortfolioProject {
  slug: string;
  name: string;
  kind: string;
  summary: string;
  highlights: string[];
  stack: string[];
  url: string;
  status: string;
  image: string;
}

export interface PortfolioPackage {
  name: string;
  price: number;
  for: string;
  features: string[];
  delivery: string;
  featured: boolean;
}

export interface PortfolioData {
  whatsapp: string;
  whatsappMessage: string;
  currency: string;
  projects: PortfolioProject[];
  packages: PortfolioPackage[];
  faq: { q: string; a: string }[];
}

/**
 * Content of /portafolio (projects, packages, prices, FAQ, WhatsApp).
 * Edit data/portafolio.json — email and socials come from site-config.json.
 */
export const PORTFOLIO: PortfolioData = data as PortfolioData;

export function whatsappLink(message = PORTFOLIO.whatsappMessage): string {
  return `https://wa.me/${PORTFOLIO.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function formatPrice(value: number): string {
  return `$${value.toLocaleString("es-MX")}`;
}
