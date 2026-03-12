import type { Metadata } from "next";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { AddNationalityForm } from "../../create/components/add-nationality-form";
import { EditNationalityHeader } from "./components/edit-nationality-header";

export const metadata: Metadata = {
  title: "E-Medical Record / Edit Nationality",
  description: "E-Medical Record / Edit Nationality",
};

export default async function EditNationalityPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id as string;

  return (
    <section className="flex flex-col gap-4">
      <Link
        href="/masters/general?tab=nationality"
        className="flex items-center gap-0.5 text-primary"
      >
        <ChevronLeft className="w-4 h-4" />
        <p className="text-sm">Back to Nationality</p>
      </Link>
      <section className="flex flex-col gap-4 px-4 py-6 rounded-md border bg-white">
        <EditNationalityHeader />
        <AddNationalityForm nationalityId={id} />
      </section>
    </section>
  );
}
