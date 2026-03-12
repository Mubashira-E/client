"use client";

import { LayoutGrid, ListCollapse, Plus, SearchIcon, SlidersHorizontal, TableProperties } from "lucide-react";
import { useRouter } from "next/navigation";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { hasPermission } from "@/lib/utils/auth";
import { useGetUserDetailsQuery } from "@/queries/auth/useGetUserDetailsQuery";
import { useClinicianManagementStore } from "../stores/useClinicianManagementStore";
import { ClinicianManagementCardContainer } from "./card/clinician-management-card-container";
import { ClinicianManagementHeader } from "./clinician-management-header";
import { getAllColumns } from "./data";
import { ClinicianManagementListCardContainer } from "./list/clinician-management-list-container";
import { ClinicianManagementTable } from "./table/clinician-management-table";

export function ClinicianManagementContainer() {
  const { visibleColumns, setVisibleColumns, selectAllColumns, deselectAllColumns } = useClinicianManagementStore();
  const allColumns = getAllColumns();
  const router = useRouter();
  const { data: userDetails } = useGetUserDetailsQuery();

  const canCreate = hasPermission(userDetails, "Clinician.Create");

  const [view, setView] = useQueryState("view", parseAsString.withDefault("table"));
  const [searchFilter, setSearchFilter] = useQueryState("searchFilter", parseAsString.withDefault(""));
  const [medicalDepartmentId, setMedicalDepartmentId] = useQueryState("medicalDepartmentId", parseAsInteger.withDefault(0));

  const toggleColumn = (columnId: string) => {
    if (visibleColumns.includes(columnId) && visibleColumns.length === 1) {
      return;
    }

    setVisibleColumns(visibleColumns.includes(columnId) ? visibleColumns.filter(id => id !== columnId) : [...visibleColumns, columnId]);
  };

  const clearFilters = () => {
    setSearchFilter("");
    setMedicalDepartmentId(0);
  };

  const hasActiveFilters = searchFilter !== "" || medicalDepartmentId !== 0;

  // const { data: medicalDepartmentDDl } = useGetMedicalDepartmentQuery();

  return (
    <section className="flex flex-col gap-4">
      <ClinicianManagementHeader />
      <div className="flex flex-col bg-white rounded-lg">
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-lg">
          <div className="hidden lg:flex">
            <ToggleGroup type="single" value={view} onValueChange={setView}>
              <ToggleGroupItem value="table">
                <div className="flex items-center gap-1 px-2">
                  <TableProperties className="size-4" />
                  <span className="text-sm">Table</span>
                </div>
              </ToggleGroupItem>
              <ToggleGroupItem value="card">
                <div className="flex items-center gap-1">
                  <LayoutGrid className="size-4" />
                  <span className="text-sm">Card</span>
                </div>
              </ToggleGroupItem>
              <ToggleGroupItem value="list">
                <div className="flex items-center gap-1">
                  <ListCollapse className="size-4" />
                  <span className="text-sm">List</span>
                </div>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="flex justify-end gap-2 sm:w-auto ml-auto">
            {view === "table" && (
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
                  {allColumns.map(column => (
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
            )}
            <div className="relative w-[240px]">
              <Input
                value={searchFilter}
                className="w-full pl-10"
                placeholder="Search clinicians..."
                onChange={e => setSearchFilter(e.target.value)}
              />
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
            </div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="whitespace-nowrap hover:underline"
              >
                Clear
              </Button>
            )}
            {canCreate && (
              <Button
                variant="default"
                onClick={() => router.push("/masters/clinician-management/clinician/create")}
              >
                Add Clinician
                <Plus className="size-4 ml-1" />
              </Button>
            )}
          </div>
        </div>

        {view === "table" && <ClinicianManagementTable />}
        {view === "card" && (
          <ClinicianManagementCardContainer />
        )}
        {view === "list" && (
          <ClinicianManagementListCardContainer />
        )}
      </div>
    </section>
  );
}
