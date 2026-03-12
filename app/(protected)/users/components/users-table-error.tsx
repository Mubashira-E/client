import { TableErrorState } from "@/app/(protected)/components/table/table-error-state";

export function UsersTableError() {
  return (
    <TableErrorState
      colSpan={5}
      title="Error loading users"
      description="Please try again later"
    />
  );
}
