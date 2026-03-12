import type { CreateAppointmentSchema } from "../schema/schema";

import {
  Calendar,
  Clock,
  Mail,
  MessageSquareDot,
  Phone,
  Stethoscope,
  User,
} from "lucide-react";

import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

type PreviewAppointmentProps = {
  isOpen: boolean;
  onClose: () => void;
  onBookAppointment: () => void;
  isCreatingAppointment: boolean;
  clinicianName: string;       // ← passed from clinician-detail-container
  departmentName: string;      // ← passed from clinician-detail-container
};

function formatValue(value: string | number | undefined | null): string {
  if (value === undefined || value === null || value === "" || value === 0) {
    return "N/A";
  }
  return String(value);
}

function formatPatientName(firstName?: string, lastName?: string): string {
  const name = [firstName, lastName].filter(Boolean).join(" ").trim();
  return name || "-";
}

export function PreviewAppointmentModal({
  isOpen,
  onClose,
  onBookAppointment,
  isCreatingAppointment,
  clinicianName,
  departmentName,
}: PreviewAppointmentProps) {
  const { getValues, control } = useFormContext<CreateAppointmentSchema>();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Review Appointment Details
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {/* Patient Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <User className="h-4 w-4" />
                <span>Patient Name</span>
              </div>
              <p className="font-medium">
                {formatPatientName(
                  getValues().patientInfo?.firstName,
                  getValues().patientInfo?.lastName,
                )}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </div>
              <p
                className={`font-medium break-all ${
                  !getValues().patientInfo?.email
                    ? "text-muted-foreground italic"
                    : ""
                }`}
              >
                {formatValue(getValues().patientInfo?.email)}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Phone className="h-4 w-4" />
                <span>Mobile Number</span>
              </div>
              <p
                className={`font-medium ${
                  !getValues().patientInfo?.mobileNo
                    ? "text-muted-foreground italic"
                    : ""
                }`}
              >
                {formatValue(getValues().patientInfo?.mobileNo)}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Calendar className="h-4 w-4" />
                <span>Date of Birth</span>
              </div>
              <p
                className={`font-medium ${
                  !getValues().patientInfo?.dateOfBirth
                    ? "text-muted-foreground italic"
                    : ""
                }`}
              >
                {formatValue(getValues().patientInfo?.dateOfBirth)}
              </p>
            </div>
          </div>

          {/* Appointment Info */}
          <div className="pt-2">
            <div className="rounded-lg bg-slate-50 p-4 border">
              <h3 className="font-medium mb-3">Appointment Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>Slot Date</span>
                  </div>
                  <p
                    className={`font-medium ${
                      !getValues().bookedInfo?.slotDate
                        ? "text-muted-foreground italic"
                        : ""
                    }`}
                  >
                    {formatValue(getValues().bookedInfo?.slotDate)}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Clock className="h-4 w-4" />
                    <span>Time</span>
                  </div>
                  {getValues().bookedInfo?.slots?.length > 0
                    ? (
                        <div className="flex flex-col gap-1">
                          {getValues().bookedInfo.slots.map((slot: any) => (
                            <p
                              key={`${slot.slotTime}-${slot.roomName}`}
                              className="font-medium text-sm"
                            >
                              {slot.slotTime}
                              {slot.roomName && (
                                <span className="text-gray-500 text-xs ml-1">
                                  (
                                  {slot.roomName}
                                  )
                                </span>
                              )}
                            </p>
                          ))}
                        </div>
                      )
                    : (
                        <p className="text-muted-foreground italic">N/A</p>
                      )}
                </div>

                {/* ── Real clinician name from props ── */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Stethoscope className="h-4 w-4" />
                    <span>Clinician</span>
                  </div>
                  <p
                    className={`font-medium ${
                      !clinicianName ? "text-muted-foreground italic" : ""
                    }`}
                  >
                    {formatValue(clinicianName)}
                  </p>
                </div>

                {/* ── Real department name from props ── */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <span className="h-4 w-4 flex items-center justify-center text-xs">
                      🏥
                    </span>
                    <span>Department</span>
                  </div>
                  <p
                    className={`font-medium ${
                      !departmentName ? "text-muted-foreground italic" : ""
                    }`}
                  >
                    {formatValue(departmentName)}
                  </p>
                </div>

              </div>
            </div>
          </div>

          {/* Remarks */}
          <div className="pt-2">
            <div className="rounded-lg bg-slate-50 p-4 border">
              <FormField
                control={control}
                name="remarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MessageSquareDot className="h-4 w-4" />
                      Remarks
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        className="mt-2"
                        placeholder="Enter any additional remarks or notes..."
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={onClose}
            disabled={isCreatingAppointment}
          >
            Close
          </Button>
          <Button
            size="sm"
            variant="default"
            type="button"
            onClick={onBookAppointment}
            disabled={isCreatingAppointment}
            isLoading={isCreatingAppointment}
          >
            Book Appointment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}