"use client";

import type { Column } from "./data";
import { Plus, SearchIcon, SlidersHorizontal, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { parseAsString, useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { hasPermission } from "@/lib/utils/auth";
import { useGetUserDetailsQuery } from "@/queries/auth/useGetUserDetailsQuery";
import { useTreatmentManagementStore } from "../stores/useTreatmentManagementStore";
import { getAllColumns } from "./data";
import { TreatmentManagementTable } from "./table/treatment-management-table";
import { TreatmentHeader } from "./treatment-header";

export function TreatmentManagementContainer() {
  const { visibleColumns, setVisibleColumns, selectAllColumns, deselectAllColumns } = useTreatmentManagementStore();
  const allColumns = getAllColumns();
  const router = useRouter();
  const { data: userDetails } = useGetUserDetailsQuery();

  const canCreate = hasPermission(userDetails, "IndividualTreatment.Create");

  const [searchFilter, setSearchFilter] = useQueryState("searchFilter", parseAsString.withDefault(""));

  const toggleColumn = (columnId: string) => {
    if (visibleColumns.includes(columnId) && visibleColumns.length === 1) {
      return;
    }

    setVisibleColumns(visibleColumns.includes(columnId) ? visibleColumns.filter(id => id !== columnId) : [...visibleColumns, columnId]);
  };

  return (
    <section className="flex flex-col gap-4">
      <TreatmentHeader />
      <div className="flex flex-col bg-white rounded-lg">
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-lg">

          <div className="flex justify-end gap-2 sm:w-auto ml-auto">
            <div className="relative w-[240px]">
              <Input
                value={searchFilter}
                className="w-full pl-10"
                placeholder="Search treatments..."
                onChange={e => setSearchFilter(e.target.value)}
              />
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="whitespace-nowrap">
                  Columns
                  <SlidersHorizontal className="size-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={selectAllColumns}>
                  Select All
                </DropdownMenuItem>
                <DropdownMenuItem onClick={deselectAllColumns}>
                  Deselect All
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {allColumns.map((column: Column) => (
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

            {canCreate && (
              <Button
                variant="default"
                onClick={() => router.push("/masters/treatment-management/individual-treatments/create")}
              >
                Add Individual Treatment
                <Plus className="size-4 ml-1" />
              </Button>
            )}
            {canCreate && (
              <Button variant="outline" onClick={() => router.push("/masters/treatment-management/individual-treatments/excel-upload")}>
                Upload Excel
                <Upload className="size-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
        <TreatmentManagementTable />

      </div>
    </section>
  );
}
