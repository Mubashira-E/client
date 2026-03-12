import { TableEmptyState } from "@/app/(protected)/components/table/table-empty-state";
import { useMedicalDepartmentStore } from "../stores/useMedicalDepartmentStore";

export function MedicalDepartmentTableEmpty() {
  const { visibleColumns } = useMedicalDepartmentStore();

  return (
    <TableEmptyState
      colSpan={visibleColumns.length + 1}
      title="No medical departments found"
      description="Please try again later"
    />
  );
}
