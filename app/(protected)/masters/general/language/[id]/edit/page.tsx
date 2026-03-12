import type { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { AddLanguageForm } from "../../create/components/add-language-form";
import { EditLanguageHeader } from "./components/edit-language-header";

export const metadata: Metadata = {
  title: "E-Medical Record / Edit Language",
  description: "E-Medical Record / Edit Language",
};

export default async function LanguageEditPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id as string;

  return (
    <section className="flex flex-col gap-4">
      <Link
        href="/masters/general?tab=language"
        className="flex items-center gap-0.5 text-primary"
      >
        <ChevronLeft className="w-4 h-4" />
        <p className="text-sm">Back to Languages</p>
      </Link>
      <section className="flex flex-col gap-4 px-4 py-6 rounded-md border bg-white">
        <EditLanguageHeader />
        <AddLanguageForm languageId={id} />
      </section>
    </section>
  );
}
