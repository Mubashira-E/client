import { TableEmptyState } from "@/app/(protected)/components/table/table-empty-state";

export function RoomTypeTableEmpty() {
  return (
    <TableEmptyState
      colSpan={3}
      title="No room types found"
      description="Please try again later"
    />
  );
}
