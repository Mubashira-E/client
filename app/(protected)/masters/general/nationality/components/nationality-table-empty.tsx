import { TableEmptyState } from "@/app/(protected)/components/table/table-empty-state";
import { useNationalityStore } from "../stores/useNationalityStore";

export function NationalityTableEmpty() {
  const { visibleColumns } = useNationalityStore();

  return (
    <TableEmptyState
      colSpan={visibleColumns.length + 1}
      title="No nationalities found"
      description="Please try again later"
    />
  );
}
