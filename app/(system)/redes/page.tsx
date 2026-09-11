import Panel from "@/components/Panel";
import { SITE_CONFIG } from "@/lib/site-config";

export const metadata = { title: "NETWORK // REDGHOST_OS" };

export default function RedesPage() {
  return (
    <div className="flex flex-col gap-5">
      <Panel id="MOD_090" title="Network" status={{ label: "CONNECTED" }}>
        <p className="text-xs text-[var(--rg-text-dim)] leading-relaxed mb-5">
          Nodos de red conectados al sistema RedGhost.
        </p>
        <ul className="divide-y" style={{ borderColor: "var(--rg-red-line-soft)" }}>
          {SITE_CONFIG.socials.map((social) => (
            <li
              key={social.label}
              className="flex items-center justify-between py-3 border-t first:border-t-0"
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
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
