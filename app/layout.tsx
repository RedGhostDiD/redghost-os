import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { AudioProvider } from "@/lib/audio";
import BinaryRain from "@/components/decor/BinaryRain";
import GhostCode from "@/components/decor/GhostCode";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "REDGHOST_OS",
  description: "RedGhost.OS — el sistema personal de RedGhost, creador de DiD (dibujo, inteligencia, desarrollo).",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${jetbrainsMono.variable} h-full`}>
      <body className="min-h-full antialiased">
        <AudioProvider>
          <div className="rg-atmosphere" aria-hidden="true" />
          <BinaryRain />
          <GhostCode />
          <div className="rg-grain" aria-hidden="true" />
          <div className="rg-content min-h-dvh flex flex-col">{children}</div>
        </AudioProvider>
      </body>
    </html>
  );
}
