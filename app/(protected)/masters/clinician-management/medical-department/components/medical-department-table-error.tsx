import { TableErrorState } from "@/app/(protected)/components/table/table-error-state";
import { useMedicalDepartmentStore } from "../stores/useMedicalDepartmentStore";

export function MedicalDepartmentTableError() {
  const { visibleColumns } = useMedicalDepartmentStore();

  return (
    <TableErrorState
      colSpan={visibleColumns.length + 1}
      title="Error loading medical departments"
      description="Please try again later"
    />
  );
}
