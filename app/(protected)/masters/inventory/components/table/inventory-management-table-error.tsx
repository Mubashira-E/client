import { TableErrorState } from "@/app/(protected)/components/table/table-error-state";
import { useInventoryManagementStore } from "../../stores/useInventoryManagementStore";

export function InventoryManagementTableError() {
  const { visibleColumns } = useInventoryManagementStore();

  return (
    <TableErrorState
      colSpan={visibleColumns.length + 1}
      title="Error loading inventory items"
      description="Please try again later"
    />
  );
}
