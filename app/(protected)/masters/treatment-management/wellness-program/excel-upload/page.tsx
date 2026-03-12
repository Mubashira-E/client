import type { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { ExcelUploadContainer } from "./components/excel-upload-container";

export const metadata: Metadata = {
  title: "E-Medical Record / Excel Upload Wellness Program",
  description: "E-Medical Record / Excel Upload Wellness Program",
};

export default function ExcelUploadPage() {
  return (
    <section className="flex flex-col gap-4">
      <Link
        href="/masters/treatment-management/?tab=wellness-program"
        className="flex items-center gap-0.5 text-primary"
      >
        <ChevronLeft className="w-4 h-4" />
        <p className="text-sm">Back to Wellness Program</p>
      </Link>
      <section className="flex flex-col gap-4 px-4 py-6 rounded-md border bg-white">
        <PageHeader
          title="Excel Upload - Wellness Program"
          description="Upload wellness program master data using a predefined Excel template."
        />
        <ExcelUploadContainer />
      </section>
    </section>
  );
}
