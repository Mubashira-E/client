import type { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { AddMedicalDepartmentForm } from "../../create/components/add-medical-department-form";
import { EditMedicalDepartmentHeader } from "./components/edit-medical-department-header";

export const metadata: Metadata = {
  title: "E-Medical Record / Edit Medical Department",
  description: "E-Medical Record / Edit Medical Department",
};

export default async function EditMedicalDepartmentPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id as string;

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
        <EditMedicalDepartmentHeader />
        <AddMedicalDepartmentForm medicalDepartmentId={id} />
      </div>
    </section>
  );
}
