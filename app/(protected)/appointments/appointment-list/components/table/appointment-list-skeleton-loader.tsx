import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function AppointmentTableSkeleton() {
  const rows = Array.from({ length: 5 }, (_, i) => i);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead><Skeleton className="h-4 w-20" /></TableHead>
          {Array.from({ length: 5 }, (_, i) => (
            <TableHead key={i}><Skeleton className="h-4 w-24" /></TableHead>
          ))}
          <TableHead><Skeleton className="h-4 w-16" /></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map(row => (
          <TableRow key={row} className="text-xs">
            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
            {Array.from({ length: 5 }, (_, i) => (
              <TableCell key={i}><Skeleton className="h-4 w-24" /></TableCell>
            ))}
            <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
