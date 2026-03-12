import type { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { AddSubServiceClassificationForm } from "../../create/components/add-sub-service-classification-form";
import { EditSubServiceClassificationHeader } from "./components/edit-sub-service-classification-header";

export const metadata: Metadata = {
  title: "E-Medical Record / Edit Sub Service Classification",
  description: "E-Medical Record / Edit Sub Service Classification",
};

export default async function EditSubServiceClassificationPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id as string;
  return (
    <section className="flex flex-col gap-4">
      <Link
        href="/masters/clinician-management?tab=consultation-sub-service-classification"
        className="flex items-center gap-0.5 text-primary"
      >
        <ChevronLeft className="w-4 h-4" />
        <p className="text-sm">Back to Sub Service Classifications</p>
      </Link>
      <section className="flex flex-col gap-4 px-4 py-6 rounded-md border bg-white">
        <EditSubServiceClassificationHeader />
        <Suspense fallback={<div>Loading...</div>}>
          <AddSubServiceClassificationForm subServiceClassificationId={id} />
        </Suspense>
      </section>
    </section>
  );
}
