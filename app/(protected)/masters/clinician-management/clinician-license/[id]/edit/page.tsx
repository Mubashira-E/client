import type { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { AddClinicianLicenseForm } from "../../create/components/add-clinician-license-form";
import { EditClinicianLicenseHeader } from "./components/edit-clinician-license-header";

export const metadata: Metadata = {
  title: "E-Medical Record / Edit Clinician License",
  description: "E-Medical Record / Edit Clinician License",
};

export default async function EditClinicianLicensePage() {
  return (
    <section className="flex flex-col gap-4">
      <Link
        href="/masters/clinician-management?tab=clinician"
        className="flex items-center gap-0.5 text-primary"
      >
        <ChevronLeft className="w-4 h-4" />
        <p className="text-sm">Back to Clinician</p>
      </Link>
      <section className="flex flex-col gap-4 px-4 py-6 rounded-md border bg-white">
        <EditClinicianLicenseHeader />
        <AddClinicianLicenseForm />
      </section>
    </section>
  );
}
