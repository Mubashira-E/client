import { TableErrorState } from "@/app/(protected)/components/table/table-error-state";

export function RoomTypeTableError() {
  return (
    <TableErrorState
      colSpan={3}
      title="Error loading room types"
      description="Please try again later"
    />
  );
}
