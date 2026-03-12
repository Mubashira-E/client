import { TableLoaderState } from "@/app/(protected)/components/table/table-loader-state";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const SKELETON_COLUMNS = [
  "room-loader-header-name",
  "room-loader-header-type",
  "room-loader-header-status",
  "room-loader-header-bed",
  "room-loader-header-actions",
];

export function RoomManagementTableLoader() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {SKELETON_COLUMNS.map(columnKey => (
            <TableHead key={columnKey}>
              <div className="h-4 w-24 rounded-md bg-muted animate-pulse" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableLoaderState columnCount={5} rowCount={6} />
      </TableBody>
    </Table>
  );
}
