import { TableErrorState } from "@/app/(protected)/components/table/table-error-state";
import { usePackageManagementStore } from "../../stores/usePackageManagementStore";

export function PackageManagementTableError() {
  const { visibleColumns } = usePackageManagementStore();

  return (
    <TableErrorState
      colSpan={visibleColumns.length + 1}
      title="Error loading packages"
      description="Please try again later"
    />
  );
}
