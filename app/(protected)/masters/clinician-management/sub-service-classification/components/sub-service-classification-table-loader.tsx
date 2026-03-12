/* eslint-disable react/no-array-index-key */
import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";
import { allColumns } from "./data";

export function SubServiceClassificationTableLoader() {
  const translatedColumns = allColumns;

  return (
    <>
      {Array.from({ length: 10 }).map((_, index) => (
        <TableRow key={index}>
          {translatedColumns.map(column => (
            <TableCell key={column.id}>
              {column.id === "subServiceClassificationId"
                ? (
                    <Skeleton className="h-4 w-12" />
                  )
                : column.id === "subServiceClassification"
                  ? (
                      <Skeleton className="h-4 w-32" />
                    )
                  : column.id === "serviceClassification"
                    ? (
                        <Skeleton className="h-4 w-24" />
                      )
                    : column.id === "isDrug"
                      ? (
                          <Skeleton className="h-4 w-16" />
                        )
                      : column.id === "vatPercentage"
                        ? (
                            <Skeleton className="h-4 w-20" />
                          )
                        : column.id === "status"
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
