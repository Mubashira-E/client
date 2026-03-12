"use client";

import { CalendarIcon, Clock, Mail, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ReviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  appointmentData: {
    patientName: string;
    email: string;
    mobile: string;
    dateOfBirth: string;
    clinician: string;
    slotDate: string;
    slotTime: string;
    roomName?: string;
  };
};

export function ReviewModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  appointmentData,
}: ReviewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Review Details
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Please review the appointment details before confirming.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Patient Name</p>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-blue-600" />
                <p className="font-medium">{appointmentData.patientName || "—"}</p>
              </div>
            </div>

            {appointmentData.mobile && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Mobile</p>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-blue-600" />
                  <p className="font-medium">{appointmentData.mobile}</p>
                </div>
              </div>
            )}

            {appointmentData.email && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Email</p>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <p className="font-medium">{appointmentData.email}</p>
                </div>
              </div>
            )}

            {appointmentData.dateOfBirth && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Date Of Birth</p>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-blue-600" />
                  <p className="font-medium">{appointmentData.dateOfBirth}</p>
                </div>
              </div>
            )}

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Clinician</p>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-green-600" />
                <p className="font-medium">{appointmentData.clinician || "—"}</p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">New Date</p>
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-green-600" />
                <p className="font-medium">{appointmentData.slotDate || "—"}</p>
              </div>
            </div>

            <div className="space-y-1 md:col-span-2">
              <p className="text-sm text-muted-foreground">New Time Slot</p>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-600" />
                <p className="font-medium">{appointmentData.slotTime || "—"}</p>
              </div>
            </div>

            {appointmentData.roomName && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Room</p>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-[10px] text-green-700 font-bold">
                      R
                    </span>
                  </div>
                  <p className="font-medium">{appointmentData.roomName}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-end mt-6 gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            className="bg-primary"
            onClick={onConfirm}
            disabled={isLoading}
            isLoading={isLoading}
          >
            Reschedule Appointment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}