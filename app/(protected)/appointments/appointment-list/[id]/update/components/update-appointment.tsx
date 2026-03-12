"use client";

import {
  AlertCircle,
  CalendarIcon,
  Clock,
  FileText,
  Phone,
  User,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import errorImage from "@/public/assets/svg/common/error.svg";
import { useChangeVisitStatusMutation } from "@/queries/visit/useChangeVisitStatusMutation";
import { useGetVisitByIdQuery } from "@/queries/visit/useGetVisitByIdQuery";
import { UpdateAppointmentSkeleton } from "./update-appointment-loader";

// ── Visit status options matching backend VisitStatus enum ────────────────────
const STATUS_OPTIONS = [
  { value: 1, label: "Scheduled" },
  { value: 2, label: "Arrived" },
  { value: 3, label: "Completed" },
  { value: 4, label: "Cancelled" },
];

function getStatusColors(status: string): string {
  switch (status) {
    case "Scheduled": return "bg-blue-100 text-blue-800";
    case "Arrived": return "bg-yellow-100 text-yellow-800";
    case "Completed": return "bg-green-100 text-green-800";
    case "Cancelled": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
}

function statusLabelToValue(label: string): number {
  return STATUS_OPTIONS.find(s => s.label === label)?.value ?? 1;
}

export function UpdateAppointment({ appointmentId }: { appointmentId?: string }) {
  const router = useRouter();

  const { visitDetails, isPending, isError } = useGetVisitByIdQuery(appointmentId ?? "");
  const { mutate: changeStatus, isPending: isChanging } = useChangeVisitStatusMutation();

  function handleStatusChange(newStatusValue: string) {
    if (!appointmentId) return;

    changeStatus(
      { visitId: appointmentId, newStatus: Number(newStatusValue) },
      {
        onSuccess: (res) => {
          toast.success(`Status updated to ${res.newStatusName}`);
        },
        onError: (err: any) => {
          toast.error(
            err?.response?.data?.detail
            ?? err?.response?.data?.message
            ?? "Failed to update status",
          );
        },
      },
    );
  }

  if (isPending) return <UpdateAppointmentSkeleton />;

  if (isError || !visitDetails) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Image src={errorImage} alt="Error" width={320} height={320} />
        <h1 className="text-xl font-bold">Error loading appointment</h1>
        <p className="text-gray-500 text-sm">Please try again later</p>
      </div>
    );
  }

  const currentStatusValue = statusLabelToValue(visitDetails.status);

  return (
    <div className="space-y-6">
      <Accordion
        type="multiple"
        defaultValue={["appointment-info", "patient-details", "update-status"]}
      >
        {/* ── Appointment Information ──────────────────────────────── */}
        <AccordionItem value="appointment-info" className="border rounded-lg bg-white">
          <AccordionTrigger className="px-4 py-2 hover:no-underline">
            <div className="flex items-center gap-2 pt-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              <span className="font-semibold">Appointment Information</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4">
            <Card className="border-0 shadow-none py-2">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-muted-foreground">Visit No</label>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>VISIT-{visitDetails.visitNo}</span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-muted-foreground">EMR Number</label>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>{visitDetails.emrNumber || "—"}</span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-muted-foreground">Visit Type</label>
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <span>{visitDetails.visitType || "—"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-muted-foreground">Clinician</label>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{visitDetails.clinicianName || "—"}</span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-muted-foreground">Department</label>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>{visitDetails.medicalDepartmentName || "—"}</span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-muted-foreground">Appointment Date</label>
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <span>{visitDetails.visitDate || "—"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-muted-foreground">Slot Time</label>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{visitDetails.startTime || "—"}</span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-muted-foreground">Current Status</label>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColors(visitDetails.status)}`}>
                        {visitDetails.status || "—"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* ── Patient Details ──────────────────────────────────────── */}
        <AccordionItem value="patient-details" className="border rounded-lg mt-4 bg-white">
          <AccordionTrigger className="px-4 py-2 hover:no-underline">
            <div className="flex items-center gap-2 pt-2">
              <User className="h-5 w-5 text-green-600" />
              <span className="font-semibold">Patient Details</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 bg-white">
            <Card className="border-0 shadow-none py-2">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-muted-foreground">Patient Name</label>
                    <div className="flex items-center gap-2">
                      <User className="size-4 text-muted-foreground" />
                      <span>{visitDetails.patientName || "—"}</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-muted-foreground">Mobile No</label>
                    <div className="flex items-center gap-2">
                      <Phone className="size-4 text-muted-foreground" />
                      <span>{visitDetails.mobileNumber || "—"}</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-muted-foreground">EMR Number</label>
                    <div className="flex items-center gap-2">
                      <FileText className="size-4 text-muted-foreground" />
                      <span>{visitDetails.emrNumber || "—"}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* ── Update Status ────────────────────────────────────────── */}
        <AccordionItem value="update-status" className="border rounded-lg mt-4 bg-white">
          <AccordionTrigger className="px-4 py-2 hover:no-underline">
            <div className="flex items-center gap-2 pt-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              <span className="font-semibold">Update Status</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-6">
            <Card className="border-0 shadow-none py-2">
              <CardContent className="p-0">
                <div className="max-w-xs space-y-3">
                  <label className="text-sm font-medium text-muted-foreground">
                    Appointment Status
                  </label>
                  <Select
                    defaultValue={String(currentStatusValue)}
                    onValueChange={handleStatusChange}
                    disabled={isChanging}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map(opt => (
                        <SelectItem key={opt.value} value={String(opt.value)}>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColors(opt.label)}`}>
                            {opt.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Changing status will save immediately.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => router.push("/appointments/appointment-list")}
              >
                Back to List
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}