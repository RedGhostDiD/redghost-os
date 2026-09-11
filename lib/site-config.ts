/**
 * Single source of truth for contact + social links, used by /redes and
 * /contacto. Everything here is a placeholder — edit freely.
 */
export const SITE_CONFIG = {
  email: "contacto@redghost.site",
  socials: [
    {
      label: "GITHUB",
      handle: "RedGhostDiD",
      href: "https://github.com/RedGhostDiD",
      avatar: "/social/github.png",
    },
    {
      label: "INSTAGRAM",
      handle: "@redghost.did",
      href: "https://www.instagram.com/redghost.did/",
      avatar: "/social/instagram.jpg",
    },
    { label: "YOUTUBE", href: "#" },
    { label: "TIKTOK", href: "#" },
  ] as { label: string; href: string; handle?: string; avatar?: string }[],
  buildVersion: "2026.09.10",
  didBrandVersion: "v2.7.14",
  lastSystemUpdate: "2026.09.10 // 17:42",
};
