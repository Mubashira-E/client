import { TableEmptyState } from "@/app/(protected)/components/table/table-empty-state";

export function RoomManagementTableEmpty() {
  return (
    <TableEmptyState
      colSpan={5}
      title="No rooms found"
      description="Please try again later"
    />
  );
}
