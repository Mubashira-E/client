import { TableErrorState } from "@/app/(protected)/components/table/table-error-state";

export function RolesTableError() {
  return (
    <TableErrorState
      colSpan={6}
      title="Error loading roles"
      description="Please try again later"
    />
  );
}
