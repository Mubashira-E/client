"use client";

import type { UserDetails } from "@/queries/auth/useGetUserDetailsQuery";
import type { Room } from "@/queries/masters/rooms/useGetAllRoomsQuery";
import {
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronUp,
  Edit,
  MapPin,
  MoreHorizontal,
  Trash2,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteConfirmationModal } from "@/lib/components/delete-confirmation-modal";
import { cn } from "@/lib/utils";
import { hasPermission } from "@/lib/utils/auth";
import { useGetUserDetailsQuery } from "@/queries/auth/useGetUserDetailsQuery";
import { useDeleteRoomMutation } from "@/queries/masters/rooms/useDeleteRoomMutation";
import { useGetAllRoomsQuery } from "@/queries/masters/rooms/useGetAllRoomsQuery";
import { usePatchRoomStatusMutation } from "@/queries/masters/rooms/usePatchRoomStatusMutation";
import { useRoomManagementStore } from "../../stores/useRoomManagementStore";
import { RoomManagementTableEmpty } from "./room-management-table-empty";
import { RoomManagementTableError } from "./room-management-table-error";
import { RoomManagementTableLoader } from "./room-management-table-loader";

function RoomManagementTableRow({ room, visibleColumns, userDetails }: { room: Room; visibleColumns: string[]; userDetails: UserDetails | undefined }) {
  const router = useRouter();
  const patchMutation = usePatchRoomStatusMutation(room.roomId);
  const deleteMutation = useDeleteRoomMutation(room.roomId);
  const isActive = room.status?.toLowerCase() === "active";
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const canUpdate = hasPermission(userDetails, "Room.Update");
  const canDelete = hasPermission(userDetails, "Room.Delete");
  const hasAnyAction = canUpdate || canDelete;

  const handleEdit = (roomId: string) => {
    router.push(`/masters/rooms/edit/${roomId}`);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Room deleted successfully");
        setShowDeleteModal(false);
      },
      onError: () => {
        toast.error("Failed to delete room");
      },
    });
  };

  return (
    <>
      <TableRow key={room.roomId} className="hover:bg-gray-50">
        {visibleColumns.includes("roomName") && (
          <TableCell className="pl-4 min-w-[180px] whitespace-nowrap">
            <div className="font-medium overflow-hidden text-ellipsis max-w-[250px]">{room.roomName}</div>
          </TableCell>
        )}
        {visibleColumns.includes("roomType") && (
          <TableCell className="pl-4 min-w-[180px] whitespace-nowrap">
            <Badge variant="outline">{room.roomType}</Badge>
          </TableCell>
        )}
        {visibleColumns.includes("roomLocation") && (
          <TableCell className="pl-4 min-w-[180px] whitespace-nowrap">
            <div className="text-sm flex items-center gap-1 overflow-hidden text-ellipsis max-w-[250px]">
              <MapPin className="h-3 w-3" />
              {room.roomLocation}
            </div>
          </TableCell>
        )}
        {visibleColumns.includes("remarks") && (
          <TableCell className="pl-4 min-w-[180px] whitespace-nowrap">
            <div className="text-sm text-muted-foreground overflow-hidden text-ellipsis max-w-[250px]">
              {room.remarks || "No remarks"}
            </div>
          </TableCell>
        )}
        {visibleColumns.includes("status") && (
          <TableCell className="pl-4 min-w-[180px] whitespace-nowrap">
            <Badge
              className={
                isActive
                  ? "bg-primary text-primary-foreground hover:bg-primary/80"
                  : "bg-red-500 text-white hover:bg-red-500/80"
              }
            >
              {isActive ? "Active" : "Inactive"}
            </Badge>
          </TableCell>
        )}
        {hasAnyAction && (
          <TableCell className="sticky right-0 z-20 min-w-[100px] bg-white shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.1)]">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {canUpdate && (
                  <DropdownMenuItem onClick={() => handleEdit(room.roomId)}>
                    <Edit className="size-4 mr-2" />
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
                              `Room ${!isActive ? "activated" : "deactivated"} successfully`,
                            );
                          },
                          onError: () => {
                            toast.error("Failed to update room status");
                          },
                        },
                      );
                    }}
                    disabled={patchMutation.isPending}
                  >
                    {isActive
                      ? (
                          <>
                            <XCircle className="size-4 mr-2 text-red-600" />
                            <span className="text-red-600">Inactive</span>
                          </>
                        )
                      : (
                          <>
                            <CheckCircle className="size-4 mr-2 text-green-600" />
                            <span className="text-green-600">Active</span>
                          </>
                        )}
                  </DropdownMenuItem>
                )}
                {canDelete && (
                  <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="size-4 mr-2 text-red-600" />
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
        title="Delete Room"
        description="This action cannot be undone."
        itemName={room.roomName}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
}

export function RoomManagementTable() {
  const { visibleColumns } = useRoomManagementStore();
  const { data: userDetails } = useGetUserDetailsQuery();
  const [searchFilter] = useQueryState(
    "searchFilter",
    parseAsString.withDefault(""),
  );
  const [currentPage, setCurrentPage] = useQueryState(
    "currentPage",
    parseAsInteger.withDefault(1),
  );
  const [sortColumn, setSortColumn] = useQueryState("sort", parseAsString.withDefault("roomName"));
  const [sortDirection, setSortDirection] = useQueryState("order", parseAsString.withDefault("asc"));

  const { rooms, totalPages, isPending, isError } = useGetAllRoomsQuery({
    pageSize: 10,
    orderBy: sortColumn,
    sortDirection: sortDirection === "asc" ? "ascending" : "descending",
    searchTerms: searchFilter,
    pageNumber: currentPage,
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
    <div className="rounded-md border bg-white overflow-hidden">
      {isPending
        ? (
            <RoomManagementTableLoader />
          )
        : (
            <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-white">
                  <TableRow>
                    {visibleColumns.includes("roomName") && (
                      <TableHead
                        className={cn(
                          "cursor-pointer hover:bg-gray-100 select-none",
                          "relative pl-4 min-w-[180px] whitespace-nowrap",
                        )}
                        onClick={() => handleSort("roomName")}
                      >
                        <div className="flex items-center gap-2">
                          Room Name
                          <div className="flex flex-col">
                            {sortColumn === "roomName" && sortDirection === "asc" && <ChevronUp className="h-3 w-3" />}
                            {sortColumn === "roomName" && sortDirection === "desc" && <ChevronDown className="h-3 w-3" />}
                            {sortColumn !== "roomName" && (
                              <div className="flex flex-col">
                                <ChevronUp className="h-3 w-3 text-gray-400" />
                                <ChevronDown className="h-3 w-3 text-gray-400 -mt-1" />
                              </div>
                            )}
                          </div>
                        </div>
                      </TableHead>
                    )}
                    {visibleColumns.includes("roomType") && (
                      <TableHead
                        className={cn(
                          "cursor-pointer hover:bg-gray-100 select-none",
                          "relative pl-4 min-w-[180px] whitespace-nowrap",
                        )}
                        onClick={() => handleSort("roomType")}
                      >
                        <div className="flex items-center gap-2">
                          Room Type
                          <div className="flex flex-col">
                            {sortColumn === "roomType" && sortDirection === "asc" && <ChevronUp className="h-3 w-3" />}
                            {sortColumn === "roomType" && sortDirection === "desc" && <ChevronDown className="h-3 w-3" />}
                            {sortColumn !== "roomType" && (
                              <div className="flex flex-col">
                                <ChevronUp className="h-3 w-3 text-gray-400" />
                                <ChevronDown className="h-3 w-3 text-gray-400 -mt-1" />
                              </div>
                            )}
                          </div>
                        </div>
                      </TableHead>
                    )}
                    {visibleColumns.includes("roomLocation") && (
                      <TableHead
                        className={cn(
                          "cursor-pointer hover:bg-gray-100 select-none",
                          "relative pl-4 min-w-[180px] whitespace-nowrap",
                        )}
                        onClick={() => handleSort("roomLocation")}
                      >
                        <div className="flex items-center gap-2">
                          Location
                          <div className="flex flex-col">
                            {sortColumn === "roomLocation" && sortDirection === "asc" && <ChevronUp className="h-3 w-3" />}
                            {sortColumn === "roomLocation" && sortDirection === "desc" && <ChevronDown className="h-3 w-3" />}
                            {sortColumn !== "roomLocation" && (
                              <div className="flex flex-col">
                                <ChevronUp className="h-3 w-3 text-gray-400" />
                                <ChevronDown className="h-3 w-3 text-gray-400 -mt-1" />
                              </div>
                            )}
                          </div>
                        </div>
                      </TableHead>
                    )}
                    {visibleColumns.includes("remarks") && (
                      <TableHead
                        className={cn(
                          "cursor-pointer hover:bg-gray-100 select-none",
                          "relative pl-4 min-w-[180px] whitespace-nowrap",
                        )}
                        onClick={() => handleSort("remarks")}
                      >
                        <div className="flex items-center gap-2">
                          Remarks
                          <div className="flex flex-col">
                            {sortColumn === "remarks" && sortDirection === "asc" && <ChevronUp className="h-3 w-3" />}
                            {sortColumn === "remarks" && sortDirection === "desc" && <ChevronDown className="h-3 w-3" />}
                            {sortColumn !== "remarks" && (
                              <div className="flex flex-col">
                                <ChevronUp className="h-3 w-3 text-gray-400" />
                                <ChevronDown className="h-3 w-3 text-gray-400 -mt-1" />
                              </div>
                            )}
                          </div>
                        </div>
                      </TableHead>
                    )}
                    {visibleColumns.includes("status") && (
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
                    )}
                    <TableHead className="sticky right-0 z-20 min-w-[100px] bg-white shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.1)]">
                      <span className="font-semibold">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isError && <RoomManagementTableError />}
                  {!isError && rooms.length === 0 && <RoomManagementTableEmpty />}
                  {!isError
                    && rooms.length > 0
                    && rooms.map(room => (
                      <RoomManagementTableRow key={room.roomId} room={room} visibleColumns={visibleColumns} userDetails={userDetails} />
                    ))}
                </TableBody>
              </Table>
            </div>
          )}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3">
          <div className="text-sm text-muted-foreground">
            Showing page
            {" "}
            {currentPage}
            {" "}
            of
            {" "}
            {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1 || isPending}
            >
              <ChevronsLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1 || isPending}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="text-sm">
              Page
              {" "}
              {currentPage}
              {" "}
              of
              {" "}
              {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages || isPending}
            >
              <ChevronRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages || isPending}
            >
              <ChevronsRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
