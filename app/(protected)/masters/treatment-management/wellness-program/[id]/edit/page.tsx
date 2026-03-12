import type { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { AddWellnessProgramForm } from "../../create/components/add-wellness-program-form";

export const metadata: Metadata = {
  title: "E-Medical Record / Edit Wellness Program",
  description: "E-Medical Record / Edit Wellness Program",
};

export default async function EditWellnessProgramPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id as string;

  return (
    <section className="flex flex-col gap-4">
      <Link
        href="/masters/treatment-management?tab=wellness-program"
        className="flex items-center gap-0.5 text-primary"
      >
        <ChevronLeft className="w-4 h-4" />
        <p className="text-sm">Back to Wellness Programs</p>
      </Link>
      <section className="flex flex-col gap-4 px-4 py-6 rounded-md border bg-white">
        <PageHeader
          title="Edit Wellness Program"
          description="Update the wellness program details"
        />
        <AddWellnessProgramForm wellnessProgramId={id} />
      </section>
    </section>
  );
}
