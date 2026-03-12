"use client";
import { CalendarCheck, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronUp, Edit, Eye, FileEdit, MoreHorizontal, Plus, Trash } from "lucide-react";
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
import { useGetAllPatientQuery } from "@/queries/visit/useGetAllPatientQuery";
import { allPatientColumns } from "../data";
import { usePatientManagementStore } from "../stores/usePatientManagementStore";
import { PatientManagementTableEmpty } from "./patient-management-table-empty";
import { PatientManagementTableError } from "./patient-management-table-error";
import { PatientManagementTableLoader } from "./patient-management-table-loader";

type PatientPropertyValue = string | number | boolean | undefined;

type TablePatientRow = {
  patientId: string;
  emrNo?: string;
  patientName?: string;
  age?: number;
  emiratesId?: string;
  nationality?: string;
};

function renderCellContent(column: string, value: PatientPropertyValue): React.ReactNode {
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return value?.toString() || "N/A";
}

export function PatientManagementTable() {
  const router = useRouter();
  const { data: userDetails } = useGetUserDetailsQuery();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPatientForDelete, setSelectedPatientForDelete] = useState<string | null>(null);

  const canUpdate = hasPermission(userDetails, "Patient.Update");
  const canDelete = hasPermission(userDetails, "Patient.Delete");
  const canCreateVisit = hasPermission(userDetails, "Visit.Create");

  const { visibleColumns } = usePatientManagementStore();
  const allColumns = allPatientColumns;

  const [searchFilter] = useQueryState("searchFilter", parseAsString.withDefault(""));
  const [currentPage, setCurrentPage] = useQueryState("currentPage", parseAsInteger.withDefault(1));
  const [nationalityFilter] = useQueryState("nationalityFilter", parseAsString.withDefault(""));

  const [sortDirection, setSortDirection] = useQueryState("order", parseAsString.withDefault("asc"));
  const [sortColumn, setSortColumn] = useQueryState("sort", parseAsString.withDefault("emrNo"));

  const {
    patients,
    isPending,
    isError,
    totalPages,
  } = useGetAllPatientQuery({
    pageSize: 10,
    pageNumber: currentPage,
    searchTerms: searchFilter,
    sortOrderBy: sortDirection === "asc",
  });

  const patientRows: TablePatientRow[] = patients.map(p => ({
    patientId: p.patientId,
    emrNo: p.emrNumber,
    patientName: p.patientName,
    age: p.age,
    emiratesId: p.emiratesId,
    nationality: p.nationalityName,
  }));

  const filteredRows = patientRows.filter((patient) => {
    const matchesSearch = !searchFilter
      || (patient.patientName?.toLowerCase().includes(searchFilter.toLowerCase()))
      || (patient.emrNo?.toLowerCase().includes(searchFilter.toLowerCase()));
    const matchesNationality = !nationalityFilter || patient.nationality === nationalityFilter;
    return matchesSearch && matchesNationality;
  });

  // Client-side sorting (optional; backend may already sort)
  const sortedPatients = [...filteredRows].sort((a, b) => {
    const aValue = a[sortColumn as keyof TablePatientRow];
    const bValue = b[sortColumn as keyof TablePatientRow];

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

  const paginatedPatients = sortedPatients;

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
    if (selectedPatientForDelete) {
      // Add delete logic here
      setDeleteModalOpen(false);
      setSelectedPatientForDelete(null);
    }
  };

  const handleEditClick = (patientId: string) => {
    router.push(`/patients/${patientId}/edit`);
  };

  const handleViewClick = (patientId: string) => {
    router.push(`/patients/patient-list/${patientId}/view`);
  };

  const handleVisitConfirmationClick = (patientId: string) => {
    router.push(`/patients/patient-list/${patientId}/visit-confirmation`);
  };

  const handleAmendmentClick = (patientId: string) => {
    router.push(`/patients/patient-list/${patientId}/amendment`);
  };

  const handleNewVisitClick = (patientId: string) => {
    router.push(`/patients/patient-list/${patientId}/new-visit`);
  };

  return (
    <section className="space-y-4">
      <div className="rounded-md border bg-white overflow-hidden">
        {isPending
          ? (
              <div className="flex justify-center items-center h-full">
                <PatientManagementTableLoader />
              </div>
            )
          : (
              <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
                {isError || paginatedPatients.length === 0
                  ? (
                      <Table>
                        <TableBody>
                          {isError ? <PatientManagementTableError /> : <PatientManagementTableEmpty />}
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
                          {paginatedPatients.map(patient => (
                            <TableRow key={patient.patientId}>
                              {allColumns
                                .filter(col => visibleColumns.includes(col.id))
                                .map((column, index) => (
                                  <TableCell
                                    key={`${patient.patientId}-${column.id}`}
                                    className={cn(
                                      index === 0 && "!pl-4",
                                      "min-w-[180px] whitespace-nowrap",
                                    )}
                                  >
                                    <div className="overflow-hidden text-ellipsis max-w-[250px]" title={String(patient[column.id as keyof TablePatientRow] || "N/A")}>
                                      {renderCellContent(
                                        column.id,
                                        patient[column.id as keyof TablePatientRow],
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
                                        handleViewClick(patient.patientId);
                                      }}
                                    >
                                      <Eye className="size-4 mr-2" />
                                      View
                                    </DropdownMenuItem>
                                    {canUpdate && (
                                      <DropdownMenuItem onClick={() => {
                                        handleEditClick(patient.patientId);
                                      }}
                                      >
                                        <Edit className="size-4 mr-2" />
                                        Edit
                                      </DropdownMenuItem>
                                    )}
                                    {canCreateVisit && (
                                      <DropdownMenuItem
                                        onClick={() => {
                                          handleVisitConfirmationClick(patient.patientId);
                                        }}
                                      >
                                        <CalendarCheck className="size-4 mr-2" />
                                        Visit Confirmation
                                      </DropdownMenuItem>
                                    )}
                                    {canUpdate && (
                                      <DropdownMenuItem
                                        onClick={() => {
                                          handleAmendmentClick(patient.patientId);
                                        }}
                                      >
                                        <FileEdit className="size-4 mr-2" />
                                        Amendment
                                      </DropdownMenuItem>
                                    )}
                                    {canCreateVisit && (
                                      <DropdownMenuItem
                                        onClick={() => {
                                          handleNewVisitClick(patient.patientId);
                                        }}
                                      >
                                        <Plus className="size-4 mr-2" />
                                        New Visit
                                      </DropdownMenuItem>
                                    )}
                                    {canDelete && (
                                      <DropdownMenuItem
                                        onClick={() => {
                                          setSelectedPatientForDelete(patient.patientId);
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
          setSelectedPatientForDelete(null);
        }}
        onConfirm={handleDelete}
        title="Delete Patient"
        description="Are you sure you want to delete this patient? This action cannot be undone."
        itemName={paginatedPatients.find(p => p.patientId === selectedPatientForDelete)?.patientName || ""}
      />
    </section>
  );
}
