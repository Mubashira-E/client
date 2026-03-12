import { TableErrorState } from "@/app/(protected)/components/table/table-error-state";

export function VisitManagementTableError() {
  return (
    <TableErrorState colSpan={8} title="Error loading visits" description="Please try again later" />
  );
}
