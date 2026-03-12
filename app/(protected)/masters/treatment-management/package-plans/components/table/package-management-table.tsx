"use client";

import type { UserDetails } from "@/queries/auth/useGetUserDetailsQuery";
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
import { useDeletePackageMutation } from "@/queries/masters/package-plans/useDeletePackageMutation";
import { useGetAllPackageQuery } from "@/queries/masters/package-plans/useGetAllPackageQuery";
import { usePatchPackageMutation } from "@/queries/masters/package-plans/usePatchPackageMutation";
import { usePackageManagementStore } from "../../stores/usePackageManagementStore";
import { PackageManagementTableEmpty } from "./package-management-table-empty";
import { PackageManagementTableError } from "./package-management-table-error";
import { PackageManagementTableLoader } from "./package-management-table-loader";

function PackageTableRow({ pkg, visibleColumns, userDetails }: { pkg: any; visibleColumns: string[]; userDetails: UserDetails | undefined }) {
  const router = useRouter();
  const patchMutation = usePatchPackageMutation(pkg.packageId);
  const deleteMutation = useDeletePackageMutation(pkg.packageId);
  const isActive = pkg.status?.toLowerCase() === "active";
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const canUpdate = hasPermission(userDetails, "PackagePlan.Update");
  const canDelete = hasPermission(userDetails, "PackagePlan.Delete");
  const hasAnyAction = canUpdate || canDelete;

  const handleEdit = (packageId: string) => {
    router.push(`/masters/treatment-management/package-plans/edit/${packageId}`);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Package deleted successfully");
        setShowDeleteModal(false);
      },
      onError: () => {
        toast.error("Failed to delete package");
      },
    });
  };

  const renderCell = (pkg: any, columnId: string) => {
    switch (columnId) {
      case "packageName":
        return (
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">{pkg.packageName}</span>
            <span className="text-sm text-gray-500">{pkg.description || "No description"}</span>
          </div>
        );
      case "packageCode":
        return (
          <Badge variant="secondary" className="w-fit">
            {pkg.packageCode || "N/A"}
          </Badge>
        );
      case "treatments":
        return (
          <div className="text-sm">
            {pkg.packageTreatmentCount || 0}
            {" "}
            treatment
            {(pkg.packageTreatmentCount || 0) !== 1 ? "s" : ""}
          </div>
        );
      case "durationPerSession":
        return (
          <div className="text-sm">
            {pkg.durationPerSession}
            {" "}
            {pkg.durationUnit || ""}
          </div>
        );
      case "totalDuration":
        return (
          <div className="text-sm font-medium">
            {pkg.totalDuration || 0}
            {" "}
            {pkg.durationUnit || ""}
          </div>
        );
      case "pricing":
        return (
          <span className="font-semibold text-green-600">
            AED
            {" "}
            {(pkg.price || 0).toFixed(2)}
          </span>
        );
      case "status":
        return (
          <Badge
            variant={pkg.status === "Active" ? "default" : "secondary"}
            className={pkg.status === "Active" ? "text-white" : "text-white bg-red-700"}
          >
            {pkg.status || "N/A"}
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <TableRow key={pkg.packageId} className="hover:bg-gray-50">
        {visibleColumns.map(columnId => (
          <TableCell key={columnId} className="pl-4 text-gray-800 min-w-[180px] whitespace-nowrap">
            <div className="overflow-hidden text-ellipsis max-w-[250px]">
              {renderCell(pkg, columnId)}
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
                  <DropdownMenuItem onClick={() => handleEdit(pkg.packageId)}>
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
                              `Package ${!isActive ? "activated" : "deactivated"} successfully`,
                            );
                          },
                          onError: () => {
                            toast.error("Failed to update package status");
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
        title="Delete Package"
        description="This action cannot be undone."
        itemName={pkg.packageName}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
}

export function PackageManagementTable() {
  const { visibleColumns } = usePackageManagementStore();
  const { data: userDetails } = useGetUserDetailsQuery();

  const [searchFilter] = useQueryState("searchFilter", parseAsString.withDefault(""));
  const [currentPage, setCurrentPage] = useQueryState("currentPage", parseAsInteger.withDefault(1));
  const [sortColumn, setSortColumn] = useQueryState("sort", parseAsString.withDefault("packageName"));
  const [sortDirection, setSortDirection] = useQueryState("order", parseAsString.withDefault("asc"));

  const { packages, totalPages, isPending, isError } = useGetAllPackageQuery({
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
      case "packageName":
        return "Package Name";
      case "packageCode":
        return "Package Code";
      case "treatments":
        return "Treatments";
      case "durationPerSession":
        return "Duration Per Session";
      case "totalDuration":
        return "Total Duration";
      case "pricing":
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
              <PackageManagementTableLoader />
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
                    {isError && <PackageManagementTableError />}
                    {!isError && packages.length === 0 && <PackageManagementTableEmpty />}
                    {!isError && packages.length > 0 && packages.map((pkg: any) => (
                      <PackageTableRow key={pkg.packageId} pkg={pkg} visibleColumns={visibleColumns} userDetails={userDetails} />
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
