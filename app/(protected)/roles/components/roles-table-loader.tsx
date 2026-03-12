import { TableLoaderState } from "@/app/(protected)/components/table/table-loader-state";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const SKELETON_COLUMNS = [
  "roles-loader-header-role",
  "roles-loader-header-description",
  "roles-loader-header-permissions",
  "roles-loader-header-users",
  "roles-loader-header-type",
  "roles-loader-header-status",
  "roles-loader-header-actions",
];

export function RolesTableLoader() {
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
        <TableLoaderState columnCount={7} rowCount={6} />
      </TableBody>
    </Table>
  );
}
