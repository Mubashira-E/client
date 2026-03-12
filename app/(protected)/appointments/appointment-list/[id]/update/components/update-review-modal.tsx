"use client";

import { CalendarIcon, Loader2, Mail, Phone, User } from "lucide-react";
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
  appointmentData: {
    patientName: string;
    email: string;
    mobile: string;
    dateOfBirth: string;
    clinician: string;
  };
  isSubmitting?: boolean;
};

export function UpdateReviewModal({ isOpen, onClose, onConfirm, appointmentData, isSubmitting = false }: ReviewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Review Details</DialogTitle>
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
                <p className="font-medium">{appointmentData.patientName}</p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Email</p>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600" />
                <p className="font-medium">{appointmentData.email}</p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Mobile</p>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-600" />
                <p className="font-medium">{appointmentData.mobile}</p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Date Of Birth</p>
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-blue-600" />
                <p className="font-medium">{appointmentData.dateOfBirth}</p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Clinician</p>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-green-600" />
                <p className="font-medium">{appointmentData.clinician}</p>
              </div>
            </div>

          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-end mt-6">
          <Button
            className="bg-primary"
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                )
              : (
                  "Update Appointment"
                )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
