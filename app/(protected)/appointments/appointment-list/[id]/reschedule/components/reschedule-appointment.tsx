"use client";

import type React from "react";
import {
  AlertCircle,
  CalendarIcon,
  Check,
  Clock,
  FileText,
  Phone,
  User,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { parseAsString, useQueryState } from "nuqs";
import { useState } from "react";
import { toast } from "sonner";
import { SlotsSkeletonLoader } from "@/app/(protected)/appointments/book-appointment/components/slot-skeleton-loader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import errorImage from "@/public/assets/svg/common/error.svg";
import { useGetAvailableSlotsQuery } from "@/queries/visit/useGetAvailableSlotsQuery";
import { useGetVisitByIdQuery } from "@/queries/visit/useGetVisitByIdQuery";
import { useRescheduleVisitMutation } from "@/queries/visit/useRescheduleVisitMutation";
import { RescheduleAppointmentSkeleton } from "./reschedule-appointment-skeleton";
import { ReviewModal } from "./review-modal";

// Convert "dd-MM-yyyy" → "yyyy-MM-dd" for <input type="date">
function backendDateToInput(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const parts = dateStr.split("-");
    if (parts.length !== 3) return "";
    const [day, month, year] = parts;
    return `${year}-${month}-${day}`;
  }
  catch {
    return "";
  }
}

