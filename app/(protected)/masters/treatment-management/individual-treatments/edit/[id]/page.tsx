import type { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { PageHeader } from "@/components/page-header";
import { AddTreatmentForm } from "../../create/components/add-treatment-form";

type TreatmentManagementEditPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata: Metadata = {
  title: "E-Medical Record / Edit Individual Treatment",
  description: "E-Medical Record / Edit Individual Treatment",
};

export default function TreatmentManagementEditPage({ params }: TreatmentManagementEditPageProps) {
  const { id } = use(params);

  return (
    <section className="flex flex-col gap-4">
      <Link
        href="/masters/treatment-management"
        className="flex items-center gap-0.5 text-primary"
      >
        <ChevronLeft className="w-4 h-4" />
        <p className="text-sm">Back to Treatment Management</p>
      </Link>
      <section className="flex flex-col gap-4 px-4 py-6 rounded-md border bg-white">
        <PageHeader
          title="Edit Treatment"
          description="Update the treatment details"
        />
        <AddTreatmentForm treatmentId={id} />
      </section>
    </section>
  );
}
