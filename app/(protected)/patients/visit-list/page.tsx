import type { Metadata } from "next";
import { VisitManagementContainer } from "./components/visit-management-container";

export const metadata: Metadata = {
  title: "E-Medical Record / Patients Visit List",
  description: "E-Medical Record / Patients Visit List",
};

export default function VisitListPage() {
  return <VisitManagementContainer />;
}
