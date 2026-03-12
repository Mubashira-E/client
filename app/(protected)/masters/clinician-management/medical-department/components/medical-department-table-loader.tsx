/* eslint-disable react/no-array-index-key */
import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";
import { useMedicalDepartmentStore } from "../stores/useMedicalDepartmentStore";
import { allColumns } from "./data";

export function MedicalDepartmentTableLoader() {
  const { visibleColumns } = useMedicalDepartmentStore();
  const visibleColumnData = allColumns.filter(col => visibleColumns.includes(col.id));

  return (
    <>
      {Array.from({ length: 10 }).map((_, index) => (
        <TableRow key={index}>
          {visibleColumnData.map(column => (
            <TableCell key={column.id}>
              {column.id === "medicalDepartment"
                ? (
                    <Skeleton className="h-4 w-40" />
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
