"use client";

import type { CreateAppointmentSchema } from "../schema/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarCheck, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { api } from "@/lib/axios";
import { useCreateVisitMutation } from "@/queries/visit/useCreateVisitMutation";
import { AppointmentSchema } from "../schema/schema";
import { ClinicianDetailContainer } from "./clinician-detail-container";
import { ClinicianSkeletonLoader } from "./clinician-skeleton-loader";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isoToTimeSpan(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) throw new Error("invalid");
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:00`;
  }
  catch { return "00:00:00"; }
}

function labelToTimeSpan(part: string): string {
  const clean = part.trim();
  const m12 = clean.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (m12) {
    let h = Number.parseInt(m12[1], 10);
    const min = m12[2];
    const period = m12[3].toUpperCase();
    if (period === "PM" && h !== 12) h += 12;
    if (period === "AM" && h === 12) h = 0;
    return `${String(h).padStart(2, "0")}:${min}:00`;
  }
  const m24 = clean.match(/^(\d{1,2}):(\d{2})$/);
  if (m24) return `${String(Number.parseInt(m24[1], 10)).padStart(2, "0")}:${m24[2]}:00`;
  return "00:00:00";
}

function extractApiError(err: any, fallback: string): string {
  const data = err?.response?.data;
  if (!data) return fallback;
  if (Array.isArray(data.errors) && data.errors.length > 0)
    return data.errors.map((e: any) => e.message ?? e.Message ?? JSON.stringify(e)).join(", ");
  if (data.errors && typeof data.errors === "object") {
    const msgs = Object.values(data.errors).flat();
    if (msgs.length > 0) return msgs.join(", ");
  }
  return data.detail ?? data.Detail ?? data.title ?? data.Title ?? data.Message ?? data.message ?? fallback;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function BookAppointmentForm() {
  const router = useRouter();
  const { mutateAsync: createVisit, isPending: isCreatingVisit } = useCreateVisitMutation();
  const [isCreatingPatient, setIsCreatingPatient] = useState(false);
  const isPending = isCreatingPatient || isCreatingVisit;

  const form = useForm<CreateAppointmentSchema>({
    resolver: zodResolver(AppointmentSchema),
    mode: "onBlur",
    defaultValues: {
      patientId: "",
      clinicianId: "",
      roomId: "",
      treatmentId: "",
      departmentId: "",
      remarks: "",
      bookedInfo: { slotDate: "", rotaName: "", slots: [] },
    },
  });

  const onSubmit = async (values: CreateAppointmentSchema) => {
    // ── Guard: slot ─────────────────────────────────────────────────────────
    if (!values.bookedInfo.slots.length) {
      toast.error("Please select a time slot");
      return;
    }

    // ── Guard: clinician + room — required by PostVisitValidator ────────────
    if (!values.clinicianId) { toast.error("Please select a clinician"); return; }
    if (!values.roomId)      { toast.error("Please select a room");      return; }

    // ── STEP 1: Resolve patientId (new patient → POST /api/v1/patient) ──────
    let resolvedPatientId = values.patientId;

    if (!resolvedPatientId || resolvedPatientId === "new") {
      const info = values.patientInfo;
      const errors: string[] = [];

      if (!info?.firstName?.trim())  errors.push("First Name is required");
      if (!info?.lastName?.trim())   errors.push("Last Name is required");
      if (!info?.mobileNo?.trim() || !/^\+?[1-9]\d{1,14}$/.test(info.mobileNo.replace(/\s/g, "")))
        errors.push("Valid Phone Number is required (e.g. +971501234567)");
      if (!info?.emiratesId?.trim() || !/^784-\d{4}-\d{7}-\d$/.test(info.emiratesId))
        errors.push("Emirates ID required in format 784-XXXX-XXXXXXX-X");
      if (!info?.genderId || ![1, 2].includes(Number(info.genderId)))
        errors.push("Please select a valid Gender");
      if (!info?.dateOfBirth?.trim()) errors.push("Date of Birth is required");

      const nationalityGuid = info?.countryName ?? "";
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(nationalityGuid))
        errors.push("Please select a Country / Nationality");

      if (errors.length > 0) { errors.forEach(e => toast.error(e)); return; }

      try {
        setIsCreatingPatient(true);
        const [, , dobYear] = (info!.dateOfBirth ?? "01/01/2000").split("/");
        const age = Math.max(0, new Date().getFullYear() - Number.parseInt(dobYear ?? "2000", 10));

        const patientRes = await api.post("/api/v1/patient", {
          firstName:     info!.firstName!.trim(),
          lastName:      info!.lastName!.trim(),
          age,
          mobileNumber:  info!.mobileNo!.replace(/\s/g, ""),
          emiratesId:    info!.emiratesId!.trim(),
          genderId:      Number(info!.genderId),
          nationalityId: nationalityGuid,
          address:       info!.patientAddress?.trim() ?? "",
          email:         info!.email?.trim() ?? "",
        });

        const newId: string =
          patientRes.data?.id ??
          patientRes.data?.Id ??
          patientRes.data?.data?.id ??
          patientRes.data?.data?.Id;

        if (!newId) {
          toast.error("Patient registered but ID not returned — please book as existing patient");
          return;
        }

        resolvedPatientId = newId;
        toast.success(`Patient registered — EMR: ${patientRes.data?.eMRNumber ?? ""}`);
      }
      catch (err: any) {
        toast.error(extractApiError(err, "Failed to register patient"));
        return;
      }
      finally {
        setIsCreatingPatient(false);
      }
    }

    // ── STEP 2: Build time values ────────────────────────────────────────────
    const firstSlot = values.bookedInfo.slots[0];
    let startTime: string;
    let endTime: string;

    if (firstSlot.startTime && firstSlot.endTime) {
      startTime = isoToTimeSpan(firstSlot.startTime);
      endTime   = isoToTimeSpan(firstSlot.endTime);
    }
    else {
      const [startRaw = "", endRaw = ""] = firstSlot.slotTime.split(" - ");
      startTime = labelToTimeSpan(startRaw);
      endTime   = labelToTimeSpan(endRaw);
    }

    // slotDate "dd/MM/yyyy" → "yyyy-MM-dd" for .NET
    const [day, month, year] = values.bookedInfo.slotDate.split("/");
    const visitDate = `${year}-${month}-${day}`;

    // ── DEBUG: log exactly what we are sending ────────────────────────────
    // Remove these console.logs once confirmed working
    const visitPayload = {
      patientId:   resolvedPatientId,
      clinicianId: values.clinicianId,
      roomId:      values.roomId,
      visitDate,
      startTime,
      endTime,
    };
    console.log("📋 Visit payload being sent:", visitPayload);
    console.log("📅 Raw slotDate:", values.bookedInfo.slotDate);
    console.log("⏰ Raw slotTime:", firstSlot.slotTime);
    console.log("⏰ Raw startTime:", firstSlot.startTime, "endTime:", firstSlot.endTime);

    // ── STEP 3: POST /api/v1/visit → saves to Visit table ───────────────────
    // Backend ALWAYS returns HTTP 200 — errors are { isSuccess: false, message: "..." }
    try {
      const visitRes = await createVisit(visitPayload);

      console.log("📬 Visit response:", visitRes);

      if (!visitRes.isSuccess) {
        // Show the EXACT backend message so we know which rule failed:
        // e.g. "Clinician is busy", "Room is occupied", "Clinician does not have an assigned department"
        toast.error(visitRes.message ?? "Failed to create appointment");
        return;
      }

      toast.success("Appointment booked successfully!");
      router.push("/appointments/appointment-list");
    }
    catch (err: any) {
      console.error("❌ Visit creation network error:", err);
      toast.error(extractApiError(err, "Failed to create appointment"));
    }
  };

  const firstSlotTime = form.watch("bookedInfo.slots.0.slotTime");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-7xl mx-auto space-y-6"
      >
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <Suspense fallback={<ClinicianSkeletonLoader />}>
              <ClinicianDetailContainer isPending={isPending} />
            </Suspense>
          </div>

          <div className="flex justify-end items-center gap-4 p-4 border border-slate-200 bg-white shadow-lg rounded-xl sticky bottom-6 z-10 mx-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isPending}
              className="min-w-25"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="min-w-50 shadow-md transition-all active:scale-95"
              disabled={isPending || !firstSlotTime}
            >
              {isPending
                ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isCreatingPatient ? "Registering patient..." : "Saving appointment..."}
                    </>
                  )
                : (
                    <>
                      <CalendarCheck className="mr-2 h-4 w-4" />
                      Confirm &amp; Save Booking
                    </>
                  )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}