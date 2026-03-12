import { TableEmptyState } from "@/app/(protected)/components/table/table-empty-state";

export function RolesTableEmpty() {
  return (
    <TableEmptyState
      colSpan={6}
      title="No roles found"
      description="Please try again later"
    />
  );
}
