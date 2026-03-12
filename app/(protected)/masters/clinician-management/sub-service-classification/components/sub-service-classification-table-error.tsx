import { TableErrorState } from "@/app/(protected)/components/table/table-error-state";
import { useSubServiceClassificationStore } from "../stores/useSubServiceClassificationStore";

export function SubServiceClassificationTableError() {
  const { visibleColumns } = useSubServiceClassificationStore();

  return (
    <TableErrorState
      colSpan={visibleColumns.length + 1}
      title="Error loading sub-service classifications"
      description="Please try again later"
    />
  );
}
