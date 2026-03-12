/* eslint-disable react/no-array-index-key */
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Loading() {
  return (
    <section className="flex flex-col gap-4">
      {/* Table Header Skeleton */}
      <section>
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="w-full sm:w-64">
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
      </section>

      {/* Table Skeleton */}
      <section className="space-y-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {Array.from({ length: 7 }).map((_, index) => (
                  <TableHead key={index}>
                    <Skeleton className="h-8 w-24" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Array.from({ length: 7 }).map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-32" />
          <div className="flex items-center space-x-2">
            <Skeleton className="size-8" />
            <Skeleton className="size-8" />
            <Skeleton className="size-5 w-24" />
            <Skeleton className="size-8" />
            <Skeleton className="size-8" />
          </div>
        </div>
      </section>
    </section>
  );
}
