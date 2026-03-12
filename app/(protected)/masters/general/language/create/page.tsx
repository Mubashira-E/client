import type { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { AddLanguageForm } from "./components/add-language-form";

export const metadata: Metadata = {
  title: "E-Medical Record / Create Language",
  description: "E-Medical Record / Create Language",
};

export default function LanguageCreatePage() {
  return (
    <section className="flex flex-col gap-4">
      <Link
        href="/masters/general"
        className="flex items-center gap-0.5 text-primary"
      >
        <ChevronLeft className="w-4 h-4" />
        <p className="text-sm">Back to Languages</p>
      </Link>
      <section className="flex flex-col gap-4 px-4 py-6 rounded-md border bg-white">
        <PageHeader
          title="Create Language"
          description="Create a new language"
        />
        <AddLanguageForm />
      </section>
    </section>
  );
}
