import type { Metadata } from "next";
import { Suspense } from "react";
import { TreatmentTabs } from "./treatment-tabs";

export const metadata: Metadata = {
  title: "E-Medical Record / Treatment Management",
  description: "E-Medical Record / Treatment Management",
};

export default function TreatmentsPage() {
  return (
    <Suspense>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <h1 className="text-xl font-medium text-gray-800">Treatment Management</h1>
          <p className="text-sm text-gray-600 -mt-1">Manage and organize treatment procedures and therapies</p>
        </div>
        <TreatmentTabs />
      </div>
    </Suspense>
  );
}
