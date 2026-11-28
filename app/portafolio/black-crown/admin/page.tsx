import type { Metadata } from "next";
import Admin from "../_lib/Admin";

export const metadata: Metadata = {
  title: "Panel admin",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <Admin />;
}