export function RescheduleAppointment({ appointmentId }: { appointmentId?: string }) {
  const router = useRouter();
  const [returnParams] = useQueryState("returnParams", parseAsString.withDefault(""));

  // ── Real visit data ──────────────────────────────────────────────────────
  const { visitDetails, isPending, isError } = useGetVisitByIdQuery(appointmentId ?? "");

  // ── UI state ─────────────────────────────────────────────────────────────
  const [preferredDate, setPreferredDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const defaultDate = visitDetails?.visitDate ? backendDateToInput(visitDetails.visitDate) : "";
  const activeDateForSlots = preferredDate || defaultDate;

  // ── Slot query — only fires after visitDetails is loaded ─────────────────
  // KEY FIX: `enabled` depends on visitDetails being available.
  // Without this, the query fires on mount with undefined clinicianId,
  // causing a 401 race condition that redirects to login.
  const { data: slots, isFetching: isLoadingSlots } = useGetAvailableSlotsQuery({
    clinicianId: visitDetails?.clinicianId,
    date: activeDateForSlots || undefined,
    treatmentId: visitDetails?.treatmentId,
    roomId: visitDetails?.roomId,
  });

  // ── Reschedule mutation ──────────────────────────────────────────────────
  const { mutate: reschedule, isPending: isRescheduling } = useRescheduleVisitMutation();

  // ── Handlers ─────────────────────────────────────────────────────────────
  function handleSlotSelect(slotTime: string, startTimeIso: string) {
    setSelectedSlot(slotTime);
    setSelectedStartTime(startTimeIso);
  }

  function handleContinue() {
    if (!selectedSlot) { toast.error("Please select a time slot"); return; }
    if (!remarks.trim()) { toast.error("Please provide remarks for rescheduling"); return; }
    setIsReviewModalOpen(true);
  }

  function handleSubmitReschedule() {
    if (!visitDetails || !appointmentId) return;
    reschedule(
      { visitId: appointmentId, newVisitDate: selectedStartTime, newClinicianId: visitDetails.clinicianId },
      {
        onSuccess: (res) => {
          if (res.status === "Rescheduled" || res.visitId) {
            toast.success("Appointment rescheduled successfully");
            const params = returnParams ? `?${returnParams}` : "";
            router.push(`/appointments/appointment-list${params}`);
          }
          else {
            toast.error("Failed to reschedule appointment");
          }
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.detail ?? err?.response?.data?.message ?? "Error rescheduling appointment");
        },
      },
    );
  }

  if (isPending) return <RescheduleAppointmentSkeleton />;
  if (isError || !visitDetails) {
    return (
      <div className="flex flex-col items-center justify-center">
        <Image src={errorImage} alt="Error" width={320} height={320} />
        <h1 className="text-xl font-bold">Error loading appointment</h1>
        <p className="text-gray-500 text-sm">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Accordion type="multiple" defaultValue={["appointment-info", "patient-details", "reschedule"]}>

        {/* Appointment Info */}
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
                      <label className="text-sm font-medium text-muted-foreground">Department</label>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>{visitDetails.medicalDepartmentName || "—"}</span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-muted-foreground">Clinician</label>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{visitDetails.clinicianName || "—"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
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
                      <label className="text-sm font-medium text-muted-foreground">Status</label>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        <span>{visitDetails.status || "—"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Patient Details */}
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

        {/* Reschedule */}
        <AccordionItem value="reschedule" className="border rounded-lg mt-4 bg-white">
          <AccordionTrigger className="px-4 py-2 hover:no-underline">
            <div className="flex items-center gap-2 pt-2">
              <CalendarIcon className="size-5 text-purple-600" />
              <span className="font-semibold">Reschedule Appointment</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <Card className="border-0 shadow-none py-2">
              <CardContent className="p-0">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="text-sm text-gray-500 whitespace-nowrap">
                      Preferred Date <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      value={preferredDate || defaultDate}
                      onChange={(e) => {
                        setPreferredDate(e.target.value);
                        setSelectedSlot("");
                        setSelectedStartTime("");
                      }}
                      className="w-48"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-muted-foreground">
                      Remarks <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      placeholder="Enter reason for rescheduling"
                      className="mt-1"
                      value={remarks}
                      onChange={e => setRemarks(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-sm font-medium mb-3">
                    Slots Available for{" "}
                    <span className="text-primary">{visitDetails.clinicianName}</span>
                    {" "}on{" "}
                    <span className="text-primary">{activeDateForSlots || "—"}</span>
                  </p>

                  {isLoadingSlots
                    ? <SlotsSkeletonLoader />
                    : !slots || slots.length === 0
                      ? <p className="text-sm text-gray-500 italic">No slots available for this date.</p>
                      : (
                          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                            {slots.map(slot => (
                              <Button
                                type="button"
                                variant="outline"
                                key={slot.startTime}
                                disabled={!slot.isAvailable}
                                title={!slot.isAvailable ? "Already Booked" : "Select this slot"}
                                className={cn(
                                  "flex gap-2 h-10 px-4 justify-center items-center relative border transition-colors",
                                  slot.isAvailable
                                    ? "bg-green-50 border-green-600 text-green-900 hover:bg-green-100"
                                    : "bg-red-50 border-red-200 text-red-900 opacity-60 cursor-not-allowed",
                                  selectedSlot === slot.timeSlot && slot.isAvailable && "ring-2 ring-primary ring-offset-2",
                                )}
                                onClick={() => slot.isAvailable && handleSlotSelect(slot.timeSlot, slot.startTime)}
                              >
                                <Clock className={cn("size-3.5", selectedSlot === slot.timeSlot ? "text-primary" : "text-slate-400")} />
                                <span className="text-xs font-medium">{slot.timeSlot}</span>
                                {selectedSlot === slot.timeSlot && (
                                  <span className="absolute -top-1 -right-1">
                                    <Check size={14} className="text-white bg-green-600 rounded-full border border-green-600 p-0.5" />
                                  </span>
                                )}
                              </Button>
                            ))}
                          </div>
                        )}

                  <div className="flex justify-end gap-2 mt-6">
                    <Button variant="outline" className="text-gray-600" onClick={() => router.push("/appointments/appointment-list")}>Back</Button>
                    <Button
                      variant="outline"
                      onClick={() => { setPreferredDate(defaultDate); setRemarks(""); setSelectedSlot(""); setSelectedStartTime(""); }}
                    >
                      Clear
                    </Button>
                    <Button className="bg-primary" onClick={handleContinue} disabled={isRescheduling}>Continue</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onConfirm={handleSubmitReschedule}
        isLoading={isRescheduling}
        appointmentData={{
          patientName: visitDetails.patientName,
          email: "",
          mobile: visitDetails.mobileNumber ?? "",
          dateOfBirth: "",
          clinician: visitDetails.clinicianName,
          slotDate: activeDateForSlots,
          slotTime: selectedSlot,
        }}
      />
    </div>
  );
}