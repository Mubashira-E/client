/* eslint-disable react/no-array-index-key */
import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";
import { allColumns } from "./data";

export function LanguageTableLoader() {
  const translatedColumns = allColumns;

  return (
    <>
      {Array.from({ length: 10 }).map((_, index) => (
        <TableRow key={index}>
          {translatedColumns.map(column => (
            <TableCell key={column.id}>
              {column.id === "languageId"
                ? (
                    <Skeleton className="h-4 w-12" />
                  )
                : column.id === "languageName"
                  ? (
                      <Skeleton className="h-4 w-32" />
                    )
                  : column.id === "languageCode"
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
