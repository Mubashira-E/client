"use client";

import type { UserDetails } from "@/queries/auth/useGetUserDetailsQuery";
import type { TreatmentResponse } from "@/queries/masters/treatments/useGetAllTreatmentQuery";
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
import { hasPermission } from "@/lib/utils/auth";
import { useGetUserDetailsQuery } from "@/queries/auth/useGetUserDetailsQuery";
import { useDeleteTreatmentMutation } from "@/queries/masters/treatments/useDeleteTreatmentMutation";
import { useGetAllTreatmentQuery } from "@/queries/masters/treatments/useGetAllTreatmentQuery";
import { usePatchTreatmentMutation } from "@/queries/masters/treatments/usePatchTreatmentMutation";
import { useTreatmentManagementStore } from "../../stores/useTreatmentManagementStore";
import { TreatmentManagementTableEmpty } from "./treatment-management-table-empty";
import { TreatmentManagementTableError } from "./treatment-management-table-error";
import { TreatmentManagementTableLoader } from "./treatment-management-table-loader";

function TreatmentTableRow({ treatment, visibleColumns, userDetails }: { treatment: TreatmentResponse; visibleColumns: string[]; userDetails: UserDetails | undefined }) {
  const router = useRouter();
  const patchMutation = usePatchTreatmentMutation(treatment.treatmentId);
  const deleteMutation = useDeleteTreatmentMutation(treatment.treatmentId);
  const isActive = treatment.status?.toLowerCase() === "active";
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const canUpdate = hasPermission(userDetails, "IndividualTreatment.Update");
  const canDelete = hasPermission(userDetails, "IndividualTreatment.Delete");
  const hasAnyAction = canUpdate || canDelete;

  const handleEdit = (treatment: TreatmentResponse) => {
    router.push(`/masters/treatment-management/individual-treatments/edit/${treatment.treatmentId}`);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Treatment deleted successfully");
        setShowDeleteModal(false);
      },
      onError: () => {
        toast.error("Failed to delete treatment");
      },
    });
  };

  const renderCell = (treatment: TreatmentResponse, columnId: string) => {
    switch (columnId) {
      case "treatmentName":
        return (
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">{treatment.treatmentName}</span>
            <span className="text-sm text-gray-500">{treatment.description || "No description"}</span>
          </div>
        );
      case "category":
        return (
          <Badge variant="secondary" className="w-fit">
            {treatment.treatmentCode || "N/A"}
          </Badge>
        );
      case "duration":
        return <span className="text-gray-700">{treatment.duration || "N/A"}</span>;
      case "price":
        return (
          <span className="font-semibold text-green-600">
            {treatment.price.toFixed(2)}
          </span>
        );
      case "status":
        return (
          <Badge
            variant={treatment.status === "Active" ? "default" : "secondary"}
            className={treatment.status === "Active" ? "text-white" : "text-white bg-red-700"}
          >
            {treatment.status}
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <TableRow key={treatment.treatmentId} className="hover:bg-gray-50">
        {visibleColumns.map(columnId => (
          <TableCell key={columnId} className="pl-4 text-gray-800 min-w-[180px] whitespace-nowrap">
            <div className="overflow-hidden text-ellipsis max-w-[250px]">
              {renderCell(treatment, columnId)}
            </div>
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
                  <DropdownMenuItem onClick={() => handleEdit(treatment)}>
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
                              `Treatment ${!isActive ? "activated" : "deactivated"} successfully`,
                            );
                          },
                          onError: () => {
                            toast.error("Failed to update treatment status");
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
        title="Delete Treatment"
        description="This action cannot be undone."
        itemName={treatment.treatmentName}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
}

export function TreatmentManagementTable() {
  const { visibleColumns } = useTreatmentManagementStore();
  const { data: userDetails } = useGetUserDetailsQuery();

  const [searchFilter] = useQueryState("searchFilter", parseAsString.withDefault(""));
  const [currentPage, setCurrentPage] = useQueryState("currentPage", parseAsInteger.withDefault(1));
  const [sortColumn, setSortColumn] = useQueryState("sort", parseAsString.withDefault("treatmentName"));
  const [sortDirection, setSortDirection] = useQueryState("order", parseAsString.withDefault("asc"));

  const { treatments, totalPages, isPending, isError } = useGetAllTreatmentQuery({
    PageSize: 10,
    PageNumber: currentPage,
    SearchTerms: searchFilter,
    SortOrderBy: sortDirection === "asc",
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchFilter, setCurrentPage]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    }
    else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const getColumnHeader = (columnId: string) => {
    switch (columnId) {
      case "treatmentName":
        return "Treatment Name";
      case "category":
        return "Category";
      case "duration":
        return "Duration";
      case "price":
        return "Price";
      case "status":
        return "Status";
      default:
        return columnId;
    }
  };

  return (
    <section className="space-y-4">
      <div className="border rounded-lg overflow-hidden">
        {isPending
          ? (
              <TreatmentManagementTableLoader />
            )
          : (
              <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
                <Table>
                  <TableHeader className="sticky top-0 z-10 bg-white">
                    <TableRow>
                      {visibleColumns.map(columnId => (
                        <TableHead
                          key={columnId}
                          className="font-semibold pl-4 cursor-pointer hover:bg-gray-100 select-none min-w-[180px] whitespace-nowrap"
                          onClick={() => handleSort(columnId)}
                        >
                          <div className="flex items-center gap-2">
                            {getColumnHeader(columnId)}
                            {sortColumn === columnId && sortDirection === "asc" && <ChevronUp className="h-3 w-3" />}
                            {sortColumn === columnId && sortDirection === "desc" && <ChevronDown className="h-3 w-3" />}
                            {sortColumn !== columnId && (
                              <div className="flex flex-col">
                                <ChevronUp className="h-3 w-3 text-gray-400" />
                                <ChevronDown className="h-3 w-3 text-gray-400 -mt-1" />
                              </div>
                            )}
                          </div>
                        </TableHead>
                      ))}
                      <TableHead className="sticky right-0 z-20 min-w-[100px] bg-white shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.1)]">
                        <span className="font-semibold">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isError && <TreatmentManagementTableError />}
                    {!isError && treatments.length === 0 && <TreatmentManagementTableEmpty />}
                    {!isError && treatments.length > 0 && treatments.map((treatment: TreatmentResponse) => (
                      <TreatmentTableRow key={treatment.treatmentId} treatment={treatment} visibleColumns={visibleColumns} userDetails={userDetails} />
                    ))}
                  </TableBody>
                </Table>
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
