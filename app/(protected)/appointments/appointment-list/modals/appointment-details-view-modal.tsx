"use client";

import { Building2, Calendar, Clock, Mail, MapPin, Phone, User } from "lucide-react";
import Image from "next/image";
import { Separator } from "@radix-ui/react-separator";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import errorImage from "@/public/assets/svg/common/error.svg";
import { useGetVisitByIdQuery } from "@/queries/visit/useGetVisitByIdQuery";
import { AppointmentDetailsSkeleton } from "../[id]/view/components/loader";

type AppointmentDetailsViewModalProps = {
  open: boolean;
  appointmentId: string | null; // ← changed from number to string (Guid)
  onOpenChange: (open: boolean) => void;
};

export function AppointmentDetailsViewModal({
  open,
  onOpenChange,
  appointmentId,
}: AppointmentDetailsViewModalProps) {
  const { visitDetails, isPending, isError } = useGetVisitByIdQuery(
    appointmentId ?? "",
  );

  const handleOnClose = (open: boolean) => {
    setTimeout(() => {
      document.body.style.pointerEvents = "";
    }, 500);
    onOpenChange(open);
  };

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <Dialog open={open} onOpenChange={handleOnClose}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden rounded-lg">

          {/* Loading */}
          {isPending && (
            <div className="p-6">
              <AppointmentDetailsSkeleton />
            </div>
          )}

          {/* Error */}
          {isError && !isPending && (
            <div className="flex flex-col items-center justify-center p-10 bg-gray-100">
              <Image src={errorImage} alt="Error" width={200} height={200} />
              <h1 className="text-xl font-bold mt-4">Error loading data</h1>
              <p className="text-gray-500 text-sm">Please try again later</p>
            </div>
          )}

          {/* Content */}
          {!isPending && !isError && visitDetails && (
            <>
              {/* Header */}
              <div className="bg-slate-50 p-6 border-b">
                <div className="flex items-start gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-semibold text-slate-800">
                        Appointment Details
                      </h2>
                      <span className="font-medium text-primary text-xl">
                        (VISIT-
                        {visitDetails.visitNo}
                        )
                      </span>
                    </div>
                    <div className="flex items-center mt-3 text-sm text-slate-600 space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{visitDetails.visitDate || "—"}</span>
                      <span className="text-slate-300">|</span>
                      <Clock className="h-4 w-4" />
                      <span>{visitDetails.startTime || "—"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clinician Information */}
              <div className="px-6 pt-4 bg-white">
                <h3 className="text-base font-medium text-slate-800 mb-3">
                  Clinician Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500">Clinician Name</p>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-slate-400" />
                      <p className="text-sm">{visitDetails.clinicianName || "—"}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500">Department</p>
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4 text-slate-400" />
                      <p className="text-sm">{visitDetails.medicalDepartmentName || "—"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-slate-100 my-2" />

              {/* Patient Information */}
              <div className="px-6 space-y-3 pb-4">
                <h3 className="text-base font-medium text-slate-800">
                  Patient Information
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500">Patient Name</p>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-slate-400" />
                      <p className="text-sm">{visitDetails.patientName || "—"}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-slate-500">EMR Number</p>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-slate-400" />
                      <p className="text-sm">{visitDetails.emrNumber || "—"}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500">Mobile Number</p>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-slate-400" />
                      <p className="text-sm">{visitDetails.mobileNumber || "—"}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-slate-500">Visit Type</p>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <p className="text-sm">{visitDetails.visitType || "—"}</p>
                    </div>
                  </div>
                </div>

                {/* No remarks yet */}
                <div className="space-y-1 pt-2">
                  <p className="text-xs text-slate-500">Remarks</p>
                  <p className="text-sm text-gray-400 italic">No remarks available.</p>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 bg-slate-50 border-t flex justify-end space-x-3">
                <Button variant="default" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}