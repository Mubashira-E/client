"use client";
import { FormProvider, useForm } from "react-hook-form";
import { UpdateAppointment } from "./update-appointment";

// import type { AppointmentDetailsPayload } from "@/queries/appointments/useUpdateApoointmentMutationQuery";
type AppointmentDetailsPayload = any;

export function ClientFormWrapper({ appointmentId }: { appointmentId: string }) {
  const methods = useForm<AppointmentDetailsPayload>();

  return (
    <FormProvider {...methods}>
      <UpdateAppointment appointmentId={appointmentId} />
    </FormProvider>
  );
}
