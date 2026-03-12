"use client";

import { ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronUp, Edit, Eye, MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeleteConfirmationModal } from "@/lib/components/delete-confirmation-modal";
import { cn } from "@/lib/utils";
import { hasPermission } from "@/lib/utils/auth";
import { useGetUserDetailsQuery } from "@/queries/auth/useGetUserDetailsQuery";
import { useGetAllVisitQuery } from "@/queries/visit/useGetAllVisitQuery";
import { allVisitColumns } from "../data";
import { useVisitManagementStore } from "../stores/useVisitManagementStore";
import { VisitManagementTableEmpty } from "./visit-management-table-empty";
import { VisitManagementTableError } from "./visit-management-table-error";
import { VisitManagementTableLoader } from "./visit-management-table-loader";

type VisitPropertyValue = string | number | boolean | undefined;

function renderCellContent(column: string, value: VisitPropertyValue): React.ReactNode {
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return value?.toString() || "N/A";
}

type TableVisitRow = {
  visitId: string;
  emrNo?: string;
  patientName?: string;
  visitDate?: string;
  visitType?: string;
  department?: string;
  doctor?: string;
  diagnosisType?: string;
  treatmentCode?: string;
  treatmentName?: string;
};

export function VisitManagementTable() {
  const router = useRouter();
  const { data: userDetails } = useGetUserDetailsQuery();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedVisitForDelete, setSelectedVisitForDelete] = useState<string | null>(null);

  const canUpdate = hasPermission(userDetails, "Visit.Update");
  const canDelete = hasPermission(userDetails, "Visit.Delete");

  const { visibleColumns } = useVisitManagementStore();
  const allColumns = allVisitColumns;

  const [searchFilter] = useQueryState("searchFilter", parseAsString.withDefault(""));
  const [currentPage, setCurrentPage] = useQueryState("currentPage", parseAsInteger.withDefault(1));
  const [departmentFilter] = useQueryState("departmentFilter", parseAsString.withDefault(""));

  const [sortDirection, setSortDirection] = useQueryState("order", parseAsString.withDefault("asc"));
  const [sortColumn, setSortColumn] = useQueryState("sort", parseAsString.withDefault("visitId"));

  const {
    visits,
    isPending,
    isError,
    totalPages,
  } = useGetAllVisitQuery({
    pageSize: 10,
    pageNumber: currentPage,
    searchTerms: searchFilter,
    sortOrderBy: sortDirection === "asc",
  });

  const visitRows: TableVisitRow[] = visits.map(v => ({
    visitId: v.visitId,
    emrNo: v.emrNumber,
    patientName: v.patientName,
    visitDate: v.visitDate,
    visitType: v.visitType,
    department: v.medicalDepartmentName,
    doctor: v.clinicianName,
  }));

  const filteredVisits = visitRows.filter((visit) => {
    const matchesSearch = !searchFilter
      || (visit.patientName?.toLowerCase().includes(searchFilter.toLowerCase()))
      || (visit.emrNo?.toLowerCase().includes(searchFilter.toLowerCase()))
      || visit.visitId.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesDepartment = !departmentFilter || visit.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  // Client-side sorting (optional; backend may already sort)
  const sortedVisits = [...filteredVisits].sort((a, b) => {
    const aValue = a[sortColumn as keyof TableVisitRow];
    const bValue = b[sortColumn as keyof TableVisitRow];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  const paginatedVisits = sortedVisits;

  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    }
    else {
      setSortColumn(columnId);
      setSortDirection("asc");
    }
  };

  const handleDelete = () => {
    if (selectedVisitForDelete) {
      // Add delete logic here
      setDeleteModalOpen(false);
      setSelectedVisitForDelete(null);
    }
  };

  const handleEditClick = (visitId: string) => {
    router.push(`/patients/visit-list/${visitId}/edit`);
  };

  const handleViewClick = (visitId: string) => {
    router.push(`/patients/visit-list/${visitId}/view`);
  };

  return (
    <section className="space-y-4">
      <div className="rounded-md border bg-white overflow-hidden">
        {isPending
          ? (
              <div className="flex justify-center items-center h-full">
                <VisitManagementTableLoader />
              </div>
            )
          : (
              <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
                {isError || paginatedVisits.length === 0
                  ? (
                      <Table>
                        <TableBody>
                          {isError ? <VisitManagementTableError /> : <VisitManagementTableEmpty />}
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
                          {paginatedVisits.map(visit => (
                            <TableRow key={visit.visitId}>
                              {allColumns
                                .filter(col => visibleColumns.includes(col.id))
                                .map((column, index) => (
                                  <TableCell
                                    key={`${visit.visitId}-${column.id}`}
                                    className={cn(
                                      index === 0 && "!pl-4",
                                      "min-w-[180px] whitespace-nowrap",
                                    )}
                                  >
                                    <div className="overflow-hidden text-ellipsis max-w-[250px]" title={String(visit[column.id as keyof TableVisitRow] || "N/A")}>
                                      {renderCellContent(
                                        column.id,
                                        visit[column.id as keyof TableVisitRow],
                                      )}
                                    </div>
                                  </TableCell>
                                ))}
                              <TableCell className="sticky right-0 z-20 min-w-[100px] bg-white shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.1)]">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                      <MoreHorizontal className="size-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() => {
                                        handleViewClick(visit.visitId);
                                      }}
                                    >
                                      <Eye className="size-4 mr-2" />
                                      View
                                    </DropdownMenuItem>
                                    {canUpdate && (
                                      <DropdownMenuItem onClick={() => {
                                        handleEditClick(visit.visitId);
                                      }}
                                      >
                                        <Edit className="size-4 mr-2" />
                                        Edit
                                      </DropdownMenuItem>
                                    )}
                                    {canDelete && (
                                      <DropdownMenuItem
                                        onClick={() => {
                                          setSelectedVisitForDelete(visit.visitId);
                                          setDeleteModalOpen(true);
                                        }}
                                        className="text-red-600 focus:text-red-600"
                                      >
                                        <Trash className="size-4 mr-2" />
                                        Delete
                                      </DropdownMenuItem>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
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

      <DeleteConfirmationModal
        open={deleteModalOpen}
        onOpenChange={() => {
          setDeleteModalOpen(false);
          setSelectedVisitForDelete(null);
        }}
        onConfirm={handleDelete}
        title="Delete Visit"
        description="Are you sure you want to delete this visit? This action cannot be undone."
        itemName={paginatedVisits.find(v => v.visitId === selectedVisitForDelete)?.visitId || ""}
      />
    </section>
  );
}
