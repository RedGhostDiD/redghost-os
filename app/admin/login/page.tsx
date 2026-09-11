import { signIn, auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  if (session?.user) redirect("/admin");

  const { error } = await searchParams;

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh gap-6 px-4">
      <div className="text-center">
        <h1
          className="text-lg tracking-[0.3em]"
          style={{ color: "var(--rg-red)", textShadow: "0 0 12px var(--rg-red)" }}
        >
          REDGHOST.OS — ADMIN
        </h1>
        <p className="text-xs mt-2 tracking-[0.15em]" style={{ color: "var(--rg-text-faint)" }}>
          ACCESO RESTRINGIDO
        </p>
      </div>

      {error && (
        <p
          className="text-xs tracking-[0.1em] border px-3 py-2 max-w-xs text-center"
          style={{ borderColor: "var(--rg-red-line)", color: "var(--rg-red-soft)" }}
        >
          Acceso denegado. Esta cuenta de GitHub no tiene permisos de administrador.
        </p>
      )}

      <form
        action={async () => {
          "use server";
          await signIn("github", { redirectTo: "/admin" });
        }}
      >
        <button
          type="submit"
          className="text-xs tracking-[0.15em] px-4 py-2.5 border transition-colors"
          style={{ borderColor: "var(--rg-red-line)", color: "var(--rg-text)" }}
        >
          INICIAR SESIÓN CON GITHUB
        </button>
      </form>
    </div>
  );
}
