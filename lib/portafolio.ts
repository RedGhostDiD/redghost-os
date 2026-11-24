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
  /** Small print under the packages ("desde", external costs, scope). */
  pricingNotes: string[];
  payment: { deposit: number; guaranteeDays: number };
  /** How a project runs, payment included. */
  steps: { title: string; text: string }[];
  /** Guarantee / maintenance / renewals. */
  support: { title: string; tag: string; text: string; items: string[] }[];
  supportNote: string;
  ownership: string;
}

/**
 * Content of /portafolio (projects, packages, prices, terms, WhatsApp).
 * Edit data/portafolio.json — email and socials come from site-config.json.
 */
export const PORTFOLIO: PortfolioData = data as PortfolioData;

export function whatsappLink(message = PORTFOLIO.whatsappMessage): string {
  return `https://wa.me/${PORTFOLIO.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function formatPrice(value: number): string {
  return `$${value.toLocaleString("es-MX")}`;
}
