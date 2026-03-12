"use client";

import type { UserDetails } from "@/queries/auth/useGetUserDetailsQuery";
import type { InventoryItemResponse } from "@/queries/masters/inventory/useGetAllInventoryItemsQuery";
import { CheckCircle, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronUp, Edit, MoreHorizontal, Trash2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeleteConfirmationModal } from "@/lib/components/delete-confirmation-modal";
import { cn } from "@/lib/utils";
import { hasPermission } from "@/lib/utils/auth";
import { useGetUserDetailsQuery } from "@/queries/auth/useGetUserDetailsQuery";
import { useGetAllItemCategoryQuery } from "@/queries/masters/inventory/item-category/useGetAllItemCategoryQuery";
import { useDeleteInventoryItemMutation } from "@/queries/masters/inventory/useDeleteInventoryItemMutation";
import { useGetAllInventoryItemsQuery } from "@/queries/masters/inventory/useGetAllInventoryItemsQuery";
import { useGetUnitsQuery } from "@/queries/masters/inventory/useGetUnitsQuery";
import { usePatchInventoryItemMutation } from "@/queries/masters/inventory/usePatchInventoryItemMutation";
import { useInventoryManagementStore } from "../../stores/useInventoryManagementStore";
import { InventoryManagementTableEmpty } from "./inventory-management-table-empty";
import { InventoryManagementTableError } from "./inventory-management-table-error";
import { InventoryManagementTableLoader } from "./inventory-management-table-loader";

