"use client";

import { CalendarCheck, CheckCircle2, ChevronLeft, Clock, FileEdit, Plus } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetPatientByIdQuery } from "@/queries/patient/useGetPatientByIdQuery";

type PatientHeaderProps = {
  patientId: string;
};

export default function PatientHeader({ patientId }: PatientHeaderProps) {
  const { patientDetails, isLoading } = useGetPatientByIdQuery(patientId);

  if (isLoading) {
    return (
      <section className="flex flex-col gap-4">
        <Link href="/patients/patient-list" className="flex items-center gap-0.5 text-primary w-fit">
          <ChevronLeft className="w-4 h-4" />
          <p className="text-sm">Back to Patient List</p>
        </Link>
        <section className="flex flex-col gap-4 px-4 py-6 rounded-md border bg-white">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-32" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="rounded-md border p-3">
              <Skeleton className="h-3 w-24" />
              <div className="mt-2">
                <Skeleton className="h-7 w-14" />
              </div>
            </div>
            <div className="rounded-md border p-3">
              <Skeleton className="h-3 w-28" />
              <div className="mt-2">
                <Skeleton className="h-7 w-14" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </section>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <Link href="/patients/patient-list" className="flex items-center gap-0.5 text-primary w-fit">
        <ChevronLeft className="w-4 h-4" />
        <p className="text-sm">Back to Patient List</p>
      </Link>
      <section className="flex flex-col gap-4 px-4 py-6 rounded-md border bg-white">
        <PageHeader
          title={patientDetails?.patientName || "Patient"}
          description={patientDetails?.emrNumber || "EMR Number not available"}
        />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-md border p-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
              <span>Completed Sessions</span>
            </div>
            <div className="mt-1 text-2xl font-semibold" aria-label="completed-sessions">6</div>
          </div>
          <div className="rounded-md border p-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span>Upcoming Sessions</span>
            </div>
            <div className="mt-1 text-2xl font-semibold" aria-label="remaining-sessions">4</div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t">
          <Button asChild variant="outline" className="gap-2">
            <Link href={`/patients/patient-list/${patientId}/visit-confirmation`}>
              <CalendarCheck className="size-4" />
              Visit Confirmation
            </Link>
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <Link href={`/patients/patient-list/${patientId}/amendment`}>
              <FileEdit className="size-4" />
              Amendment
            </Link>
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <Link href={`/patients/patient-list/${patientId}/new-visit`}>
              <Plus className="size-4" />
              New Visit
            </Link>
          </Button>
        </div>
      </section>
    </section>
  );
}
