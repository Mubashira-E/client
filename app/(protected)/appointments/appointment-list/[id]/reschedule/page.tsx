import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { RescheduleAppointment } from "./components/reschedule-appointment";

export const metadata: Metadata = {
  title: "E-Medical Record / Reschedule Appointment",
  description: "E-Medical Record / Reschedule Appointment",
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return (
    <main className="flex flex-col gap-4">
      <PageHeader title="Reschedule Appointment" description="Reschedule an appointment" />
      <RescheduleAppointment appointmentId={params.id} />
    </main>
  );
}
