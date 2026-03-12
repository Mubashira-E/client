import type { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { AddInventoryCategoryForm } from "../../create/components/add-inventory-category-form";
import { EditInventoryCategoryHeader } from "./components/edit-inventory-category-header";

export const metadata: Metadata = {
  title: "E-Medical Record / Edit Inventory Category",
  description: "E-Medical Record / Edit Inventory Category",
};

export default async function EditInventoryCategoryPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id as string;

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
        <EditInventoryCategoryHeader />
        <AddInventoryCategoryForm itemCategoryId={id} />
      </section>
    </section>
  );
}
