import type { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { AddClinicianForm } from "./components/add-clinician-form";

export const metadata: Metadata = {
  title: "E-Medical Record / Create Clinician",
  description: "E-Medical Record / Create Clinician",
};

export default function CreateClinicianPage() {
  return (
    <section className="flex flex-col gap-4">
      <Link
        href="/masters/clinician-management?tab=clinician"
        className="flex items-center gap-0.5 text-primary"
      >
        <ChevronLeft className="w-4 h-4" />
        <p className="text-sm">Back to Clinicians</p>
      </Link>
      <section className="flex flex-col gap-4 px-4 py-6 rounded-md border bg-white">
        <h1 className="text-2xl font-semibold">Create Clinician</h1>
        <AddClinicianForm />
      </section>
    </section>
  );
}
