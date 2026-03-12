import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import BookAppointmentForm from "./components/book-appointment-form";

export const metadata: Metadata = {
  title: "E-Medical Record / Book Appointment",
  description: "E-Medical Record / Book Appointment",
};

export default function BookAppointmentPage() {
  return (
    <Suspense>
      <section className="flex flex-col gap-4">
        <PageHeader
          title="Book Appointment"
          description="Manage and schedule patient appointments"
        />
        <BookAppointmentForm />
      </section>
    </Suspense>
  );
}
