import { TableEmptyState } from "@/app/(protected)/components/table/table-empty-state";
import { useSubServiceClassificationStore } from "../stores/useSubServiceClassificationStore";

export function SubServiceClassificationTableEmpty() {
  const { visibleColumns } = useSubServiceClassificationStore();

  return (
    <TableEmptyState
      colSpan={visibleColumns.length + 1}
      title="No sub-service classifications found"
      description="Please try again later"
    />
  );
}
