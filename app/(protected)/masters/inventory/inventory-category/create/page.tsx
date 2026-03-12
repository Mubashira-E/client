import type { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { AddInventoryCategoryForm } from "./components/add-inventory-category-form";

export const metadata: Metadata = {
  title: "E-Medical Record / Create Inventory Category",
  description: "E-Medical Record / Create Inventory Category",
};

export default function InventoryCategoryCreatePage() {
  return (
    <section className="flex flex-col gap-4">
      <Link
        href="/masters/inventory?tab=category"
        className="flex items-center gap-0.5 text-primary"
      >
        <ChevronLeft className="w-4 h-4" />
        <p className="text-sm">Back to Inventory Categories</p>
      </Link>
      <section className="flex flex-col gap-4 px-4 py-6 rounded-md border bg-white">
        <PageHeader
          title="Create Inventory Category"
          description="Create a new inventory category"
        />
        <AddInventoryCategoryForm />
      </section>
    </section>
  );
}
