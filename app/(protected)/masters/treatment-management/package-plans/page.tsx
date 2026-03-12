import type { Metadata } from "next";
import { PackageManagementContainer } from "./components/package-management-container";

export const metadata: Metadata = {
  title: "E-Medical Record / Package Plans",
  description: "E-Medical Record / Package Plans",
};

export default function PackagesPage() {
  return <PackageManagementContainer />;
}
