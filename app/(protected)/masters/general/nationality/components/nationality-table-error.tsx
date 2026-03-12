import { TableErrorState } from "@/app/(protected)/components/table/table-error-state";
import { useNationalityStore } from "../stores/useNationalityStore";

export function NationalityTableError() {
  const { visibleColumns } = useNationalityStore();

  return (
    <TableErrorState
      colSpan={visibleColumns.length + 1}
      title="Error loading nationalities"
      description="Please try again later"
    />
  );
}
