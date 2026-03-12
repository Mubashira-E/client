"use client";

import { Plus, SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { parseAsString, useQueryState } from "nuqs";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { hasPermission } from "@/lib/utils/auth";
import { useGetUserDetailsQuery } from "@/queries/auth/useGetUserDetailsQuery";
import { useRoomTypeStore } from "../stores/useRoomTypeStore";
import { RoomTypeHeader } from "./components/room-type-header";
import { RoomTypeTable } from "./components/room-type-table";

type Column = {
  id: string;
  name: string;
};

const allColumns: Column[] = [
  { id: "typeName", name: "Type Name" },
  { id: "description", name: "Description" },
];

export function RoomType() {
  const router = useRouter();
  const { data: userDetails } = useGetUserDetailsQuery();
  const [searchFilter, setSearchFilter] = useQueryState("searchFilter", parseAsString.withDefault(""));
  const { visibleColumns, setVisibleColumns, selectAllColumns, deselectAllColumns } = useRoomTypeStore();

  const canCreate = hasPermission(userDetails, "RoomType.Create");

  const toggleColumn = (columnId: string) => {
    if (visibleColumns.includes(columnId) && visibleColumns.length === 1) {
      return;
    }

    setVisibleColumns(visibleColumns.includes(columnId) ? visibleColumns.filter(id => id !== columnId) : [...visibleColumns, columnId]);
  };

  return (
    <section className="flex flex-col gap-4 bg-white p-4 border rounded-md mt-4">
      <RoomTypeHeader />
      <Suspense>
        <div className="flex items-end justify-end gap-2">
          <Input
            value={searchFilter}
            className="w-36"
            placeholder="Filter Room Types"
            onChange={e => setSearchFilter(e.target.value)}
          />
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
            <Button variant="default" onClick={() => router.push("/masters/rooms/room-type/create")}>
              Add Room Type
              <Plus className="size-4" />
            </Button>
          )}
        </div>
        <RoomTypeTable />
      </Suspense>
    </section>
  );
}
