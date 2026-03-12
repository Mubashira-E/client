import { TableLoaderState } from "@/app/(protected)/components/table/table-loader-state";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const SKELETON_COLUMNS = [
  "inventory-category-loader-header-code",
  "inventory-category-loader-header-name",
  "inventory-category-loader-header-description",
  "inventory-category-loader-header-actions",
];

export function InventoryCategoryTableLoader() {
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
        <TableLoaderState columnCount={4} rowCount={6} />
      </TableBody>
    </Table>
  );
}
