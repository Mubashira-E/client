import type { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { PageHeader } from "@/components/page-header";
import { AddPackageForm } from "../../create/components/add-package-form";

type PackageEditPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata: Metadata = {
  title: "E-Medical Record / Edit Package Plan",
  description: "E-Medical Record / Edit Package Plan",
};

export default function PackageEditPage({ params }: PackageEditPageProps) {
  const { id } = use(params);

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
          title="Edit Package"
          description="Update package details"
        />
        <AddPackageForm packageId={id} />
      </section>
    </section>
  );
}
