import type { Metadata } from "next";
import { InventoryTabs } from "./inventory-tabs";

export const metadata: Metadata = {
  title: "E-Medical Record / Inventory",
  description: "E-Medical Record / Inventory",
};

export default function InventoryPage() {
  return <InventoryTabs />;
}
