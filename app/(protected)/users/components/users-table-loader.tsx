import { TableLoaderState } from "@/app/(protected)/components/table/table-loader-state";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const SKELETON_COLUMNS = [
  "users-loader-header-user",
  "users-loader-header-roles",
  "users-loader-header-status",
  "users-loader-header-last-active",
  "users-loader-header-actions",
];

export function UsersTableLoader() {
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
        <TableLoaderState columnCount={5} rowCount={6} />
      </TableBody>
    </Table>
  );
}
