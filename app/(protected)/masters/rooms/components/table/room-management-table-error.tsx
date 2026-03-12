import { TableErrorState } from "@/app/(protected)/components/table/table-error-state";

export function RoomManagementTableError() {
  return (
    <TableErrorState
      colSpan={5}
      title="Error loading rooms"
      description="Please try again later"
    />
  );
}
