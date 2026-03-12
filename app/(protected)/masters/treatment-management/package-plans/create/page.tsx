import type { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { AddPackageForm } from "./components/add-package-form";

export const metadata: Metadata = {
  title: "E-Medical Record / Create Package Plan",
  description: "E-Medical Record / Create Package Plan",
};

export default function PackageCreatePage() {
  return (
    <section className="flex flex-col gap-4">
      <Link
        href="/masters/treatment-management?tab=package-plans"
        className="flex items-center gap-0.5 text-primary"
      >
        <ChevronLeft className="w-4 h-4" />
        <p className="text-sm">Back to Package Plans</p>
      </Link>
      <section className="flex flex-col gap-4 px-4 py-6 rounded-md border bg-white">
        <PageHeader
          title="Create Package Plan"
          description="Create a new treatment package plan with special pricing and discounts"
        />
        <AddPackageForm />
      </section>
    </section>
  );
}
