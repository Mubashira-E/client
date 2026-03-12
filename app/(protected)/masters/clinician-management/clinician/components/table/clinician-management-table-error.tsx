import { TableErrorState } from "@/app/(protected)/components/table/table-error-state";
import { useClinicianManagementStore } from "../../stores/useClinicianManagementStore";

export function ClinicianManagementTableError() {
  const { visibleColumns } = useClinicianManagementStore();

  return (
    <TableErrorState
      colSpan={visibleColumns.length + 1}
      title="Error loading clinicians"
      description="Please try again later"
    />
  );
}
