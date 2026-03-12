import type { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { AddClinicianForm } from "../../create/components/add-clinician-form";

export const metadata: Metadata = {
  title: "E-Medical Record / Edit Clinician",
  description: "E-Medical Record / Edit Clinician",
};

export default async function EditClinicianPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id as string;

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
        <h1 className="text-2xl font-semibold">Edit Clinician</h1>
        <AddClinicianForm clinicianId={id} />
      </section>
    </section>
  );
}
