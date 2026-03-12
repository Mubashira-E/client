import type { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { AddSubServiceClassificationForm } from "./components/add-sub-service-classification-form";
import { AddSubServiceClassificationHeader } from "./components/add-sub-service-classification-header";

export const metadata: Metadata = {
  title: "E-Medical Record / Create Sub Service Classification",
  description: "E-Medical Record / Create Sub Service Classification",
};

export default function CreateSubServiceClassificationPage() {
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
        <AddSubServiceClassificationHeader />
        <Suspense fallback={<div>Loading...</div>}>
          <AddSubServiceClassificationForm />
        </Suspense>
      </section>
    </section>
  );
}
