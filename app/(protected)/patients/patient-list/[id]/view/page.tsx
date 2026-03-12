import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PatientDetailContainer from "./components/patient-detail-container";
import PatientHeader from "./components/patient-header";

export const metadata: Metadata = {
  title: "E-Medical Record / View Patient",
  description: "E-Medical Record / View Patient",
};

export default async function PatientDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const patientId = decodeURIComponent(id);

  if (!patientId) {
    return notFound();
  }

  return (
    <div className="space-y-6">
      <PatientHeader patientId={patientId} />
      <PatientDetailContainer patientId={patientId} />
    </div>
  );
}
