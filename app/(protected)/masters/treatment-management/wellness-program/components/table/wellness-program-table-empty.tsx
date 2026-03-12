import { TableEmptyState } from "@/app/(protected)/components/table/table-empty-state";
import { useWellnessProgramManagementStore } from "../../stores/useWellnessProgramManagementStore";

export function WellnessProgramTableEmpty() {
  const { visibleColumns } = useWellnessProgramManagementStore();

  const activeColumns = [
    "programDetails",
    "packages",
    "treatments",
    "duration",
    "sessions",
    "price",
    "status",
  ].filter(column => visibleColumns.includes(column)).length + 1;

  return (
    <TableEmptyState
      colSpan={activeColumns}
      title="No wellness programs found"
      description="Please try again later"
    />
  );
}
