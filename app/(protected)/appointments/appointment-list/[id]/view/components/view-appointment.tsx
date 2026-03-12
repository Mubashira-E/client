"use client";

import {
  AlertCircle,
  AtSign,
  Building2,
  CalendarIcon,
  Clock,
  Container,
  FileText,
  Globe,
  Hospital,
  MessageSquareDot,
  PhoneCall,
  Stethoscope,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteConfirmationModal } from "@/lib/components/delete-confirmation-modal";
import { useGetVisitByIdQuery } from "@/queries/visit/useGetVisitByIdQuery";
import { AppointmentDetailsSkeleton } from "./loader";

export function RemarkSkeleton() {
  return (
    <div className="mt-2 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

function getStatusColors(status: string): string {
  switch (status) {
    case "Scheduled": return "bg-blue-100 text-blue-800";
    case "Arrived": return "bg-yellow-100 text-yellow-800";
    case "Completed": return "bg-green-100 text-green-800";
    case "Cancelled": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
}

export function ViewAppointment({ appointmentId }: { appointmentId?: string }) {
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { visitDetails, isPending, isError } = useGetVisitByIdQuery(
    appointmentId ?? "",
  );

  const handleUpdateNavigation = () => {
    router.push(`/appointments/appointment-list/${appointmentId}/update`);
  };

  const handleRescheduleNavigation = () => {
    router.push(`/appointments/appointment-list/${appointmentId}/reschedule`);
  };

  const deleteAppointment = () => {
    toast.success("Appointment deleted successfully");
    router.push("/appointments/appointment-list");
  };

  if (isPending) {
    return <AppointmentDetailsSkeleton />;
  }

  if (isError || !visitDetails) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <AlertCircle className="h-10 w-10 text-red-400" />
        <p className="text-gray-500 text-sm">Failed to load appointment details.</p>
        <Button variant="outline" onClick={() => router.push("/appointments/appointment-list")}>
          Back to List
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Appointment Details"
        description="View and manage appointment information"
        actions={(
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColors(visitDetails.status)}`}
            >
              {visitDetails.status ?? "—"}
            </span>
          </div>
        )}
      />

      <Accordion
        type="multiple"
        defaultValue={["overview", "patient", "facility"]}
        className="w-full space-y-4"
      >
        {/* ── Appointment Overview ───────────────────────────────── */}
        <AccordionItem value="overview" className="border rounded-lg bg-white">
          <AccordionTrigger className="px-4 py-2 hover:no-underline">
            <div className="flex items-center gap-2 pt-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              <span className="font-semibold">Appointment Overview</span>
              <span className="text-sm text-primary bg-primary/10 px-2 py-1 rounded-md">
                VISIT-
                {visitDetails.visitNo}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4">
            <Card className="border-0 shadow-none py-2">
              <CardContent className="p-0">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                    <label className="text-sm font-medium text-muted-foreground">
                      Appointment Date
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold text-gray-900">
                        {visitDetails.visitDate || "—"}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                    <label className="text-sm font-medium text-muted-foreground">
                      Appointment Time
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold text-gray-900">
                        {visitDetails.startTime || "—"}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                    <label className="text-sm font-medium text-muted-foreground">
                      EMR Number
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold text-gray-900">
                        {visitDetails.emrNumber || "—"}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                    <label className="text-sm font-medium text-muted-foreground">
                      Status
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColors(visitDetails.status)}`}
                      >
                        {visitDetails.status ?? "—"}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                    <label className="text-sm font-medium text-muted-foreground">
                      Visit Type
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <Container className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold text-gray-900">
                        {visitDetails.visitType || "—"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* ── Patient Information ────────────────────────────────── */}
        <AccordionItem value="patient" className="border rounded-lg bg-white">
          <AccordionTrigger className="px-4 py-2 hover:no-underline">
            <div className="flex items-center gap-2 pt-2">
              <User className="h-5 w-5 text-cyan-600" />
              <span className="font-semibold">Patient Information</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4">
            <Card className="border-0 shadow-none py-2">
              <CardContent className="p-0">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Patient Name
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{visitDetails.patientName || "—"}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Mobile Number
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <PhoneCall className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold text-gray-900">
                        {visitDetails.mobileNumber || "—"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      EMR Number
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <AtSign className="h-4 w-4 text-muted-foreground" />
                      <span>{visitDetails.emrNumber || "—"}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* ── Facility & Department ──────────────────────────────── */}
        <AccordionItem value="facility" className="border rounded-lg bg-white">
          <AccordionTrigger className="px-4 py-2 hover:no-underline">
            <div className="flex items-center gap-2 pt-2">
              <Hospital className="h-5 w-5 text-green-600" />
              <span className="font-semibold">Facility & Department</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4">
            <Card className="border-0 shadow-none py-2">
              <CardContent className="p-0">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Department
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span>{visitDetails.medicalDepartmentName || "—"}</span>
                    </div>
                  </div>

                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                    <label className="text-sm font-medium text-muted-foreground">
                      Clinician
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <Stethoscope className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold text-gray-900">
                        {visitDetails.clinicianName || "—"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* ── Remarks ───────────────────────────────────────────── */}
        <AccordionItem value="remarks" className="border rounded-lg bg-white">
          <AccordionTrigger className="px-4 py-2 hover:no-underline">
            <div className="flex items-center gap-2 pt-2">
              <MessageSquareDot className="h-5 w-5 text-yellow-600" />
              <span className="font-semibold">Remarks</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4">
            <Card className="border-0 shadow-none py-2">
              <CardContent className="p-0">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 text-sm">No remarks available.</p>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* ── Action Buttons ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <Button
          variant="outline"
          className="text-gray-600"
          onClick={() => router.push("/appointments/appointment-list")}
        >
          Back
        </Button>
        <Button
          type="button"
          variant="destructive"
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-6 rounded-lg transition duration-200"
          onClick={() => setDeleteModalOpen(true)}
        >
          Delete
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleUpdateNavigation}
        >
          Update
        </Button>
        <Button
          type="button"
          className="bg-primary hover:bg-primary/80 text-white py-2 px-6 rounded-lg transition duration-200"
          onClick={handleRescheduleNavigation}
        >
          Reschedule
        </Button>
      </div>

      <DeleteConfirmationModal
        open={deleteModalOpen}
        onOpenChange={() => setDeleteModalOpen(false)}
        onConfirm={deleteAppointment}
        title="Delete Appointment"
        description="Are you sure you want to delete this appointment?"
      />
    </div>
  );
}