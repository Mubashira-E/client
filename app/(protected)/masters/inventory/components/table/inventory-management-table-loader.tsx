import { TableLoaderState } from "@/app/(protected)/components/table/table-loader-state";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useInventoryManagementStore } from "../../stores/useInventoryManagementStore";

export function InventoryManagementTableLoader() {
  const { visibleColumns } = useInventoryManagementStore();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {visibleColumns.map(columnId => (
            <TableHead key={`inventory-loader-header-${columnId}`}>
              <div className="h-4 w-28 rounded-md bg-muted animate-pulse" />
            </TableHead>
          ))}
          <TableHead className="w-[100px]">
            <div className="h-4 w-20 rounded-md bg-muted animate-pulse" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableLoaderState
          columnCount={visibleColumns.length}
          rowCount={8}
          includeActionColumn
        />
      </TableBody>
    </Table>
  );
}
