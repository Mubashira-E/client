import { TableEmptyState } from "@/app/(protected)/components/table/table-empty-state";

export function VisitManagementTableEmpty() {
  return (
    <TableEmptyState colSpan={8} title="No visits found" description="Please try again later" />
  );
}
