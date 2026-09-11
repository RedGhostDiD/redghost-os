export interface StoreItem {
  code: string;
  name: string;
  type: "PCB" | "SVG" | "CAD" | "ROBOT" | "ASSET";
  price?: string;
}

/** Placeholder catalog — no checkout wired up yet, visual only. */
export const STORE_ITEMS: StoreItem[] = [
  { code: "PCB_001", name: "Sensor Node Board", type: "PCB", price: "—" },
  { code: "SVG_014", name: "Glitch Icon Pack", type: "SVG", price: "—" },
  { code: "CAD_007", name: "MK47 Chassis Model", type: "CAD", price: "—" },
  { code: "ROBOT_003", name: "Soccer Bot Blueprint", type: "ROBOT", price: "—" },
];
