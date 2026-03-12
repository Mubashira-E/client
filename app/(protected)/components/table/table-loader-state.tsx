"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

type TableLoaderStateProps = {
  columnCount: number;
  rowCount?: number;
  className?: string;
  cellClassName?: string;
  skeletonClassName?: string;
  includeActionColumn?: boolean;
  getCellClassName?: (rowIndex: number, columnIndex: number, totalColumns: number) => string | undefined;
  getSkeletonClassName?: (rowIndex: number, columnIndex: number, totalColumns: number) => string | undefined;
};

export function TableLoaderState({
  columnCount,
  rowCount = 5,
  className,
  cellClassName,
  skeletonClassName,
  includeActionColumn = false,
  getCellClassName,
  getSkeletonClassName,
}: TableLoaderStateProps) {
  const columns = includeActionColumn ? columnCount + 1 : columnCount;

  return (
    <>
      {Array.from({ length: rowCount }).map((_, rowIndex) => (
        <TableRow key={`table-loader-row-${rowIndex + 1}`} className={className}>
          {Array.from({ length: columns }).map((_, columnIndex) => (
            <TableCell
              key={`table-loader-cell-${rowIndex + 1}-${columnIndex + 1}`}
              className={cn(
                "align-middle",
                cellClassName,
                getCellClassName?.(rowIndex, columnIndex, columns),
              )}
            >
              <Skeleton
                className={cn(
                  "h-4 w-full",
                  skeletonClassName,
                  getSkeletonClassName?.(rowIndex, columnIndex, columns),
                )}
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
