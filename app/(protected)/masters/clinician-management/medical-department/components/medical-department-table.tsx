import type { UserDetails } from "@/queries/auth/useGetUserDetailsQuery";
import type { MedicalDepartmentResponse } from "@/queries/general/medical-department/useGetAllMedicalDepartmentQuery";
import { CheckCircle, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronUp, Edit, MoreHorizontal, Trash2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeleteConfirmationModal } from "@/lib/components/delete-confirmation-modal";
import { cn } from "@/lib/utils";
import { hasPermission } from "@/lib/utils/auth";
import { useGetUserDetailsQuery } from "@/queries/auth/useGetUserDetailsQuery";
import { useDeleteMedicalDepartmentMutation } from "@/queries/general/medical-department/useDeleteMedicalDepartmentMutation";
import { useGetAllMedicalDepartmentQuery } from "@/queries/general/medical-department/useGetAllMedicalDepartmentQuery";
import { usePatchMedicalDepartmentMutation } from "@/queries/general/medical-department/usePatchMedicalDepartmentMutation";
import { useMedicalDepartmentStore } from "../stores/useMedicalDepartmentStore";
import { allColumns } from "./data";
import { MedicalDepartmentTableEmpty } from "./medical-department-table-empty";
import { MedicalDepartmentTableError } from "./medical-department-table-error";
import { MedicalDepartmentTableLoader } from "./medical-department-table-loader";

function MedicalDepartmentTableRow({
  medicalDepartment,
  visibleColumns,
  translatedColumns,
  onEdit,
  userDetails,
}: {
  medicalDepartment: MedicalDepartmentResponse;
  visibleColumns: string[];
  translatedColumns: typeof allColumns;
  onEdit: (id: string) => void;
  userDetails: UserDetails | undefined;
}) {
  const patchMutation = usePatchMedicalDepartmentMutation(medicalDepartment.medicalDepartmentId || "");
  const deleteMutation = useDeleteMedicalDepartmentMutation(medicalDepartment.medicalDepartmentId || "");
  const isActive = medicalDepartment.status?.toLowerCase() === "active";
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const canUpdate = hasPermission(userDetails, "Department.Update");
  const canDelete = hasPermission(userDetails, "Department.Delete");
  const hasAnyAction = canUpdate || canDelete;

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Medical department deleted successfully");
        setShowDeleteModal(false);
      },
      onError: () => {
        toast.error("Failed to delete medical department");
      },
    });
  };

  return (
    <>
      <TableRow key={medicalDepartment.medicalDepartmentId}>
        {translatedColumns
          .filter(col => visibleColumns.includes(col.id))
          .map((column, colIndex) => (
            <TableCell key={`${medicalDepartment.medicalDepartmentId}-${column.id}`} className={cn(colIndex === 0 && "!pl-4")}>
              {column.id === "status"
                ? (
                    <div className={cn("max-w-18 truncate flex items-center justify-center border", isActive ? "text-green-800 bg-green-100 rounded-md px-2 py-1 border-green-200" : "text-red-800 bg-red-100 rounded-md px-2 py-1 border-red-200")}>
                      {medicalDepartment.status || "Inactive"}
                    </div>
                  )
                : (
                    medicalDepartment[column.id as keyof MedicalDepartmentResponse]
                  )}
            </TableCell>
          ))}
        {hasAnyAction && (
          <TableCell>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {canUpdate && (
                  <DropdownMenuItem
                    onClick={() => {
                      onEdit(medicalDepartment.medicalDepartmentId || "");
                    }}
                    className="cursor-pointer"
                  >
                    <Edit className="size-4" />
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
                              `Medical department ${!isActive ? "activated" : "deactivated"} successfully`,
                            );
                          },
                          onError: () => {
                            toast.error("Failed to update medical department status");
                          },
                        },
                      );
                    }}
                    disabled={patchMutation.isPending}
                    className="cursor-pointer"
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
                  <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600 cursor-pointer">
                    <Trash2 className="h-4 w-4 mr-2 text-red-600" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        )}
        {!hasAnyAction && <TableCell />}
      </TableRow>

      <DeleteConfirmationModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete Medical Department"
        description="This action cannot be undone."
        itemName={medicalDepartment.medicalDepartmentName}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
}

export function MedicalDepartmentTable() {
  const router = useRouter();
  const { data: userDetails } = useGetUserDetailsQuery();
  const { visibleColumns } = useMedicalDepartmentStore();
  const translatedColumns = allColumns;

  const [searchFilter] = useQueryState("searchFilter", parseAsString.withDefault(""));
  const [currentPage, setCurrentPage] = useQueryState("currentPage", parseAsInteger.withDefault(1));
  const [sortColumn, setSortColumn] = useQueryState("sort", parseAsString.withDefault("medicalDepartment"));
  const [sortDirection, setSortDirection] = useQueryState("order", parseAsString.withDefault("asc"));

  const { medicalDepartments, totalPages, isPending, isError }
    = useGetAllMedicalDepartmentQuery({
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

  const handleOnEditClick = (medicalDepartmentId: string) => {
    router.push(`/masters/clinician-management/medical-department/${medicalDepartmentId}/edit`);
  };

  return (
    <section className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {translatedColumns
                .filter(col => visibleColumns.includes(col.id))
                .map((column, index) => (
                  <TableHead key={column.id}>
                    {column.sortable
                      ? (
                          <Button
                            variant="ghost"
                            onClick={() => handleSort(column.id)}
                            className={cn("h-8 font-semibold flex items-center gap-1 hover:bg-transparent", index === 0 ? "!pl-2" : "!pl-0")}
                          >
                            {column.name}
                            {sortColumn === column.id && (
                              sortDirection === "asc"
                                ? <ChevronUp className="ml-2 size-4" />
                                : <ChevronDown className="ml-2 size-4" />
                            )}
                          </Button>
                        )
                      : (
                          column.name
                        )}
                  </TableHead>
                ))}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isError && <MedicalDepartmentTableError />}
            {isPending && <MedicalDepartmentTableLoader />}
            {!isPending && !isError && medicalDepartments.length === 0 && <MedicalDepartmentTableEmpty />}
            {medicalDepartments.length > 0 && !isPending && !isError && (
              medicalDepartments.map(medicalDepartment => (
                <MedicalDepartmentTableRow
                  key={medicalDepartment.medicalDepartmentId}
                  medicalDepartment={medicalDepartment}
                  visibleColumns={visibleColumns}
                  translatedColumns={translatedColumns}
                  onEdit={handleOnEditClick}
                  userDetails={userDetails}
                />
              ))
            )}
          </TableBody>
        </Table>
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
