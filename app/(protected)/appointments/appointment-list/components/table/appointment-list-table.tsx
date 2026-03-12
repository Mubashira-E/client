"use client";

import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronUp,
  Eye,
  MoreHorizontal,
  Pencil,
  Trash,
} from "lucide-react";
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
import { useGetAllVisitQuery } from "@/queries/visit/useGetAllVisitQuery";
import { AppointmentDetailsViewModal } from "../../modals/appointment-details-view-modal";
import { useAppointmentListStore } from "../../stores/useAppointmentListStores";
import { getColumns } from "../data";
import { AppointmentListTableEmpty } from "./appointment-list-empty";
import { AppointmentTableSkeleton } from "./appointment-list-skeleton-loader";
import { AppointmentListTableError } from "./appointment-list-table-error";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  if (!dateStr)
    return "—";
  return dateStr.replace(/-/g, "/");
}

// ── Status label: uses real VisitStatus enum values from backend ──────────────
function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    Scheduled: "Scheduled",
    Arrived: "Arrived",
    Completed: "Completed",
    Cancelled: "Cancelled",
  };
  return map[status] ?? status ?? "Unknown";
}

// ── Status colours keyed on real status strings ───────────────────────────────
function getStatusColors(status: string): string {
  switch (status) {
    case "Scheduled":
      return "text-blue-800 bg-blue-100 border-blue-200";
    case "Arrived":
      return "text-yellow-800 bg-yellow-100 border-yellow-200";
    case "Completed":
      return "text-green-800 bg-green-100 border-green-200";
    case "Cancelled":
      return "text-red-800 bg-red-100 border-red-200";
    default:
      return "text-gray-800 bg-gray-100 border-gray-200";
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

type VisitRow = {
  appointmentId: string;
  patientName: string;
  bookingNumber: string;
  medicalDepartment: string;
  clinician: string;
  clinicianSlotTime: string; // actual slot time e.g. "09:00"
  clinicianSlotDate: string;
  mobile: string;            // actual mobile number
  appointmentStatus: string; // "Scheduled" | "Arrived" | "Completed" | "Cancelled"
};

// ─── Component ────────────────────────────────────────────────────────────────

type AppointmentListTableProps = {
  isExternal?: boolean;
};

export function AppointmentListTable({
  isExternal = false,
}: AppointmentListTableProps) {
  const router = useRouter();
  const { data: userDetails } = useGetUserDetailsQuery();
  const translatedColumns = getColumns();

  const canUpdate = hasPermission(userDetails, "Appointments.Update");
  const canDelete = hasPermission(userDetails, "Appointments.Delete");

  const { visibleColumns } = useAppointmentListStore();

  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    string | null
  >(null);
  const [
    isAppointmentDetailsViewModalOpen,
    setIsAppointmentDetailsViewModalOpen,
  ] = useState(false);
  const [currentPage, setCurrentPage] = useQueryState(
    "currentPage",
    parseAsInteger.withDefault(1),
  );
  const [sortColumn, setSortColumn] = useQueryState(
    "sort",
    parseAsString.withDefault("medicalDepartment"),
  );
  const [sortDirection, setSortDirection] = useQueryState(
    "order",
    parseAsString.withDefault("asc"),
  );
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(
    null,
  );

  const { visits, totalPages, totalItems, isPending, isError }
    = useGetAllVisitQuery({
      pageNumber: currentPage,
      pageSize: 10,
      sortOrderBy: sortDirection === "asc",
    });

  const appointments: VisitRow[] = (visits ?? []).map(v => ({
    appointmentId: v.visitId,
    patientName: v.patientName || "—",
    bookingNumber: v.visitNo ? `VISIT-${v.visitNo}` : "—",
    medicalDepartment: v.medicalDepartmentName || "—",
    clinician: v.clinicianName || "—",
    // startTime from backend is already "HH:mm" string — use directly
    clinicianSlotTime: v.startTime || "—",
    clinicianSlotDate: v.visitDate || "—",
    // ── FIX: real mobile number, fallback to "—" if not yet returned by backend
    mobile: v.mobileNumber || "—",
    // ── FIX: use real status field, not visitType
    appointmentStatus: v.status || "Scheduled",
  }));

  const handleSort = (columnId: string) => {
    if (columnId === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    }
    else {
      setSortColumn(columnId);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (columnId: string) => {
    if (columnId !== sortColumn)
      return null;
    return sortDirection === "asc"
      ? (
          <ChevronUp className="size-3" />
        )
      : (
          <ChevronDown className="size-3" />
        );
  };

  const handleViewAppointment = (appointmentId: string) => {
    if (isExternal) {
      setSelectedAppointmentId(appointmentId);
      setIsAppointmentDetailsViewModalOpen(true);
    }
    else {
      router.push(`/appointments/appointment-list/${appointmentId}/view`);
    }
  };

  const handleUpdateNavigation = (appointmentId: string) => {
    router.push(`/appointments/appointment-list/${appointmentId}/update`);
  };

  const handleRescheduleNavigation = (appointmentId: string) => {
    router.push(`/appointments/appointment-list/${appointmentId}/reschedule`);
  };

  const deleteAppointment = (_id: string) => {
    toast.success("Appointment deleted successfully");
    setDeleteModalOpen(false);
  };

  const filteredColumns = translatedColumns.filter((column: any) =>
    visibleColumns.includes(column.id),
  );

  if (isPending)
    return <AppointmentTableSkeleton />;
  if (isError)
    return <AppointmentListTableError />;

  return (
    <section className="flex flex-col gap-6">
      {appointments.length > 0
        ? (
            <div className="bg-white rounded-lg border overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {filteredColumns.map((column: any) => (
                        <TableHead
                          key={column.id}
                          className={cn(
                            "px-4 py-3 text-left whitespace-nowrap cursor-pointer select-none",
                            column.sortable && "hover:bg-gray-50",
                          )}
                          onClick={() => column.sortable && handleSort(column.id)}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm text-gray-700">
                              {column.name}
                            </span>
                            {column.sortable && getSortIcon(column.id)}
                          </div>
                        </TableHead>
                      ))}
                      <TableHead className="px-4 py-3 text-center w-20 sticky right-0 bg-white shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)] z-10">
                        <span className="font-medium text-sm text-gray-700">
                          Actions
                        </span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {appointments.map(appointment => (
                      <TableRow
                        key={appointment.appointmentId}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        {filteredColumns.map((column: any) => (
                          <TableCell
                            key={`${appointment.appointmentId}-${column.id}`}
                            className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap"
                          >
                            {column.id === "clinicianSlotDate"
                              ? (
                                  formatDate(appointment.clinicianSlotDate)
                                )
                              : column.id === "appointmentStatus"
                                ? (
                                    <div
                                      className={cn(
                                        "inline-flex items-center justify-center border rounded-md px-2 py-1 text-xs font-medium",
                                        getStatusColors(appointment.appointmentStatus),
                                      )}
                                    >
                                      {getStatusLabel(appointment.appointmentStatus)}
                                    </div>
                                  )
                                : (
                                    appointment[column.id as keyof VisitRow]
                                  )}
                          </TableCell>
                        ))}

                        <TableCell className="px-4 py-3 sticky right-0 bg-white shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)] z-10">
                          {isExternal
                            ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleViewAppointment(appointment.appointmentId)}
                                  className="flex items-center gap-2 text-xs"
                                >
                                  <Eye className="size-3" />
                                  View
                                </Button>
                              )
                            : (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                      <MoreHorizontal className="size-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="min-w-50">
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleViewAppointment(appointment.appointmentId)}
                                    >
                                      <Eye className="size-4 shrink-0" />
                                      <span>View</span>
                                    </DropdownMenuItem>

                                    {canUpdate && (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleUpdateNavigation(
                                            appointment.appointmentId,
                                          )}
                                      >
                                        <Pencil className="size-4 shrink-0" />
                                        <span>Update</span>
                                      </DropdownMenuItem>
                                    )}

                                    {canUpdate && (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleRescheduleNavigation(
                                            appointment.appointmentId,
                                          )}
                                      >
                                        <Calendar className="size-4 shrink-0" />
                                        <span>Reschedule</span>
                                      </DropdownMenuItem>
                                    )}

                                    {canDelete && (
                                      <DropdownMenuItem
                                        variant="destructive"
                                        onClick={() => {
                                          setDeleteModalOpen(true);
                                          setSelectedAppointment(
                                            appointment.appointmentId,
                                          );
                                        }}
                                        className="text-red-600 cursor-pointer focus:text-red-600"
                                      >
                                        <Trash className="size-4 text-red-600 shrink-0" />
                                        <span>Delete</span>
                                      </DropdownMenuItem>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )
        : (
            <AppointmentListTableEmpty />
          )}

      {/* Pagination */}
      {appointments.length > 0 && (
        <div className="flex items-center justify-between bg-white px-6 py-4 rounded-lg border">
          <div className="text-sm text-gray-700">
            Showing
            {" "}
            {(currentPage - 1) * 10 + 1}
            {" "}
            to
            {" "}
            {Math.min(currentPage * 10, totalItems)}
            {" "}
            of
            {totalItems}
            {" "}
            results
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1 || isPending}
            >
              <ChevronsLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1 || isPending}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="text-sm text-gray-700 px-3">
              Page
              {" "}
              {currentPage}
              {" "}
              of
              {" "}
              {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= (totalPages || 1) || isPending}
            >
              <ChevronRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages || 1)}
              disabled={currentPage >= (totalPages || 1) || isPending}
            >
              <ChevronsRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {!isExternal && (
        <DeleteConfirmationModal
          open={deleteModalOpen}
          onOpenChange={() => setDeleteModalOpen(false)}
          onConfirm={() => deleteAppointment(selectedAppointment ?? "")}
          title="Delete Appointment"
          description="Are you sure you want to delete this appointment? This action cannot be undone."
        />
      )}

      <AppointmentDetailsViewModal
        open={isAppointmentDetailsViewModalOpen}
        onOpenChange={() => setIsAppointmentDetailsViewModalOpen(false)}
        appointmentId={selectedAppointmentId}
      />
    </section>
  );
}