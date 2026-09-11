import siteConfigData from "@/data/site-config.json";

export interface SocialLink {
  label: string;
  href: string;
  handle?: string;
  avatar?: string;
}

export interface SiteConfig {
  email: string;
  socials: SocialLink[];
  buildVersion: string;
  didBrandVersion: string;
  lastSystemUpdate: string;
}

/**
 * Single source of truth for contact + social links, used by /redes,
 * /contacto and the /inicio dashboard. Sourced from data/site-config.json —
 * editable by hand or via the /admin/redes panel.
 */
export const SITE_CONFIG: SiteConfig = siteConfigData as SiteConfig;
