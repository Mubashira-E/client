import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { ClientFormWrapper } from "./components/client-form-wrapper";

export const metadata: Metadata = {
  title: "E-Medical Record / Update Appointment",
  description: "E-Medical Record / Update Appointment",
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  return (
    <main className="flex flex-col gap-4">
      <PageHeader title="Update Appointment" description="Update an appointment" />
      <ClientFormWrapper appointmentId={params.id} />
    </main>
  );
}
