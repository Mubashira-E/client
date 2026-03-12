import type { LanguageResponse } from "@/queries/general/language/useGetAllLanguageQuery";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronUp, Edit, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useGetAllLanguageQuery } from "@/queries/general/language/useGetAllLanguageQuery";
import { useLanguageStore } from "../stores/useLanguageStore";
import { allColumns } from "./data";
import { LanguageTableEmpty } from "./language-table-empty";
import { LanguageTableError } from "./language-table-error";
import { LanguageTableLoader } from "./language-table-loader";

export function LanguageTable() {
  const router = useRouter();
  const { visibleColumns } = useLanguageStore();

  const [searchFilter] = useQueryState("searchFilter", parseAsString.withDefault(""));
  const [currentPage, setCurrentPage] = useQueryState("currentPage", parseAsInteger.withDefault(1));
  const [sortColumn, setSortColumn] = useQueryState("sort", parseAsString.withDefault("languageName"));
  const [sortDirection, setSortDirection] = useQueryState("order", parseAsString.withDefault("asc"));

  const { languages, totalPages, isPending, isError }
    = useGetAllLanguageQuery({
      searchTerms: searchFilter,
      sortOrderBy: sortDirection === "asc",
      pageNumber: currentPage,
    });

  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    }
    else {
      setSortColumn(columnId);
      setSortDirection("asc");
    }
  };

  const handleOnEditClick = (languageId: string) => {
    router.push(`/masters/general/language/${languageId}/edit`);
  };

  return (
    <section className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {allColumns
                .filter(col => visibleColumns.includes(col.id))
                .map((column, index) => (
                  <TableHead key={column.id}>
                    {column.sortable
                      ? (
                          <Button
                            variant="ghost"
                            onClick={() => handleSort(column.id)}
                            className={cn("h-8 font-semibold flex items-center gap-1 hover:bg-transparent", index === 0 ? "!pl-2" : "!pl-0")}
                          >
                            {column.name}
                            {sortColumn === column.id && (
                              sortDirection === "asc"
                                ? <ChevronUp className="ml-2 size-4" />
                                : <ChevronDown className="ml-2 size-4" />
                            )}
                          </Button>
                        )
                      : (
                          column.name
                        )}
                  </TableHead>
                ))}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isError && <LanguageTableError />}
            {isPending && <LanguageTableLoader />}
            {!isPending && !isError && languages.length === 0 && <LanguageTableEmpty />}
            {languages.length > 0 && !isPending && !isError && (
              languages.map(language => (
                <TableRow key={language.languageId}>
                  {allColumns
                    .filter(col => visibleColumns.includes(col.id))
                    .map((column, index) => (
                      <TableCell key={`${language.languageId}-${column.id}`} className={cn(index === 0 && "!pl-4")}>
                        {column.id === "isActive"
                          ? (
                              <div className={cn("max-w-18 truncate flex items-center justify-center border", language.isActive ? "text-green-800 bg-green-100 rounded-md px-2 py-1 border-green-200" : "text-red-800 bg-red-100 rounded-md px-2 py-1 border-red-200")}>
                                {language.isActive ? "Active" : "Inactive"}
                              </div>
                            )
                          : (
                              language[column.id as keyof LanguageResponse]
                            )}
                      </TableCell>
                    ))}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            handleOnEditClick(language.languageId);
                          }}
                          className="cursor-pointer"
                        >
                          <Edit className="size-4" />
                          Edit
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
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
