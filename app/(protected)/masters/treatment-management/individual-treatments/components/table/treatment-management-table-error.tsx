import { TableErrorState } from "@/app/(protected)/components/table/table-error-state";
import { useTreatmentManagementStore } from "../../stores/useTreatmentManagementStore";

export function TreatmentManagementTableError() {
  const { visibleColumns } = useTreatmentManagementStore();

  return (
    <TableErrorState
      colSpan={visibleColumns.length + 1}
      title="Error loading treatments"
      description="Please try again later"
    />
  );
}
