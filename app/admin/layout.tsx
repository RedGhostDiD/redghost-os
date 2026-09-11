import type { Metadata } from "next";

export const metadata: Metadata = { title: "ADMIN // REDGHOST_OS" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-dvh"
      style={{ background: "var(--rg-void)", color: "var(--rg-text)" }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-5">
        {children}
      </div>
    </div>
  );
}
