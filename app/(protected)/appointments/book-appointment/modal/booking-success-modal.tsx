"use client";

import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { formatDateForApi } from "@/lib/date-time-utils";

type BookingSuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
  bookingData: {
    status?: string;
    message?: string;
    data?: {
      appointmentId: number;
      bookingNumber: string;
      tokenNo: number;
      patientInfo?: {
        firstName: string;
        middleName?: string;
        lastName: string;
        mrn?: string;
      };
      bookedInfo?: {
        slotDate: string;
        slots: {
          slotTime: string;
        };
      };
    };
    appointmentId?: number;
    bookingNumber?: string;
    tokenNo?: number;
    patientInfo?: {
      firstName: string;
      middleName?: string;
      lastName: string;
      mrn?: string;
    };
    bookedInfo?: {
      slotDate: string;
      slots: {
        slotTime: string;
      };
    };
  } | null;
};

export function BookingSuccessModal({ isOpen, onClose, bookingData }: BookingSuccessModalProps) {
  const router = useRouter();

  const handleCloseModal = () => {
    onClose();
    router.push("/appointments/appointment-list");
  };

  if (!bookingData) {
    return null;
  }

  // The actual appointment data is in bookingData.data
  const appointmentData = bookingData.data || bookingData;
  const patientInfo = appointmentData.patientInfo;

  const appointmentCode = appointmentData.bookingNumber || "N/A";
  const patientName = patientInfo
    ? `${patientInfo.firstName || ""} ${patientInfo.middleName || ""} ${patientInfo.lastName || ""}`.trim()
    : "N/A";

  // Format date and time to DD/MM/YYYY format
  const formatDateTime = (date: string, time?: string) => {
    if (!date)
      return "N/A";
    try {
      let dateObj: Date;

      // Check if the date is already in DD/MM/YYYY format
      if (date.includes("/")) {
        const parts = date.split("/");
        if (parts.length === 3) {
          // Parse DD/MM/YYYY format correctly
          const day = Number.parseInt(parts[0], 10);
          const month = Number.parseInt(parts[1], 10) - 1; // Month is 0-indexed
          const year = Number.parseInt(parts[2], 10);

          dateObj = new Date(year, month, day);
        }
        else {
          // Fallback to default parsing
          dateObj = new Date(date);
        }
      }
      else {
        // For other formats, use default parsing
        dateObj = new Date(date);
      }

      // Check if the date is valid
      if (Number.isNaN(dateObj.getTime())) {
        return "N/A";
      }

      // Format to DD/MM/YYYY using the utility function
      const formattedDate = formatDateForApi(dateObj);

      // Only show time if it's not empty
      const hasValidTime = time && time.trim() !== "";
      return hasValidTime ? `${formattedDate} at ${time}` : formattedDate;
    }
    catch {
      // Fallback: return the original date string
      const hasValidTime = time && time.trim() !== "";
      return hasValidTime ? `${date} at ${time}` : date;
    }
  };

  // Try multiple possible paths for date and time data
  let appointmentDateTime = "N/A";

  if (appointmentData.bookedInfo) {
    const bookedInfo = appointmentData.bookedInfo;

    // Try different possible structures
    const slotDate = bookedInfo.slotDate;
    const slotTime = bookedInfo.slots?.slotTime;

    if (slotDate) {
      appointmentDateTime = formatDateTime(slotDate, slotTime);
    }
  }
  else {
    // Try alternative paths in case the structure is different

    // Check if date/time is directly in appointmentData
    if ((appointmentData as any).slotDate) {
      appointmentDateTime = formatDateTime((appointmentData as any).slotDate, (appointmentData as any).slotTime);
    }

    // Check if there's an appointmentDate field
    if ((appointmentData as any).appointmentDate) {
      appointmentDateTime = formatDateTime((appointmentData as any).appointmentDate, (appointmentData as any).appointmentTime);
    }

    // Check if there's a date field
    if ((appointmentData as any).date) {
      appointmentDateTime = formatDateTime((appointmentData as any).date, (appointmentData as any).time);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Appointment Booked Successfully
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Your appointment has been successfully scheduled.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg bg-gray-50 p-4 text-center">
            <Label className="text-sm font-medium text-gray-700 block text-center">
              Appointment Code
            </Label>
            <div className="mt-1 text-2xl font-bold text-blue-600 tracking-wider">
              {appointmentCode}
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">
                Patient Name
                :
              </span>
              <span className="font-medium">{patientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">
                Date & Time
                :
              </span>
              <span className="font-medium">{appointmentDateTime}</span>
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 p-3">
            <p className="text-sm text-blue-800">
              <strong>
                Important
                :
              </strong>
              {" "}
              Please arrive 15 minutes before your scheduled appointment time.
            </p>
          </div>

          <Button onClick={handleCloseModal} className="w-full bg-primary hover:bg-primary/90">
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
