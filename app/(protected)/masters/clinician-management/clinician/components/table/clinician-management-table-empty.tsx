import { TableEmptyState } from "@/app/(protected)/components/table/table-empty-state";
import { useClinicianManagementStore } from "../../stores/useClinicianManagementStore";

export function ClinicianManagementTableEmpty() {
  const { visibleColumns } = useClinicianManagementStore();

  return (
    <TableEmptyState
      colSpan={visibleColumns.length + 1}
      title="No clinicians found"
      description="Please try again later"
    />
  );
}
