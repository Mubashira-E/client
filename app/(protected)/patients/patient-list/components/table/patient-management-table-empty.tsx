import { TableEmptyState } from "@/app/(protected)/components/table/table-empty-state";

export function PatientManagementTableEmpty() {
  return (
    <TableEmptyState colSpan={8} title="No patients found" description="Please try again later" />
  );
}
