"use client";

import { Plus, SearchIcon, SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { parseAsString, useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { hasPermission } from "@/lib/utils/auth";
import { useGetUserDetailsQuery } from "@/queries/auth/useGetUserDetailsQuery";
import { useRoomManagementStore } from "../stores/useRoomManagementStore";
import { allColumns } from "./data";
import { RoomHeader } from "./room-header";
import { RoomManagementTable } from "./table/room-management-table";

export function RoomManagementContainer() {
  const { visibleColumns, setVisibleColumns, selectAllColumns, deselectAllColumns } = useRoomManagementStore();
  const router = useRouter();
  const { data: userDetails } = useGetUserDetailsQuery();

  const canCreate = hasPermission(userDetails, "Room.Create");

  const [searchFilter, setSearchFilter] = useQueryState("searchFilter", parseAsString.withDefault(""));

  const toggleColumn = (columnId: string) => {
    if (visibleColumns.includes(columnId) && visibleColumns.length === 1) {
      return;
    }

    setVisibleColumns(visibleColumns.includes(columnId) ? visibleColumns.filter(id => id !== columnId) : [...visibleColumns, columnId]);
  };

  return (
    <section className="flex flex-col gap-4 bg-white p-2 sm:p-4 border rounded-md mt-4">
      <RoomHeader />
      <div className="flex flex-col bg-white rounded-lg">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between bg-white p-3 sm:p-4 rounded-lg gap-3">
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 w-full sm:w-auto sm:ml-auto">
            <div className="relative w-full sm:w-[200px] md:w-[240px] lg:w-[280px]">
              <Input
                value={searchFilter}
                className="w-full pl-10"
                placeholder="Search rooms..."
                onChange={e => setSearchFilter(e.target.value)}
              />
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex-1 sm:flex-none whitespace-nowrap">
                    <span className="hidden md:inline">Columns</span>
                    <span className="md:hidden">Cols</span>
                    <SlidersHorizontal className="size-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
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
              {canCreate && (
                <Button
                  variant="default"
                  className="flex-1 sm:flex-none whitespace-nowrap"
                  onClick={() => router.push("/masters/rooms/create")}
                >
                  <span className="hidden sm:inline">Add Room</span>
                  <span className="sm:hidden">Add</span>
                  <Plus className="size-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </div>
        <RoomManagementTable />
      </div>
    </section>
  );
}
