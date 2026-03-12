import { TableEmptyState } from "@/app/(protected)/components/table/table-empty-state";

export function UsersTableEmpty() {
  return (
    <TableEmptyState
      colSpan={5}
      title="No users found"
      description="Please try again later"
    />
  );
}
