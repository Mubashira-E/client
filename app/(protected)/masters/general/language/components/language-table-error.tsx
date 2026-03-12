import { TableErrorState } from "@/app/(protected)/components/table/table-error-state";
import { useLanguageStore } from "../stores/useLanguageStore";

export function LanguageTableError() {
  const { visibleColumns } = useLanguageStore();

  return (
    <TableErrorState
      colSpan={visibleColumns.length + 1}
      title="Error loading languages"
      description="Please try again later"
    />
  );
}
