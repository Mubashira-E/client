import type { SubServiceClassificationResponse } from "@/types/sub-service-classification";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronUp, Edit, MoreHorizontal, ShieldMinus, ShieldPlus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeleteConfirmationModal } from "@/lib/components/delete-confirmation-modal";
import { cn } from "@/lib/utils";
import { useDeleteSubServiceClassificationByIdMutation } from "@/queries/masters/sub-service-classification/useDeleteSubServiceClassificationByIdQuery";
import { useGetAllSubServiceClassificationQuery } from "@/queries/masters/sub-service-classification/useGetAllSubServiceClassificationQuery";
import { usePatchSubServiceClassificationByIdMutation } from "@/queries/masters/sub-service-classification/usePatchSubServiceClassificationById";
import { useSubServiceClassificationStore } from "../stores/useSubServiceClassificationStore";
import { allColumns } from "./data";
import { SubServiceClassificationTableEmpty } from "./sub-service-classification-table-empty";
import { SubServiceClassificationTableError } from "./sub-service-classification-table-error";
import { SubServiceClassificationTableLoader } from "./sub-service-classification-table-loader";

export function SubServiceClassificationTable() {
  const router = useRouter();
  const { visibleColumns } = useSubServiceClassificationStore();
  const translatedColumns = allColumns;

  const [searchFilter] = useQueryState("searchFilter", parseAsString.withDefault(""));
  const [currentPage, setCurrentPage] = useQueryState("currentPage", parseAsInteger.withDefault(1));
  const [sortColumn, setSortColumn] = useQueryState("sort", parseAsString.withDefault("subServiceClassification"));
  const [sortDirection, setSortDirection] = useQueryState("order", parseAsString.withDefault("asc"));

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedSubServiceClassification, setSelectedSubServiceClassification] = useState<string | null>(null);

  const { data, isPending, isError }
    = useGetAllSubServiceClassificationQuery({
      sortColumn,
      searchFilter,
      sortDirection: sortDirection as "asc" | "desc",
      pageNumber: currentPage,
    });

  const {
    mutate: patchSubServiceClassification,
    error: updateSubServiceClassificationStatusError,
    isSuccess: isUpdateSubServiceClassificationStatusSuccess,
  } = usePatchSubServiceClassificationByIdMutation();

  const {
    mutate: deleteSubServiceClassification,
    error: deleteSubServiceClassificationError,
    isSuccess: isDeleteSubServiceClassificationSuccess,
  } = useDeleteSubServiceClassificationByIdMutation({
    onSuccess: () => {
      toast.success("Sub service classification deleted successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to delete sub service classification", {
        description: error.message || "Unknown error",
      });
    },
  });

  useEffect(() => {
    if (updateSubServiceClassificationStatusError) {
      toast.error("Failed to update sub service classification status", {
        description: updateSubServiceClassificationStatusError instanceof Error ? updateSubServiceClassificationStatusError.message : "Unknown error",
      });
    }
  }, [updateSubServiceClassificationStatusError]);

  useEffect(() => {
    if (isUpdateSubServiceClassificationStatusSuccess) {
      toast.success("Sub service classification status updated successfully");
    }
  }, [isUpdateSubServiceClassificationStatusSuccess]);

  useEffect(() => {
    if (deleteSubServiceClassificationError) {
      toast.error("Failed to delete sub service classification");
    }
  }, [deleteSubServiceClassificationError]);

  useEffect(() => {
    if (isDeleteSubServiceClassificationSuccess) {
      toast.success("Sub service classification deleted successfully");
    }
  }, [isDeleteSubServiceClassificationSuccess]);

  const handleDelete = () => {
    if (selectedSubServiceClassification) {
      deleteSubServiceClassification(selectedSubServiceClassification);
    }
  };

  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    }
    else {
      setSortColumn(columnId);
      setSortDirection("asc");
    }
  };

  const handleOnEditClick = (subServiceClassificationId: string) => {
    router.push(`/masters/clinician-management/sub-service-classification/${subServiceClassificationId}/edit`);
  };

  const subServiceClassifications = data?.subServiceClassifications || [];
  const totalPages = data?.totalPages || 1;

  return (
    <section className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {translatedColumns
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
            {isError && <SubServiceClassificationTableError />}
            {isPending && <SubServiceClassificationTableLoader />}
            {!isPending && !isError && subServiceClassifications.length === 0 && <SubServiceClassificationTableEmpty />}
            {subServiceClassifications.length > 0 && !isPending && !isError && (
              subServiceClassifications.map(subServiceClassification => (
                <TableRow key={subServiceClassification.subServiceClassificationId}>
                  {translatedColumns
                    .filter(col => visibleColumns.includes(col.id))
                    .map((column, index) => (
                      <TableCell key={`${subServiceClassification.subServiceClassificationId}-${column.id}`} className={cn(index === 0 && "!pl-4")}>
                        {column.id === "status"
                          ? (
                              <div className={cn("max-w-18 truncate flex items-center justify-center border", subServiceClassification.status ? "text-green-800 bg-green-100 rounded-md px-2 py-1 border-green-200" : "text-red-800 bg-red-100 rounded-md px-2 py-1 border-red-200")}>
                                {subServiceClassification.status ? "Active" : "Inactive"}
                              </div>
                            )
                          : column.id === "isDrug"
                            ? (
                                <div className={cn("max-w-18 truncate flex items-center justify-center border", subServiceClassification.isDrug ? "text-green-800 bg-green-100 rounded-md px-2 py-1 border-green-200" : "text-red-800 bg-red-100 rounded-md px-2 py-1 border-red-200")}>
                                  {subServiceClassification.isDrug ? "Yes" : "No"}
                                </div>
                              )
                            : column.id === "vatPercentage"
                              ? (
                                  `${subServiceClassification.vatPercentage}%`
                                )
                              : (
                                  subServiceClassification[column.id as keyof SubServiceClassificationResponse]
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
                            handleOnEditClick(subServiceClassification.subServiceClassificationId.toString());
                          }}
                          className="cursor-pointer"
                        >
                          <Edit className="size-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            patchSubServiceClassification(subServiceClassification.subServiceClassificationId.toString());
                          }}
                          className="cursor-pointer"
                        >
                          {subServiceClassification.status
                            ? (
                                <>
                                  <ShieldMinus className="size-4" />
                                  Deactivate
                                </>
                              )
                            : (
                                <>
                                  <ShieldPlus className="size-4" />
                                  Activate
                                </>
                              )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedSubServiceClassification(subServiceClassification.subServiceClassificationId.toString());
                            setDeleteModalOpen(true);
                          }}
                          className="cursor-pointer text-red-600"
                        >
                          <Trash className="size-4" />
                          Delete
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
      <DeleteConfirmationModal
        open={deleteModalOpen}
        onOpenChange={() => {
          setDeleteModalOpen(false);
          setSelectedSubServiceClassification(null);
        }}
        onConfirm={handleDelete}
        title="Delete Sub Service Classification"
        description="Are you sure you want to delete this sub service classification? This action cannot be undone."
        itemName={subServiceClassifications.find(subServiceClassification => subServiceClassification.subServiceClassificationId.toString() === selectedSubServiceClassification)?.subServiceClassification}
      />
    </section>
  );
}
