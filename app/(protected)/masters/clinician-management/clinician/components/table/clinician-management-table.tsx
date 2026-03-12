"use client";

import type { UserDetails } from "@/queries/auth/useGetUserDetailsQuery";
import type { ClinicianResponse } from "@/queries/clinician/useGetAllClinicianQuery";
import { CheckCircle, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronUp, Edit, MoreHorizontal, Trash2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeleteConfirmationModal } from "@/lib/components/delete-confirmation-modal";
import { cn } from "@/lib/utils";
import { hasPermission } from "@/lib/utils/auth";
import { useGetUserDetailsQuery } from "@/queries/auth/useGetUserDetailsQuery";
import { useDeleteClinicianMutation } from "@/queries/clinician/useDeleteClinicianMutation";
import { useGetAllClinicianQuery } from "@/queries/clinician/useGetAllClinicianQuery";
import { usePatchClinicianMutation } from "@/queries/clinician/usePatchClinicianMutation";
import { useClinicianManagementStore } from "../../stores/useClinicianManagementStore";
import { getAllColumns } from "../data";
import { ClinicianManagementTableEmpty } from "./clinician-management-table-empty";
import { ClinicianManagementTableError } from "./clinician-management-table-error";
import { ClinicianManagementTableLoader } from "./clinician-management-table-loader";

type ClinicianPropertyValue = string | number | boolean | undefined;

function renderCellContent(column: string, value: ClinicianPropertyValue): React.ReactNode {
  if (Array.isArray(value)) {
    return `${value.length} items`;
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return value?.toString() || "N/A";
}

function ClinicianManagementTableRow({
  clinician,
  visibleColumns,
  allColumns,
  onEdit,
  userDetails,
}: {
  clinician: ClinicianResponse;
  visibleColumns: string[];
  allColumns: ReturnType<typeof getAllColumns>;
  onEdit: (id: string) => void;
  userDetails: UserDetails | undefined;
}) {
  const patchMutation = usePatchClinicianMutation(clinician.clinicianId);
  const deleteMutation = useDeleteClinicianMutation(clinician.clinicianId);
  const isActive = clinician.status?.toLowerCase() === "active";

  const canUpdate = hasPermission(userDetails, "Clinician.Update");
  const canDelete = hasPermission(userDetails, "Clinician.Delete");
  const hasAnyAction = canUpdate || canDelete;
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Clinician deleted successfully");
        setShowDeleteModal(false);
      },
      onError: () => {
        toast.error("Failed to delete clinician");
      },
    });
  };

  return (
    <>
      <TableRow key={clinician.clinicianId}>
        {allColumns
          .filter(col => visibleColumns.includes(col.id))
          .map((column, index) => (
            <TableCell
              key={`${clinician.clinicianId}-${column.id}`}
              className={cn(
                index === 0 && "!pl-4",
                "min-w-[180px] whitespace-nowrap",
              )}
            >
              {column.id === "status"
                ? (
                    <div className={cn("max-w-18 truncate flex items-center justify-center border", clinician.status === "Active" ? "text-green-800 bg-green-100 rounded-md px-2 py-1 border-green-200" : "text-red-800 bg-red-100 rounded-md px-2 py-1 border-red-200")}>
                      {clinician.status}
                    </div>
                  )
                : (
                    <div className="overflow-hidden text-ellipsis max-w-[250px]" title={String(clinician[column.id as keyof ClinicianResponse] || "N/A")}>
                      {renderCellContent(
                        column.id,
                        clinician[column.id as keyof ClinicianResponse],
                      )}
                    </div>
                  )}
            </TableCell>
          ))}
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
                  <DropdownMenuItem onClick={() => {
                    onEdit(clinician.clinicianId);
                  }}
                  >
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
                              `Clinician ${!isActive ? "activated" : "deactivated"} successfully`,
                            );
                          },
                          onError: () => {
                            toast.error("Failed to update clinician status");
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
        title="Delete Clinician"
        description="This action cannot be undone."
        itemName={clinician.clinicianName}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
}

