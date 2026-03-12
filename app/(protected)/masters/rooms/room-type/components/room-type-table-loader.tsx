import { TableLoaderState } from "@/app/(protected)/components/table/table-loader-state";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const SKELETON_COLUMNS = [
  "room-type-loader-header-name",
  "room-type-loader-header-description",
  "room-type-loader-header-actions",
];

export function RoomTypeTableLoader() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {SKELETON_COLUMNS.map(columnKey => (
            <TableHead key={columnKey}>
              <div className="h-4 w-28 rounded-md bg-muted animate-pulse" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableLoaderState columnCount={3} rowCount={6} />
      </TableBody>
    </Table>
  );
}
