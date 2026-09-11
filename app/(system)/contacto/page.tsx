import Panel from "@/components/Panel";
import { SITE_CONFIG } from "@/lib/site-config";

export const metadata = { title: "CONTACT // REDGHOST_OS" };

export default function ContactoPage() {
  return (
    <div className="flex flex-col gap-5">
      <Panel id="MOD_100" title="Contact Channel" status={{ label: "OPEN" }}>
        <p className="text-xs text-[var(--rg-text-dim)] leading-relaxed mb-5">
          Canales directos de contacto con RedGhost.
        </p>

        <div
          className="flex items-center justify-between py-3 border-t"
          style={{ borderColor: "var(--rg-red-line-soft)" }}
        >
          <span className="flex items-center gap-2 text-sm tracking-[0.1em] text-[var(--rg-text)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--rg-green)]" />
            EMAIL
          </span>
          <a
            href={`mailto:${SITE_CONFIG.email}`}
            className="rg-action-link text-[11px] tracking-[0.1em] border px-3 py-1.5"
          >
            {SITE_CONFIG.email}
          </a>
        </div>

        {SITE_CONFIG.socials.map((social) => (
          <div
            key={social.label}
            className="flex items-center justify-between py-3 border-t"
            style={{ borderColor: "var(--rg-red-line-soft)" }}
          >
            <span className="flex items-center gap-2 text-sm tracking-[0.15em] text-[var(--rg-text)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--rg-green)]" />
              {social.label}
            </span>
            <a
              href={social.href}
              className="rg-action-link text-[10px] tracking-[0.15em] border px-3 py-1.5"
            >
              [ CONNECT ]
            </a>
          </div>
        ))}
      </Panel>
    </div>
  );
}
