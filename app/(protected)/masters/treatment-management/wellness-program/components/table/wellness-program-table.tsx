"use client";

import type { UserDetails } from "@/queries/auth/useGetUserDetailsQuery";
import type { WellnessProgramResponse } from "@/queries/masters/wellness-program/useGetAllWellnessProgramQuery";
import { CheckCircle, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronUp, Edit, MoreHorizontal, Trash2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeleteConfirmationModal } from "@/lib/components/delete-confirmation-modal";
import { cn } from "@/lib/utils";
import { hasPermission } from "@/lib/utils/auth";
import { useGetUserDetailsQuery } from "@/queries/auth/useGetUserDetailsQuery";
import { useDeleteWellnessProgramMutation } from "@/queries/masters/wellness-program/useDeleteWellnessProgramMutation";
import { useGetAllWellnessProgramQuery } from "@/queries/masters/wellness-program/useGetAllWellnessProgramQuery";
import { usePatchWellnessProgramMutation } from "@/queries/masters/wellness-program/usePatchWellnessProgramMutation";
import { useWellnessProgramManagementStore } from "../../stores/useWellnessProgramManagementStore";
import { getAllColumns } from "../data";
import { WellnessProgramTableEmpty } from "./wellness-program-table-empty";

function WellnessProgramTableRow({ program, visibleColumns, userDetails }: { program: WellnessProgramResponse; visibleColumns: string[]; userDetails: UserDetails | undefined }) {
  const router = useRouter();
  const allColumns = getAllColumns();
  const patchMutation = usePatchWellnessProgramMutation(program.wellnessProgramId);
  const deleteMutation = useDeleteWellnessProgramMutation(program.wellnessProgramId);
  const isActive = program.status?.toLowerCase() === "active";
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const canUpdate = hasPermission(userDetails, "WellnessProgram.Update");
  const canDelete = hasPermission(userDetails, "WellnessProgram.Delete");
  const hasAnyAction = canUpdate || canDelete;

  const handleEdit = (programId: string) => {
    router.push(`/masters/treatment-management/wellness-program/${programId}/edit`);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Wellness program deleted successfully");
        setShowDeleteModal(false);
      },
      onError: () => {
        toast.error("Failed to delete wellness program");
      },
    });
  };

  return (
    <>
      <TableRow key={program.wellnessProgramId}>
        {allColumns
          .filter(column => visibleColumns.includes(column.id))
          .map(column => (
            <TableCell key={column.id} className="min-w-[180px] whitespace-nowrap">
              <div className="overflow-hidden text-ellipsis max-w-[250px]">
                {column.id === "programCode" && (
                  <div className="font-medium">{program.wellnessProgramCode}</div>
                )}
                {column.id === "programName" && (
                  <div className="font-medium">{program.wellnessProgramName}</div>
                )}
                {column.id === "description" && (
                  <div className="text-sm text-muted-foreground line-clamp-2">
                    {program.description || "-"}
                  </div>
                )}
                {column.id === "packages" && (
                  <div className="text-sm">
                    {program.wellnessProgramPackageCount > 0
                      ? (
                          <Badge variant="outline" className="text-xs">
                            {program.wellnessProgramPackageCount}
                            {" "}
                            {program.wellnessProgramPackageCount === 1 ? "Package" : "Packages"}
                          </Badge>
                        )
                      : (
                          <span className="text-muted-foreground">-</span>
                        )}
                  </div>
                )}
                {column.id === "treatments" && (
                  <div className="text-sm">
                    {program.wellnessProgramTreatmentCount > 0
                      ? (
                          <Badge variant="outline" className="text-xs">
                            {program.wellnessProgramTreatmentCount}
                            {" "}
                            {program.wellnessProgramTreatmentCount === 1 ? "Treatment" : "Treatments"}
                          </Badge>
                        )
                      : (
                          <span className="text-muted-foreground">-</span>
                        )}
                  </div>
                )}
                {column.id === "durationPerSession" && (
                  <span className="text-muted-foreground">-</span>
                )}
                {column.id === "totalDuration" && (
                  program.duration && program.durationUnit
                    ? `${program.duration} ${program.durationUnit}`
                    : "-"
                )}
                {column.id === "price" && (
                  <div className="font-medium text-primary">
                    AED
                    {" "}
                    {program.price.toLocaleString()}
                  </div>
                )}
                {column.id === "status" && (
                  <Badge
                    variant={program.status === "Active" ? "default" : "destructive"}
                    className={
                      program.status === "Active"
                        ? "bg-primary text-primary-foreground hover:bg-primary/80"
                        : "bg-red-500 text-white hover:bg-red-500/80"
                    }
                  >
                    {program.status}
                  </Badge>
                )}
              </div>
            </TableCell>
          ))}
        {hasAnyAction && (
          <TableCell className="sticky right-0 z-20 min-w-[100px] bg-white shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.1)]">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {canUpdate && (
                  <DropdownMenuItem onClick={() => handleEdit(program.wellnessProgramId)}>
                    <Edit className="mr-2 h-4 w-4" />
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
                              `Wellness program ${!isActive ? "activated" : "deactivated"} successfully`,
                            );
                          },
                          onError: () => {
                            toast.error("Failed to update wellness program status");
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
                    <Trash2 className="mr-2 h-4 w-4 text-red-600" />
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
        title="Delete Wellness Program"
        description="This action cannot be undone."
        itemName={program.wellnessProgramName}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
}

export function WellnessProgramTable() {
  const { visibleColumns } = useWellnessProgramManagementStore();
  const allColumns = getAllColumns();
  const { data: userDetails } = useGetUserDetailsQuery();

  const [searchFilter] = useQueryState("searchFilter", parseAsString.withDefault(""));
  const [currentPage, setCurrentPage] = useQueryState("currentPage", parseAsInteger.withDefault(1));
  const [sortColumn, setSortColumn] = useQueryState("sort", parseAsString.withDefault("wellnessProgramName"));
  const [sortDirection, setSortDirection] = useQueryState("order", parseAsString.withDefault("asc"));

  const { wellnessPrograms, totalPages, isPending, isError }
    = useGetAllWellnessProgramQuery({
      searchTerms: searchFilter,
      sortOrderBy: sortDirection === "asc",
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

  // Reset to first page whenever the search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchFilter, setCurrentPage]);

  return (
    <section className="space-y-4">
      <div className="rounded-md border bg-white overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-white">
              <TableRow>
                {allColumns
                  .filter(column => visibleColumns.includes(column.id))
                  .map(column => (
                    <TableHead
                      key={column.id}
                      className={cn(
                        "cursor-pointer hover:bg-gray-100 select-none",
                        "relative min-w-[180px] whitespace-nowrap",
                      )}
                      onClick={() => handleSort(column.id)}
                    >
                      <div className="flex items-center gap-2">
                        {column.name}
                        <div className="flex flex-col">
                          {sortColumn === column.id && sortDirection === "asc" && <ChevronUp className="h-3 w-3" />}
                          {sortColumn === column.id && sortDirection === "desc" && <ChevronDown className="h-3 w-3" />}
                          {sortColumn !== column.id && (
                            <div className="flex flex-col">
                              <ChevronUp className="h-3 w-3 text-gray-400" />
                              <ChevronDown className="h-3 w-3 text-gray-400 -mt-1" />
                            </div>
                          )}
                        </div>
                      </div>
                    </TableHead>
                  ))}
                <TableHead className="sticky right-0 z-20 min-w-[100px] bg-white shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.1)]">
                  <span className="font-semibold">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending && (
                <TableRow>
                  <TableCell colSpan={visibleColumns.length + 1} className="text-center py-8">
                    Loading wellness programs...
                  </TableCell>
                </TableRow>
              )}
              {isError && (
                <TableRow>
                  <TableCell colSpan={visibleColumns.length + 1} className="text-center py-8 text-red-500">
                    Error loading wellness programs
                  </TableCell>
                </TableRow>
              )}
              {!isPending && !isError && wellnessPrograms.length === 0 && <WellnessProgramTableEmpty />}
              {wellnessPrograms.length > 0 && !isPending && !isError && wellnessPrograms.map((program: WellnessProgramResponse) => (
                <WellnessProgramTableRow key={program.wellnessProgramId} program={program} visibleColumns={visibleColumns} userDetails={userDetails} />
              ))}
            </TableBody>
          </Table>
        </div>
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
    </section>
  );
}
