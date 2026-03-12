"use client";

import { Funnel, SearchIcon, SlidersHorizontal } from "lucide-react";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { allVisitColumns } from "./data";
import { useVisitManagementStore } from "./stores/useVisitManagementStore";
import { VisitManagementTable } from "./table/visit-management-table";
import { VisitManagementHeader } from "./visit-management-header";

export function VisitManagementContainer() {
  const { visibleColumns, setVisibleColumns, selectAllColumns, deselectAllColumns } = useVisitManagementStore();
  const allColumns = allVisitColumns;

  const [searchFilter, setSearchFilter] = useQueryState("searchFilter", parseAsString.withDefault(""));
  const [departmentFilter, setDepartmentFilter] = useQueryState("departmentFilter", parseAsString.withDefault(""));
  const [isFilterOpen, setIsFilterOpen] = useQueryState("isFilterOpen", parseAsInteger.withDefault(0));

  const toggleColumn = (columnId: string) => {
    if (visibleColumns.includes(columnId) && visibleColumns.length === 1) {
      return;
    }

    setVisibleColumns(visibleColumns.includes(columnId) ? visibleColumns.filter(id => id !== columnId) : [...visibleColumns, columnId]);
  };

  const clearFilters = () => {
    setSearchFilter("");
    setDepartmentFilter("");
  };

  const hasActiveFilters = searchFilter !== "" || departmentFilter !== "";

  // Mock department options - replace with actual API call
  const departmentOptions = [
    { value: "Cardiology", label: "Cardiology" },
    { value: "Neurology", label: "Neurology" },
    { value: "Emergency", label: "Emergency" },
    { value: "Dermatology", label: "Dermatology" },
    { value: "Surgery", label: "Surgery" },
    { value: "Orthopedics", label: "Orthopedics" },
    { value: "Pediatrics", label: "Pediatrics" },
    { value: "Oncology", label: "Oncology" },
  ];

  return (
    <section className="flex flex-col gap-4 bg-white p-4 border rounded-md mt-4 overflow-hidden">
      <VisitManagementHeader />
      <div className="flex flex-col bg-white rounded-lg overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-lg gap-4">
          <div className="hidden lg:flex">
            <h2 className="text-lg font-medium text-gray-800">Visit List</h2>
          </div>
          <div className="flex items-center gap-2 sm:w-auto ml-auto flex-wrap">
            <div className="relative w-[240px]">
              <Input
                value={searchFilter}
                className="w-full pl-10"
                placeholder="Search visits..."
                onChange={e => setSearchFilter(e.target.value)}
              />
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
            </div>
            <Button variant="outline" onClick={() => setIsFilterOpen(isFilterOpen ? 0 : 1)}>
              Filter
              <Funnel className="size-4 ml-1" />
            </Button>
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
          </div>
        </div>
        {isFilterOpen
          ? (
              <div className="flex flex-col gap-2 bg-white rounded-lg px-4 pb-4">
                <div className="flex items-end gap-2 justify-end flex-wrap">
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Filter by department" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[400px] overflow-y-auto">
                      <SelectGroup>
                        {departmentOptions?.map(item => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
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
                </div>
              </div>
            )
          : null}
        <VisitManagementTable />
      </div>
    </section>
  );
}
