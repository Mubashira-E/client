import { TableEmptyState } from "@/app/(protected)/components/table/table-empty-state";

export function InventoryCategoryTableEmpty() {
  return (
    <TableEmptyState
      colSpan={4}
      title="No inventory categories found"
      description="Please try again later"
    />
  );
}
