import type { Metadata, Viewport } from "next";
import Tunnel from "@/components/tunel/Tunnel";
import { getTunelPhotos, getTunelSettings } from "@/lib/tunel";
import "./tunel.css";

export const metadata: Metadata = {
  title: "TÚNEL // REDGHOST ARCHIVE",
  description: "REDGHOST // BUILT FROM SCRAPS. MADE TO REMAIN.",
};

export const viewport: Viewport = { themeColor: "#000000" };

export default function TunelPage() {
  const photos = getTunelPhotos().map(({ src, full, year, date }) => ({ src, full, year, date }));
  return <Tunnel photos={photos} grain={getTunelSettings().viewerGrain} />;
}
