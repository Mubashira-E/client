"use client";

import type { UserDetails } from "@/queries/auth/useGetUserDetailsQuery";
import type { RoomType } from "@/queries/masters/rooms/room-type/useGetAllRoomTypeQuery";
import { CheckCircle, ChevronDown, ChevronUp, Edit, MoreHorizontal, Trash2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { parseAsString, useQueryState } from "nuqs";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeleteConfirmationModal } from "@/lib/components/delete-confirmation-modal";
import { cn } from "@/lib/utils";
import { hasPermission } from "@/lib/utils/auth";
import { useGetUserDetailsQuery } from "@/queries/auth/useGetUserDetailsQuery";
import { useDeleteRoomTypeMutation } from "@/queries/masters/rooms/room-type/useDeleteRoomTypeMutation";
import { useGetAllRoomTypeQuery } from "@/queries/masters/rooms/room-type/useGetAllRoomTypeQuery";
import { usePatchRoomTypeStatusMutation } from "@/queries/masters/rooms/room-type/usePatchRoomTypeStatusMutation";
import { RoomTypeTableEmpty } from "./room-type-table-empty";
import { RoomTypeTableError } from "./room-type-table-error";
import { RoomTypeTableLoader } from "./room-type-table-loader";

function RoomTypeTableRow({ item, userDetails }: { item: RoomType; userDetails: UserDetails | undefined }) {
  const router = useRouter();
  const patchMutation = usePatchRoomTypeStatusMutation(item.roomTypeId);
  const deleteMutation = useDeleteRoomTypeMutation(item.roomTypeId);
  const isActive = item.status?.toLowerCase() === "active";
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const canUpdate = hasPermission(userDetails, "RoomType.Update");
  const canDelete = hasPermission(userDetails, "RoomType.Delete");
  const hasAnyAction = canUpdate || canDelete;

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Room type deleted successfully");
        setShowDeleteModal(false);
      },
      onError: () => {
        toast.error("Failed to delete room type");
      },
    });
  };

  return (
    <>
      <TableRow key={item.roomTypeId} className="hover:bg-gray-50">
        <TableCell className="pl-4 min-w-[180px] whitespace-nowrap">
          <div className="overflow-hidden text-ellipsis max-w-[250px]">{item.typeName}</div>
        </TableCell>
        <TableCell className="pl-4 min-w-[180px] whitespace-nowrap">
          <div className="overflow-hidden text-ellipsis max-w-[250px]">{item.description}</div>
        </TableCell>
        <TableCell className="pl-4 min-w-[180px] whitespace-nowrap">
          <Badge variant={isActive ? "default" : "secondary"}>
            {item.status || "Unknown"}
          </Badge>
        </TableCell>
        {hasAnyAction && (
          <TableCell className="sticky right-0 z-20 min-w-[100px] bg-white shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.1)]">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {canUpdate && (
                  <DropdownMenuItem onClick={() => router.push(`/masters/rooms/room-type/${item.roomTypeId}/edit?roomTypeId=${item.roomTypeId}`)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                )}
                {canUpdate && (
                  <DropdownMenuItem
                    onClick={() => {
                      patchMutation.mutate(
                        { isActive: !isActive },
                        {
                          onSuccess: () => {
                            toast.success(
                              `Room type ${!isActive ? "activated" : "deactivated"} successfully`,
                            );
                          },
                          onError: () => {
                            toast.error("Failed to update room type status");
                          },
                        },
                      );
                    }}
                    disabled={patchMutation.isPending}
                  >
                    {isActive
                      ? (
                          <>
                            <XCircle className="h-4 w-4 mr-2 text-red-600" />
                            <span className="text-red-600">Inactive</span>
                          </>
                        )
                      : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                            <span className="text-green-600">Active</span>
                          </>
                        )}
                  </DropdownMenuItem>
                )}
                {canDelete && (
                  <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600">
                    <Trash2 className="h-4 w-4 mr-2 text-red-600" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        )}
        {!hasAnyAction && (
          <TableCell className="sticky right-0 z-20 min-w-[100px] bg-white shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.1)]" />
        )}
      </TableRow>

      <DeleteConfirmationModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete Room Type"
        description="This action cannot be undone."
        itemName={item.typeName}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
}

export function RoomTypeTable() {
  const { data: userDetails } = useGetUserDetailsQuery();
  const [searchFilter] = useQueryState("searchFilter", parseAsString.withDefault(""));
  const [sortColumn, setSortColumn] = useQueryState("sort", parseAsString.withDefault("typeName"));
  const [sortDirection, setSortDirection] = useQueryState("order", parseAsString.withDefault("asc"));

  const { roomTypes, isPending, isError } = useGetAllRoomTypeQuery({
    searchTerms: searchFilter,
    orderBy: sortColumn,
    sortDirection: sortDirection === "asc" ? "ascending" : "descending",
  });

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    }
    else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  return (
    <section className="space-y-4">
      <div className="rounded-md border overflow-hidden">
        {isPending
          ? (
              <RoomTypeTableLoader />
            )
          : (
              <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
                <Table>
                  <TableHeader className="sticky top-0 z-10 bg-white">
                    <TableRow>
                      <TableHead
                        className={cn(
                          "cursor-pointer hover:bg-gray-100 select-none",
                          "relative pl-4 min-w-[180px] whitespace-nowrap",
                        )}
                        onClick={() => handleSort("typeName")}
                      >
                        <div className="flex items-center gap-2">
                          Type Name
                          <div className="flex flex-col">
                            {sortColumn === "typeName" && sortDirection === "asc" && <ChevronUp className="h-3 w-3" />}
                            {sortColumn === "typeName" && sortDirection === "desc" && <ChevronDown className="h-3 w-3" />}
                            {sortColumn !== "typeName" && (
                              <div className="flex flex-col">
                                <ChevronUp className="h-3 w-3 text-gray-400" />
                                <ChevronDown className="h-3 w-3 text-gray-400 -mt-1" />
                              </div>
                            )}
                          </div>
                        </div>
                      </TableHead>
                      <TableHead
                        className={cn(
                          "cursor-pointer hover:bg-gray-100 select-none",
                          "relative pl-4 min-w-[180px] whitespace-nowrap",
                        )}
                        onClick={() => handleSort("description")}
                      >
                        <div className="flex items-center gap-2">
                          Description
                          <div className="flex flex-col">
                            {sortColumn === "description" && sortDirection === "asc" && <ChevronUp className="h-3 w-3" />}
                            {sortColumn === "description" && sortDirection === "desc" && <ChevronDown className="h-3 w-3" />}
                            {sortColumn !== "description" && (
                              <div className="flex flex-col">
                                <ChevronUp className="h-3 w-3 text-gray-400" />
                                <ChevronDown className="h-3 w-3 text-gray-400 -mt-1" />
                              </div>
                            )}
                          </div>
                        </div>
                      </TableHead>
                      <TableHead
                        className={cn(
                          "cursor-pointer hover:bg-gray-100 select-none",
                          "relative pl-4 min-w-[180px] whitespace-nowrap",
                        )}
                        onClick={() => handleSort("status")}
                      >
                        <div className="flex items-center gap-2">
                          Status
                          <div className="flex flex-col">
                            {sortColumn === "status" && sortDirection === "asc" && <ChevronUp className="h-3 w-3" />}
                            {sortColumn === "status" && sortDirection === "desc" && <ChevronDown className="h-3 w-3" />}
                            {sortColumn !== "status" && (
                              <div className="flex flex-col">
                                <ChevronUp className="h-3 w-3 text-gray-400" />
                                <ChevronDown className="h-3 w-3 text-gray-400 -mt-1" />
                              </div>
                            )}
                          </div>
                        </div>
                      </TableHead>
                      <TableHead className="sticky right-0 z-20 min-w-[100px] bg-white shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.1)]">
                        <span className="font-semibold">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isError && <RoomTypeTableError />}
                    {!isError && roomTypes.length === 0 && <RoomTypeTableEmpty />}
                    {!isError && roomTypes.length > 0 && (
                      roomTypes.map((item: RoomType) => (
                        <RoomTypeTableRow key={item.roomTypeId} item={item} userDetails={userDetails} />
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
      </div>
    </section>
  );
}
