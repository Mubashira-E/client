import { TableEmptyState } from "@/app/(protected)/components/table/table-empty-state";
import { useTreatmentManagementStore } from "../../stores/useTreatmentManagementStore";

export function TreatmentManagementTableEmpty() {
  const { visibleColumns } = useTreatmentManagementStore();

  return (
    <TableEmptyState
      colSpan={visibleColumns.length + 1}
      title="No treatments found"
      description="Please try again later"
    />
  );
}
