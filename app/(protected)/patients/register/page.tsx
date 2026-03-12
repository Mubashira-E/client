"use client";

import { PatientRegistrationForm } from "./components/patient-registration-form";

export default function RegisterPatientPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">
          Register New Patient
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Add a new patient to the system. All registered patients will appear
          in the Patient List.
        </p>
      </div>
      <PatientRegistrationForm />
    </div>
  );
}
