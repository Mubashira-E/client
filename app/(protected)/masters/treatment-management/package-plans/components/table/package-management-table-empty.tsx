import { TableEmptyState } from "@/app/(protected)/components/table/table-empty-state";
import { usePackageManagementStore } from "../../stores/usePackageManagementStore";

export function PackageManagementTableEmpty() {
  const { visibleColumns } = usePackageManagementStore();

  const activeColumns = [
    "packageName",
    "packageCode",
    "treatments",
    "duration",
    "sessions",
    "pricing",
  ].filter(column => visibleColumns.includes(column)).length + 1;

  return (
    <TableEmptyState
      colSpan={activeColumns}
      title="No packages found"
      description="Please try again later"
    />
  );
}