export function ClinicianManagementTable() {
  const router = useRouter();
  const { data: userDetails } = useGetUserDetailsQuery();

  const { visibleColumns } = useClinicianManagementStore();
  const allColumns = getAllColumns();

  const [searchFilter] = useQueryState("searchFilter", parseAsString.withDefault(""));
  const [currentPage, setCurrentPage] = useQueryState("currentPage", parseAsInteger.withDefault(1));

  const [sortDirection, setSortDirection] = useQueryState("order", parseAsString.withDefault("asc"));
  const [sortColumn, setSortColumn] = useQueryState("sort", parseAsString.withDefault("clinician"));

  const { clinicians, isPending, isError, totalPages } = useGetAllClinicianQuery({
    searchTerms: searchFilter,
    sortOrderBy: sortDirection === "asc",
    pageNumber: currentPage,
  });

  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    }
    else {
      setSortColumn(columnId);
      setSortDirection("asc");
    }
  };

  const handleEditClick = (clinicianId: string) => {
    router.push(`/masters/clinician-management/clinician/${clinicianId}/edit`);
  };

  return (
    <section className="space-y-4">
      <div className="rounded-md border bg-white overflow-hidden">
        {isPending
          ? (
              <div className="flex justify-center items-center h-full">
                <ClinicianManagementTableLoader />
              </div>
            )
          : (
              <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
                {isError || clinicians.length === 0
                  ? (
                      <Table>
                        <TableBody>
                          {isError ? <ClinicianManagementTableError /> : <ClinicianManagementTableEmpty />}
                        </TableBody>
                      </Table>
                    )
                  : (
                      <Table>
                        <TableHeader className="sticky top-0 z-10 bg-white">
                          <TableRow>
                            {allColumns
                              .filter(col => visibleColumns.includes(col.id))
                              .map((column, index) => (
                                <TableHead key={column.id} className={cn("min-w-[180px] whitespace-nowrap")}>
                                  {column.sortable
                                    ? (
                                        <Button
                                          variant="ghost"
                                          onClick={() => handleSort(column.id)}
                                          className={cn("h-8 font-semibold flex items-center gap-1 hover:bg-transparent whitespace-nowrap", index === 0 ? "!pl-2" : "!pl-0")}
                                        >
                                          {column.name}
                                          {sortColumn === column.id && (
                                            sortDirection === "asc"
                                              ? <ChevronUp className="ml-2 size-4" />
                                              : <ChevronDown className="ml-2 size-4" />
                                          )}
                                        </Button>
                                      )
                                    : <span className="font-semibold whitespace-nowrap">{column.name}</span>}
                                </TableHead>
                              ))}
                            <TableHead className="sticky right-0 z-20 min-w-[100px] bg-white shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.1)]">
                              <span className="font-semibold">Actions</span>
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {clinicians.map(clinician => (
                            <ClinicianManagementTableRow
                              key={clinician.clinicianId}
                              clinician={clinician}
                              visibleColumns={visibleColumns}
                              allColumns={allColumns}
                              onEdit={handleEditClick}
                              userDetails={userDetails}
                            />
                          ))}
                        </TableBody>
                      </Table>
                    )}
              </div>
            )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
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
              onClick={() => {
                setCurrentPage(1);
              }}
              disabled={currentPage === 1 || isPending}
            >
              <ChevronsLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={async () => {
                if (currentPage > 1) {
                  setCurrentPage(currentPage - 1);
                }
              }}
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
              onClick={async () => {
                if (currentPage < totalPages) {
                  setCurrentPage(currentPage + 1);
                }
              }}
              disabled={currentPage === totalPages || isPending}
            >
              <ChevronRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setCurrentPage(totalPages);
              }}
              disabled={currentPage === totalPages || isPending}
            >
              <ChevronsRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
