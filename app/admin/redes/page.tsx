import { readSiteConfig } from "@/lib/github-content";
import SiteConfigForm from "../SiteConfigForm";

export const dynamic = "force-dynamic";

export default async function AdminRedesPage() {
  const { config } = await readSiteConfig();

  return (
    <>
      <h1 className="text-sm tracking-[0.2em]" style={{ color: "var(--rg-red)" }}>
        EDITAR REDES / CONTACTO
      </h1>
      <SiteConfigForm initial={config} />
    </>
  );
}
