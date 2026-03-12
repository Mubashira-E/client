"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { AddInventoryItemForm } from "../../create/components/add-inventory-item-form";

type EditInventoryPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function EditInventoryPage({ params }: EditInventoryPageProps) {
  const [id, setId] = useState<string>("");

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  if (!id) {
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
            title="Edit Inventory Item"
            description="Update inventory item information and details"
          />
          <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
            Loading inventory item...
          </div>
        </section>
      </section>
    );
  }

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
          title="Edit Inventory Item"
          description="Update inventory item information and details"
        />
        <AddInventoryItemForm inventoryItemId={id} />
      </section>
    </section>
  );
}
