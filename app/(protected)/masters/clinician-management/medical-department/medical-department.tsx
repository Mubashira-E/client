import { Plus, SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { parseAsString, useQueryState } from "nuqs";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { hasPermission } from "@/lib/utils/auth";
import { useGetUserDetailsQuery } from "@/queries/auth/useGetUserDetailsQuery";
import { allColumns, areAllColumnsSelected } from "./components/data";
import { MedicalDepartmentHeader } from "./components/medical-department-header";
import { MedicalDepartmentTable } from "./components/medical-department-table";
import { useMedicalDepartmentStore } from "./stores/useMedicalDepartmentStore";

export function MedicalDepartment() {
  const router = useRouter();
  const { data: userDetails } = useGetUserDetailsQuery();
  const { visibleColumns, setVisibleColumns, selectAllColumns, deselectAllColumns } = useMedicalDepartmentStore();

  const canCreate = hasPermission(userDetails, "Department.Create");

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
      <MedicalDepartmentHeader />
      <Suspense>
        <div className="flex items-end justify-end gap-2">
          <Input
            value={searchFilter}
            className="w-56"
            placeholder="Filter Medical Departments"
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
          {canCreate && (
            <Button variant="default" onClick={() => router.push("/masters/clinician-management/medical-department/create")}>
              Add Medical Department
              <Plus className="size-4" />
            </Button>
          )}
        </div>
        <MedicalDepartmentTable />
      </Suspense>
    </section>
  );
}
