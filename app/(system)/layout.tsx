import Nav from "@/components/Nav";
import SystemClock from "@/components/SystemClock";
import CornerHUD from "@/components/CornerHUD";
import { SITE_CONFIG } from "@/lib/site-config";

export default function SystemLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="rg-grid-matrix" aria-hidden="true" />
      <CornerHUD />
      <Nav />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
      <footer className="rg-neo-footer text-[10px] tracking-[0.15em] text-[var(--rg-text-faint)] px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex flex-wrap gap-x-6 gap-y-1">
          <span>REDGHOST.OS BUILD {SITE_CONFIG.buildVersion}</span>
          <span className="rg-glow-green" style={{ color: "var(--rg-green)" }}>
            ● SYSTEM ONLINE
          </span>
          <span className="rg-glow-green" style={{ color: "var(--rg-green)" }}>
            ● DiD BRAND ACTIVE {SITE_CONFIG.didBrandVersion}
          </span>
        </div>
        <SystemClock />
      </footer>
    </>
  );
}
