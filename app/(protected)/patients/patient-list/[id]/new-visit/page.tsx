import type { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { PageHeader } from "@/components/page-header";
import { NewVisitForm } from "./components/new-visit-form";

export const metadata: Metadata = {
  title: "E-Medical Record / New Patient Visit",
  description: "E-Medical Record / New Patient Visit",
};

export default function NewVisitPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <section className="flex flex-col gap-4">
      <Link
        href="/patients/patient-list"
        className="flex items-center gap-0.5 text-primary"
      >
        <ChevronLeft className="w-4 h-4" />
        <p className="text-sm">Back to Patient List</p>
      </Link>
      <section className="flex flex-col gap-4 px-4 py-6 rounded-md border bg-white">
        <PageHeader
          title="New Visit"
          description="Create a new visit for the patient"
        />
        <NewVisitForm patientId={id} />
      </section>
    </section>
  );
}
