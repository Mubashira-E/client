import type { Metadata } from "next";
import { PatientManagementContainer } from "./components/patient-management-container";

export const metadata: Metadata = {
  title: "E-Medical Record / Patient List",
  description: "E-Medical Record / Patient List",
};

export default function PatientsPage() {
  return <PatientManagementContainer />;
}
