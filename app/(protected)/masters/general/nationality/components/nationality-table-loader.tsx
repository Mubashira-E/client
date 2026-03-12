/* eslint-disable react/no-array-index-key */
import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";
import { useNationalityStore } from "../stores/useNationalityStore";
import { allColumns } from "./data";

export function NationalityTableLoader() {
  const { visibleColumns } = useNationalityStore();
  const visibleColumnData = allColumns.filter(col => visibleColumns.includes(col.id));

  return (
    <>
      {Array.from({ length: 10 }).map((_, index) => (
        <TableRow key={index}>
          {visibleColumnData.map(column => (
            <TableCell key={column.id}>
              {column.id === "nationality"
                ? (
                    <Skeleton className="h-4 w-32" />
                  )
                : column.id === "nationalityCode"
                  ? (
                      <Skeleton className="h-4 w-20" />
                    )
                  : column.id === "isActive"
                    ? (
                        <Skeleton className="h-6 w-20 rounded-full" />
                      )
                    : (
                        <Skeleton className="h-4 w-24" />
                      )}
            </TableCell>
          ))}
          <TableCell className="text-center">
            <Skeleton className="h-8 w-8 rounded mx-auto" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
