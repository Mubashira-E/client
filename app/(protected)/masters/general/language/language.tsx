import { Plus, SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { parseAsString, useQueryState } from "nuqs";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { allColumns, areAllColumnsSelected } from "./components/data";
import { LanguageTable } from "./components/language-table";
import { useLanguageStore } from "./stores/useLanguageStore";

export function Language() {
  const router = useRouter();
  const { visibleColumns, setVisibleColumns, selectAllColumns, deselectAllColumns } = useLanguageStore();

  const [searchFilter, setSearchFilter] = useQueryState("searchFilter", parseAsString.withDefault(""));
  const toggleColumn = (columnId: string) => {
    if (visibleColumns.includes(columnId) && visibleColumns.length === 1) {
      return;
    }

    setVisibleColumns(visibleColumns.includes(columnId) ? visibleColumns.filter(id => id !== columnId) : [...visibleColumns, columnId]);
  };

  const isAllSelected = areAllColumnsSelected(visibleColumns);

  return (
    <section className="flex flex-col gap-4">
      <Suspense>
        <div className="flex items-end justify-end gap-2">
          <Input
            value={searchFilter}
            className="w-36"
            placeholder="Filter Languages"
            onChange={e => setSearchFilter(e.target.value)}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Columns
                <SlidersHorizontal className="size-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[280px] max-h-[300px] overflow-y-auto">
              <DropdownMenuCheckboxItem
                checked={isAllSelected}
                onCheckedChange={() => isAllSelected ? deselectAllColumns() : selectAllColumns()}
                className="text-xs whitespace-normal break-words leading-tight py-2 font-medium"
              >
                <span className="block w-full">
                  {isAllSelected ? "Deselect All Columns" : "Select All Columns"}
                </span>
              </DropdownMenuCheckboxItem>

              <div className="h-px bg-gray-200 my-1" />

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
          <Button variant="default" onClick={() => router.push("/masters/general/language/create")}>
            Add Language
            <Plus className="size-4" />
          </Button>
        </div>
        <LanguageTable />
      </Suspense>
    </section>
  );
}
