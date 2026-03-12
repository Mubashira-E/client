import type { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { AddInventoryItemForm } from "./components/add-inventory-item-form";

export const metadata: Metadata = {
  title: "E-Medical Record / Create Inventory",
  description: "E-Medical Record / Create Inventory",
};

export default function CreateInventoryPage() {
  return (
    <section className="flex flex-col gap-4">
      <Link
        href="/masters/inventory"
        className="flex items-center gap-0.5 text-primary"
      >
        <ChevronLeft className="w-4 h-4" />
        <p className="text-sm">Back to Inventory</p>
      </Link>
      <section className="flex flex-col gap-4 px-4 py-6 rounded-md border bg-white">
        <PageHeader
          title="Create Inventory Item"
          description="Add a new item to the inventory management system with all necessary details"
        />
        <AddInventoryItemForm />
      </section>
    </section>
  );
}
