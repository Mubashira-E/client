import type { NationalityResponse } from "@/queries/general/nationality/useGetAllNationalityQuery";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronUp, Edit, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { hasPermission } from "@/lib/utils/auth";
import { useGetUserDetailsQuery } from "@/queries/auth/useGetUserDetailsQuery";
import { useGetAllNationalityQuery } from "@/queries/general/nationality/useGetAllNationalityQuery";
import { useNationalityStore } from "../stores/useNationalityStore";
import { allColumns } from "./data";
import { NationalityTableEmpty } from "./nationality-table-empty";
import { NationalityTableError } from "./nationality-table-error";
import { NationalityTableLoader } from "./nationality-table-loader";

export function NationalityTable() {
  const router = useRouter();
  const { data: userDetails } = useGetUserDetailsQuery();
  const { visibleColumns } = useNationalityStore();

  const canUpdate = hasPermission(userDetails, "Nationality.Update");

  const [searchFilter] = useQueryState("searchFilter", parseAsString.withDefault(""));
  const [currentPage, setCurrentPage] = useQueryState("currentPage", parseAsInteger.withDefault(1));
  const [sortColumn, setSortColumn] = useQueryState("sort", parseAsString.withDefault("nationalityName"));
  const [sortDirection, setSortDirection] = useQueryState("order", parseAsString.withDefault("asc"));

  const { nationalities, totalPages, isPending, isError }
    = useGetAllNationalityQuery({
      searchTerms: searchFilter,
      sortOrderBy: sortDirection === "asc",
      pageNumber: currentPage,
    });

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    }
    else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const translatedColumns = allColumns;

  // Reset to first page whenever the search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchFilter, setCurrentPage]);

  return (
    <section className="space-y-4">
      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-white">
              <TableRow>
                {translatedColumns
                  .filter(column => visibleColumns.includes(column.id))
                  .map(column => (
                    <TableHead
                      key={column.id}
                      className={cn(
                        column.sortable && "cursor-pointer hover:bg-gray-100 select-none",
                        "relative min-w-[180px] whitespace-nowrap",
                      )}
                      onClick={() => column.sortable && handleSort(column.id)}
                    >
                      <div className="flex items-center gap-2">
                        {column.name}
                        {column.sortable && (
                          <div className="flex flex-col">
                            {sortColumn === column.id && sortDirection === "asc" && <ChevronUp className="h-3 w-3" />}
                            {sortColumn === column.id && sortDirection === "desc" && <ChevronDown className="h-3 w-3" />}
                            {sortColumn !== column.id && (
                              <div className="flex flex-col">
                                <ChevronUp className="h-3 w-3 text-gray-400" />
                                <ChevronDown className="h-3 w-3 text-gray-400 -mt-1" />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </TableHead>
                  ))}
                <TableHead className="sticky right-0 z-20 min-w-[100px] bg-white shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.1)]">
                  <span className="font-semibold">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isError && <NationalityTableError />}
              {isPending && <NationalityTableLoader />}
              {!isPending && !isError && nationalities.length === 0 && <NationalityTableEmpty />}
              {nationalities.length > 0 && !isPending && !isError && (
                nationalities.map((nationality: NationalityResponse) => (
                  <TableRow key={nationality.nationalityId}>
                    {translatedColumns
                      .filter(column => visibleColumns.includes(column.id))
                      .map(column => (
                        <TableCell key={column.id} className="min-w-[180px] whitespace-nowrap">
                          <div className="overflow-hidden text-ellipsis max-w-[250px]">
                            {column.id === "isActive"
                              ? (
                                  <div
                                    className={cn(
                                      "px-2 py-1 text-xs rounded-full w-fit",
                                      nationality.isActive
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800",
                                    )}
                                  >
                                    {nationality.isActive ? "Active" : "Inactive"}
                                  </div>
                                )
                              : (
                                  nationality[column.id as keyof NationalityResponse]
                                )}
                          </div>
                        </TableCell>
                      ))}
                    {canUpdate && (
                      <TableCell className="sticky right-0 z-20 min-w-[100px] bg-white shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.1)]">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => router.push(`/masters/general/nationality/${nationality.nationalityId}/edit?nationalityId=${nationality.nationalityId}`)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                    {!canUpdate && (
                      <TableCell className="sticky right-0 z-20 min-w-[100px] bg-white shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.1)]" />
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing page
            {" "}
            {currentPage}
            {" "}
            of
            {" "}
            {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1 || isPending}
            >
              <ChevronsLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1 || isPending}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="text-sm">
              Page
              {" "}
              {currentPage}
              {" "}
              of
              {" "}
              {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages || isPending}
            >
              <ChevronRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages || isPending}
            >
              <ChevronsRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
