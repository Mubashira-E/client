import { TableLoaderState } from "@/app/(protected)/components/table/table-loader-state";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function PatientManagementTableLoader() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {Array.from({ length: 8 }, (_, headerIndex) => (
            <TableHead key={`patient-table-header-${headerIndex}`}>
              <div className="h-4 w-20 rounded-md bg-muted animate-pulse" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableLoaderState columnCount={8} />
      </TableBody>
    </Table>
  );
}
