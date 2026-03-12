"use client";

import { Funnel, SearchIcon, SlidersHorizontal } from "lucide-react";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { allPatientColumns } from "./data";
import { PatientManagementHeader } from "./patient-management-header";
import { usePatientManagementStore } from "./stores/usePatientManagementStore";
import { PatientManagementTable } from "./table/patient-management-table";

export function PatientManagementContainer() {
  const { visibleColumns, setVisibleColumns, selectAllColumns, deselectAllColumns } = usePatientManagementStore();
  const allColumns = allPatientColumns;

  const [searchFilter, setSearchFilter] = useQueryState("searchFilter", parseAsString.withDefault(""));
  const [nationalityFilter, setNationalityFilter] = useQueryState("nationalityFilter", parseAsString.withDefault(""));
  const [isFilterOpen, setIsFilterOpen] = useQueryState("isFilterOpen", parseAsInteger.withDefault(0));

  const toggleColumn = (columnId: string) => {
    if (visibleColumns.includes(columnId) && visibleColumns.length === 1) {
      return;
    }

    setVisibleColumns(visibleColumns.includes(columnId) ? visibleColumns.filter(id => id !== columnId) : [...visibleColumns, columnId]);
  };

  const clearFilters = () => {
    setSearchFilter("");
    setNationalityFilter("");
  };

  const hasActiveFilters = searchFilter !== "" || nationalityFilter !== "";

  const nationalityOptions = [
    { value: "UAE", label: "UAE" },
    { value: "USA", label: "USA" },
    { value: "India", label: "India" },
    { value: "Egypt", label: "Egypt" },
    { value: "Pakistan", label: "Pakistan" },
    { value: "Philippines", label: "Philippines" },
    { value: "Jordan", label: "Jordan" },
    { value: "Lebanon", label: "Lebanon" },
  ];

  return (
    <section className="flex flex-col gap-4 bg-white p-4 border rounded-md mt-4">
      <PatientManagementHeader />
      <div className="flex flex-col bg-white rounded-lg">
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-lg gap-4">
          <div className="hidden lg:flex">
            <h2 className="text-lg font-medium text-gray-800">Patient List</h2>
          </div>
          <div className="flex items-center gap-2 sm:w-auto ml-auto">
            <div className="relative w-[240px]">
              <Input
                value={searchFilter}
                className="w-full pl-10"
                placeholder="Search patients..."
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
                <div className="flex items-end gap-2 justify-end">
                  <Select value={nationalityFilter} onValueChange={setNationalityFilter}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Filter by nationality" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[400px] overflow-y-auto">
                      <SelectGroup>
                        {nationalityOptions?.map(item => (
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
        <PatientManagementTable />
      </div>
    </section>
  );
}
