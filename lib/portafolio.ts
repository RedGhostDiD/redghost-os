import data from "@/data/portafolio.json";
import dataEn from "@/data/portafolio.en.json";

export interface PortfolioProject {
  slug: string;
  name: string;
  kind: string;
  summary: string;
  highlights: string[];
  stack: string[];
  url: string;
  status: string;
  /** Concept project, not a real client: shows a DEMO tag next to the status. */
  demo?: boolean;
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

/** English texts for the language switch; arrays follow the Spanish order. */
export interface PortfolioEnglish {
  whatsappMessage: string;
  /** Pesos per dollar, used only for the approximate USD price. */
  mxnPerUsd: number;
  projects: Record<string, { kind: string; summary: string; status: string }>;
  packages: { name: string; for: string; features: string[]; delivery: string }[];
  pricingNotes: string[];
  steps: { title: string; text: string }[];
  support: { title: string; tag: string; text: string; items: string[] }[];
  supportNote: string;
  ownership: string;
}

/** Edit data/portafolio.en.json — same order as the Spanish file. */
export const PORTFOLIO_EN: PortfolioEnglish = dataEn as PortfolioEnglish;

/** Approximate USD, rounded to the nearest $10. */
export function approxUsd(mxn: number): string {
  return `$${(Math.round(mxn / PORTFOLIO_EN.mxnPerUsd / 10) * 10).toLocaleString("en-US")}`;
}

export function whatsappLink(message = PORTFOLIO.whatsappMessage): string {
  return `https://wa.me/${PORTFOLIO.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function formatPrice(value: number): string {
  return `$${value.toLocaleString("es-MX")}`;
}
