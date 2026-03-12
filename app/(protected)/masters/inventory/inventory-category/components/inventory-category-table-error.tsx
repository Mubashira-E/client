import { TableErrorState } from "@/app/(protected)/components/table/table-error-state";

export function InventoryCategoryTableError() {
  return (
    <TableErrorState
      colSpan={4}
      title="Error loading inventory categories"
      description="Please try again later"
    />
  );
}
