import type { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { AddMedicalDepartmentForm } from "./components/add-medical-department-form";
import { AddMedicalDepartmentHeader } from "./components/add-medical-department-header";

export const metadata: Metadata = {
  title: "E-Medical Record / Create Medical Department",
  description: "E-Medical Record / Create Medical Department",
};

export default function CreateMedicalDepartmentPage() {
  return (
    <section className="flex flex-col gap-4">
      <Link
        href="/masters/clinician-management?tab=department"
        className="flex items-center gap-0.5 text-primary"
      >
        <ChevronLeft className="w-4 h-4" />
        <p className="text-sm">Back to Medical Departments</p>
      </Link>
      <div className="flex flex-col gap-4 px-4 py-6 rounded-md border bg-white">
        <AddMedicalDepartmentHeader />
        <AddMedicalDepartmentForm />
      </div>
    </section>
  );
}