function InventoryManagementTableRow({
  item,
  visibleColumns,
  renderCell,
  onEdit,
  userDetails,
}: {
  item: InventoryItemResponse;
  visibleColumns: string[];
  renderCell: (item: InventoryItemResponse, columnId: string) => React.ReactNode;
  onEdit: (item: InventoryItemResponse) => void;
  userDetails: UserDetails | undefined;
}) {
  const patchMutation = usePatchInventoryItemMutation(item.id);
  const deleteMutation = useDeleteInventoryItemMutation(item.id);
  const isActive = item.status?.toLowerCase() === "active";
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const canUpdate = hasPermission(userDetails, "InventoryItem.Update");
  const canDelete = hasPermission(userDetails, "InventoryItem.Delete");
  const hasAnyAction = canUpdate || canDelete;

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Inventory item deleted successfully");
        setShowDeleteModal(false);
      },
      onError: () => {
        toast.error("Failed to delete inventory item");
      },
    });
  };

  return (
    <>
      <TableRow key={item.id} className="hover:bg-gray-50">
        {visibleColumns.map(columnId => (
          <TableCell key={columnId} className="pl-4 text-gray-800 min-w-[180px] whitespace-nowrap">
            <div className="overflow-hidden text-ellipsis max-w-[250px]">
              {renderCell(item, columnId)}
            </div>
          </TableCell>
        ))}
        {hasAnyAction && (
          <TableCell className="sticky right-0 z-20 min-w-[100px] bg-white shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.1)]">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {canUpdate && (
                  <DropdownMenuItem onClick={() => onEdit(item)}>
                    <Edit className="size-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                )}
                {canUpdate && (
                  <DropdownMenuItem
                    onClick={() => {
                      patchMutation.mutate(
                        { isActive: !isActive },
                        {
                          onSuccess: () => {
                            toast.success(
                              `Inventory item ${!isActive ? "activated" : "deactivated"} successfully`,
                            );
                          },
                          onError: () => {
                            toast.error("Failed to update inventory item status");
                          },
                        },
                      );
                    }}
                    disabled={patchMutation.isPending}
                  >
                    {isActive
                      ? (
                          <>
                            <XCircle className="h-4 w-4 mr-2 text-red-600" />
                            <span className="text-red-600">Inactive</span>
                          </>
                        )
                      : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                            <span className="text-green-600">Active</span>
                          </>
                        )}
                  </DropdownMenuItem>
                )}
                {canDelete && (
                  <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600">
                    <Trash2 className="h-4 w-4 mr-2 text-red-600" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        )}
        {!hasAnyAction && (
          <TableCell className="sticky right-0 z-20 min-w-[100px] bg-white shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.1)]" />
        )}
      </TableRow>

      <DeleteConfirmationModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete Inventory Item"
        description="This action cannot be undone."
        itemName={item.itemName}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
}

export function InventoryManagementTable() {
  const router = useRouter();
  const { visibleColumns } = useInventoryManagementStore();
  const { data: userDetails } = useGetUserDetailsQuery();

  const { items: allItems = [], isPending, isError } = useGetAllInventoryItemsQuery();
  const { data: units = [] } = useGetUnitsQuery();
  const { itemCategories = [] } = useGetAllItemCategoryQuery();
  const [searchFilter] = useQueryState("searchFilter", parseAsString.withDefault(""));
  const [currentPage, setCurrentPage] = useQueryState("currentPage", parseAsInteger.withDefault(1));
  const [sortColumn, setSortColumn] = useQueryState("sort", parseAsString.withDefault("itemName"));
  const [sortDirection, setSortDirection] = useQueryState("order", parseAsString.withDefault("asc"));

  const pageSize = 10;

  const filteredItems = (allItems || []).filter((item) => {
    const filter = searchFilter.toLowerCase();
    const itemName = (item.itemName || "").toLowerCase();
    const category = (item.category || "").toLowerCase();
    const remarks = (item.remarks || "").toLowerCase();

    return (
      itemName.includes(filter)
      || category.includes(filter)
      || remarks.includes(filter)
    );
  });

  const sortedItems = [...filteredItems].sort((a: any, b: any) => {
    const dir = sortDirection === "asc" ? 1 : -1;
    const av = (a as any)[sortColumn] ?? "";
    const bv = (b as any)[sortColumn] ?? "";
    if (typeof av === "number" && typeof bv === "number") {
      return (av - bv) * dir;
    }
    return String(av).localeCompare(String(bv)) * dir;
  });

  const totalPages = Math.max(1, Math.ceil(sortedItems.length / pageSize));
  const page = Math.min(Math.max(1, currentPage), totalPages);
  const inventoryItems = sortedItems.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    }
    else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleEdit = (item: InventoryItemResponse) => {
    router.push(`/masters/inventory/edit/${item.id}`);
  };

  const renderCell = (item: InventoryItemResponse, columnId: string) => {
    switch (columnId) {
      case "itemName":
        return (
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">{item.itemName}</span>
          </div>
        );
      case "category": {
        const category = itemCategories.find(cat => cat.itemCategoryId === item.itemCategoryId);
        const categoryName = category?.categoryName || item.category || "-";
        return <Badge variant="outline" className="w-fit">{categoryName}</Badge>;
      }
      case "unit": {
        const unit = units.find(u => u.id === item.unit);
        const unitName = unit?.name || "-";
        return <span className="text-gray-700">{unitName}</span>;
      }
      case "remarks":
        return <span className="text-gray-700 text-sm">{item.remarks || "-"}</span>;
      case "status":
        return (
          <Badge
            variant={item.status === "Active" ? "default" : "destructive"}
            className={
              item.status === "Active"
                ? "bg-primary text-primary-foreground hover:bg-primary/80"
                : "bg-red-500 text-white hover:bg-red-500/80"
            }
          >
            {item.status}
          </Badge>
        );
      default:
        return null;
    }
  };

  const getColumnHeader = (columnId: string) => {
    switch (columnId) {
      case "itemName":
        return "Item Name";
      case "category":
        return "Category";
      case "itemCategory":
        return "Category";
      case "batchNo":
        return "Batch No";
      case "quantity":
        return "Quantity";
      case "unit":
        return "Unit";
      case "remarks":
        return "Remarks";
      case "manufacturingDate":
        return "Manufacturing Date";
      case "expiryDate":
        return "Expiry Date";
      case "storageCondition":
        return "Storage Condition";
      case "storageLocation":
        return "Storage Location";
      case "supplierName":
        return "Supplier";
      case "status":
        return "Status";
      default:
        return columnId;
    }
  };

  return (
    <section className="space-y-4">
      <div className="border rounded-lg mx-4 mb-4 overflow-hidden">
        {isPending
          ? (
              <InventoryManagementTableLoader />
            )
          : (
              <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
                <Table>
                  <TableHeader className="sticky top-0 z-10 bg-white">
                    <TableRow>
                      {visibleColumns.map(columnId => (
                        <TableHead
                          key={columnId}
                          className={cn(
                            ["itemName", "category", "unit", "remarks"].includes(columnId) && "cursor-pointer hover:bg-gray-100 select-none",
                            "font-semibold pl-4 relative min-w-[180px] whitespace-nowrap",
                          )}
                          onClick={() => ["itemName", "category", "unit", "remarks"].includes(columnId) && handleSort(columnId)}
                        >
                          <div className="flex items-center gap-2">
                            {getColumnHeader(columnId)}
                            {sortColumn === columnId && sortDirection === "asc" && <ChevronUp className="h-3 w-3" />}
                            {sortColumn === columnId && sortDirection === "desc" && <ChevronDown className="h-3 w-3" />}
                            {sortColumn !== columnId && (
                              <div className="flex flex-col">
                                <ChevronUp className="h-3 w-3 text-gray-400" />
                                <ChevronDown className="h-3 w-3 text-gray-400 -mt-1" />
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
                    {isError && <InventoryManagementTableError />}
                    {!isError && inventoryItems.length === 0 && <InventoryManagementTableEmpty />}
                    {!isError && inventoryItems.length > 0 && inventoryItems.map(item => (
                      <InventoryManagementTableRow
                        key={item.id}
                        item={item}
                        visibleColumns={visibleColumns}
                        renderCell={renderCell}
                        onEdit={handleEdit}
                        userDetails={userDetails}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing page
            {" "}
            {page}
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
              disabled={page === 1 || isPending}
            >
              <ChevronsLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(page - 1)}
              disabled={page === 1 || isPending}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="text-sm">
              Page
              {" "}
              {page}
              {" "}
              of
              {" "}
              {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(page + 1)}
              disabled={page === totalPages || isPending}
            >
              <ChevronRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(totalPages)}
              disabled={page === totalPages || isPending}
            >
              <ChevronsRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
