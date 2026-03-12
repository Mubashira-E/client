import { TableLoaderState } from "@/app/(protected)/components/table/table-loader-state";
import { useClinicianManagementStore } from "../../stores/useClinicianManagementStore";
import { allColumns } from "../data";

export function ClinicianManagementTableLoader() {
  const { visibleColumns } = useClinicianManagementStore();

  return (
    <TableLoaderState
      columnCount={allColumns.filter(col => visibleColumns.includes(col.id)).length}
      rowCount={10}
      includeActionColumn
      getCellClassName={(_, columnIndex) => (columnIndex === 0 ? "!pl-4" : undefined)}
      getSkeletonClassName={(_, columnIndex, totalColumns) => (columnIndex === totalColumns - 1 ? "h-8 w-8 rounded-md" : undefined)}
    />
  );
}
