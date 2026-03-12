import type { Metadata } from "next";
import { AppointmentsHeader } from "./components/appointments-header";
import { AppointmentListTable } from "./components/table/appointment-list-table";

export const metadata: Metadata = {
  title: "E-Medical Record / Appointment List",
  description: "E-Medical Record / Appointment List",
};

export default function AppointmentListPage() {
  return (
    <section className="flex flex-col gap-4">
      <AppointmentsHeader />
      <AppointmentListTable />
    </section>
  );
}
