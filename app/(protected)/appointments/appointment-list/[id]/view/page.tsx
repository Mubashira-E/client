import type { Metadata } from "next";
import { ViewAppointment } from "./components/view-appointment";

export const metadata: Metadata = {
  title: "E-Medical Record / View Appointment",
  description: "E-Medical Record / View Appointment",
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return (
    <ViewAppointment appointmentId={params.id} />
  );
}
