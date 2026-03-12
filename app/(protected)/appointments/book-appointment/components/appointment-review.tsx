"use client";

import { Button } from "@/components/ui/button";

type AppointmentReviewProps = {
  patientName: string;
  email: string;
  mobileNo: string;
  dateOfBirth: string;
  slotDate: string;
  slotTime: string;
  clinician: string;
  department: string;
  onBack: () => void;
  onBookAppointment: () => void;
};

export function AppointmentReview({
  patientName,
  email,
  mobileNo,
  dateOfBirth,
  slotDate,
  slotTime,
  clinician,
  department,
  onBack,
  onBookAppointment,
}: AppointmentReviewProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-medium text-gray-800 mb-6">Review Appointment Details</h2>

      <div className="grid grid-cols-2 gap-y-8 mb-8">
        <div>
          <h3 className="text-sm text-gray-500 mb-1">Patient Name</h3>
          <p className="text-base font-medium text-gray-700">{patientName}</p>
        </div>
        <div>
          <h3 className="text-sm text-gray-500 mb-1">Email</h3>
          <p className="text-base font-medium text-gray-700">{email}</p>
        </div>
        <div>
          <h3 className="text-sm text-gray-500 mb-1">Mobile Number</h3>
          <p className="text-base font-medium text-gray-700">{mobileNo}</p>
        </div>
        <div>
          <h3 className="text-sm text-gray-500 mb-1">Date of Birth</h3>
          <p className="text-base font-medium text-gray-700">{dateOfBirth}</p>
        </div>
        <div>
          <h3 className="text-sm text-gray-500 mb-1">Slot Date</h3>
          <p className="text-base font-medium text-gray-700">{slotDate}</p>
        </div>
        <div>
          <h3 className="text-sm text-gray-500 mb-1">Time</h3>
          <p className="text-base font-medium text-gray-700">{slotTime}</p>
        </div>
        <div>
          <h3 className="text-sm text-gray-500 mb-1">Clinician</h3>
          <p className="text-base font-medium text-gray-700">{clinician}</p>
        </div>
        <div>
          <h3 className="text-sm text-gray-500 mb-1">Department</h3>
          <p className="text-base font-medium text-gray-700">{department}</p>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6 mt-4">
        <div className="flex justify-end gap-3">
          <Button variant="outline" className="text-gray-600" onClick={onBack}>
            Cancel
          </Button>
          <Button
            variant="outline"
            className="text-gray-600"
            onClick={onBack}
          >
            Back
          </Button>
          <Button
            className="bg-teal-500 hover:bg-teal-600 text-white"
            onClick={onBookAppointment}
          >
            Book Appointment
          </Button>
        </div>
      </div>
    </div>
  );
}
