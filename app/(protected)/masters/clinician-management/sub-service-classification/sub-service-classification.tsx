"use client";

import { Plus, SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { parseAsString, useQueryState } from "nuqs";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { allColumns, areAllColumnsSelected } from "./components/data";
import { SubServiceClassificationTable } from "./components/sub-service-classification-table";
import { useSubServiceClassificationStore } from "./stores/useSubServiceClassificationStore";

export function SubServiceClassification() {
  const router = useRouter();
  const { visibleColumns, setVisibleColumns, selectAllColumns, deselectAllColumns } = useSubServiceClassificationStore();

  const [searchFilter, setSearchFilter] = useQueryState("searchFilter", parseAsString.withDefault(""));
  const isAllSelected = areAllColumnsSelected(visibleColumns);
  const translatedColumns = allColumns;

  const toggleColumn = (columnId: string) => {
    if (visibleColumns.includes(columnId) && visibleColumns.length === 1) {
      return;
    }

    setVisibleColumns(visibleColumns.includes(columnId) ? visibleColumns.filter(id => id !== columnId) : [...visibleColumns, columnId]);
  };

  return (
    <section className="flex flex-col gap-4">
      <Suspense>
        <div className="flex items-end justify-end gap-2">
          <Input
            value={searchFilter}
            className="w-56"
            placeholder="Filter Sub Service Classifications"
            onChange={e => setSearchFilter(e.target.value)}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Columns
                <SlidersHorizontal className="size-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                checked={isAllSelected}
                onCheckedChange={() => isAllSelected ? deselectAllColumns() : selectAllColumns()}
              >
                {isAllSelected ? "Deselect All" : "Select All"}
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              {translatedColumns.map(column => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={visibleColumns.includes(column.id)}
                  onCheckedChange={() => toggleColumn(column.id)}
                >
                  {column.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="default" onClick={() => router.push("/masters/clinician-management/sub-service-classification/create")}>
            Add Sub Service Classification
            <Plus className="size-4" />
          </Button>
        </div>
        <SubServiceClassificationTable />
      </Suspense>
    </section>
  );
}
