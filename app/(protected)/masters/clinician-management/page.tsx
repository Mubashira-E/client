import type { Metadata } from "next";
import { Suspense } from "react";
import { ClinicianManagementTabs } from "./clinician-management-tabs";

export const metadata: Metadata = {
  title: "E-Medical Record / Clinician Management",
  description: "E-Medical Record / Clinician Management",
};

export default function ClinicianManagementPage() {
  return (
    <Suspense>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <h1 className="text-xl font-medium text-gray-800">Clinician Management</h1>
          <p className="text-sm text-gray-600 -mt-1">Manage your clinicians</p>
        </div>
        <ClinicianManagementTabs />
      </div>
    </Suspense>
  );
}
