import type { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { PageHeader } from "@/components/page-header";
import { VisitConfirmationForm } from "./components/visit-confirmation-form";

export const metadata: Metadata = {
  title: "E-Medical Record / Visit Confirmation Patient",
  description: "E-Medical Record / Visit Confirmation Patient",
};

export default function VisitConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
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
          title="Visit Confirmation"
          description="Confirm and schedule the patient visit"
        />
        <VisitConfirmationForm patientId={id} />
      </section>
    </section>
  );
}
