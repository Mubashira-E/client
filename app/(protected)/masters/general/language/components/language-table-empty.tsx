import { TableEmptyState } from "@/app/(protected)/components/table/table-empty-state";
import { useLanguageStore } from "../stores/useLanguageStore";

export function LanguageTableEmpty() {
  const { visibleColumns } = useLanguageStore();

  return (
    <TableEmptyState
      colSpan={visibleColumns.length + 1}
      title="No languages found"
      description="Please try again later"
    />
  );
}
