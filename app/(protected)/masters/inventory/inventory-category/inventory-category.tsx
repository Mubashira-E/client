"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { parseAsString, useQueryState } from "nuqs";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { hasPermission } from "@/lib/utils/auth";
import { useGetUserDetailsQuery } from "@/queries/auth/useGetUserDetailsQuery";
import { InventoryCategoryHeader } from "./components/inventory-category-header";
import { InventoryCategoryTable } from "./components/inventory-category-table";

export function InventoryCategory() {
  const router = useRouter();
  const { data: userDetails } = useGetUserDetailsQuery();
  const [searchFilter, setSearchFilter] = useQueryState("searchFilter", parseAsString.withDefault(""));

  const canCreate = hasPermission(userDetails, "InventoryCategory.Create");

  return (
    <section className="flex flex-col gap-4 bg-white p-4 border rounded-md mt-4">
      <InventoryCategoryHeader />
      <Suspense>
        <div className="flex items-end justify-end gap-2">
          <Input
            value={searchFilter}
            className="w-36"
            placeholder="Filter Categories"
            onChange={e => setSearchFilter(e.target.value)}
          />
          {canCreate && (
            <Button variant="default" onClick={() => router.push("/masters/inventory/inventory-category/create")}>
              Add Category
              <Plus className="size-4" />
            </Button>
          )}
        </div>
        <InventoryCategoryTable />
      </Suspense>
    </section>
  );
}
