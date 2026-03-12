import { TableErrorState } from "@/app/(protected)/components/table/table-error-state";

export function PatientManagementTableError() {
  return (
    <TableErrorState colSpan={8} title="Error loading patients" description="Please try again later" />
  );
}
