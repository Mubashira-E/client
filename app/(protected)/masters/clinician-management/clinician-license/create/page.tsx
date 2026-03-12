import type { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { AddClinicianLicenseForm } from "./components/add-clinician-license-form";

export const metadata: Metadata = {
  title: "E-Medical Record / Create Clinician License",
  description: "E-Medical Record / Create Clinician License",
};

export default function ClinicianLicenseCreatePage() {
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
        <PageHeader
          title="Create Clinician"
          description="Create a new clinician entry"
        />
        <AddClinicianLicenseForm />
      </section>
    </section>
  );
}
