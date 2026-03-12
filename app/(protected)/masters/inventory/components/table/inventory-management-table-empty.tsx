import { TableEmptyState } from "@/app/(protected)/components/table/table-empty-state";
import { useInventoryManagementStore } from "../../stores/useInventoryManagementStore";

export function InventoryManagementTableEmpty() {
  const { visibleColumns } = useInventoryManagementStore();

  return (
    <TableEmptyState
      colSpan={visibleColumns.length + 1}
      title="No inventory items found"
      description="Please try again later"
    />
  );
}
