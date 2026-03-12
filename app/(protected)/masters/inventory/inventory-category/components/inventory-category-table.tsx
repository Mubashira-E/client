"use client";

import type { UserDetails } from "@/queries/auth/useGetUserDetailsQuery";
import { CheckCircle, Edit, MoreHorizontal, Trash2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { parseAsString, useQueryState } from "nuqs";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeleteConfirmationModal } from "@/lib/components/delete-confirmation-modal";
import { hasPermission } from "@/lib/utils/auth";
import { useGetUserDetailsQuery } from "@/queries/auth/useGetUserDetailsQuery";
import { useDeleteItemCategoryMutation } from "@/queries/masters/inventory/item-category/useDeleteItemCategoryMutation";
import { useGetAllItemCategoryQuery } from "@/queries/masters/inventory/item-category/useGetAllItemCategoryQuery";
import { usePatchItemCategoryMutation } from "@/queries/masters/inventory/item-category/usePatchItemCategoryMutation";
import { InventoryCategoryTableEmpty } from "./inventory-category-table-empty";
import { InventoryCategoryTableError } from "./inventory-category-table-error";
import { InventoryCategoryTableLoader } from "./inventory-category-table-loader";

type ItemCategory = {
  itemCategoryId: string;
  categoryCode: string;
  categoryName: string;
  description: string;
  status?: string;
  isActive?: boolean;
};

function InventoryCategoryTableRow({ item, userDetails }: { item: ItemCategory; userDetails: UserDetails | undefined }) {
  const router = useRouter();
  const patchMutation = usePatchItemCategoryMutation(item.itemCategoryId);
  const deleteMutation = useDeleteItemCategoryMutation(item.itemCategoryId);
  const isActive = item.status?.toLowerCase() === "active";
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const canUpdate = hasPermission(userDetails, "InventoryCategory.Update");
  const canDelete = hasPermission(userDetails, "InventoryCategory.Delete");
  const hasAnyAction = canUpdate || canDelete;

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Item category deleted successfully");
        setShowDeleteModal(false);
      },
      onError: () => {
        toast.error("Failed to delete item category");
      },
    });
  };

  return (
    <>
      <TableRow key={item.itemCategoryId}>
        <TableCell className="min-w-[180px] whitespace-nowrap">
          <div className="overflow-hidden text-ellipsis max-w-[250px]" title={item.categoryCode}>
            {item.categoryCode}
          </div>
        </TableCell>
        <TableCell className="min-w-[180px] whitespace-nowrap">
          <div className="overflow-hidden text-ellipsis max-w-[250px]" title={item.categoryName}>
            {item.categoryName}
          </div>
        </TableCell>
        <TableCell className="min-w-[180px] whitespace-nowrap">
          <div className="overflow-hidden text-ellipsis max-w-[250px]" title={item.description}>
            {item.description}
          </div>
        </TableCell>
        <TableCell className="min-w-[120px] whitespace-nowrap">
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
        </TableCell>
        {hasAnyAction && (
          <TableCell className="sticky right-0 z-20 min-w-[100px] bg-white shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.1)]">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {canUpdate && (
                  <DropdownMenuItem onClick={() => router.push(`/masters/inventory/inventory-category/${item.itemCategoryId}/edit`)}>
                    <Edit className="h-4 w-4 mr-2" />
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
                              `Item category ${!isActive ? "activated" : "deactivated"} successfully`,
                            );
                          },
                          onError: () => {
                            toast.error("Failed to update item category status");
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
        title="Delete Item Category"
        description="This action cannot be undone."
        itemName={item.categoryName}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
}

export function InventoryCategoryTable() {
  const { data: userDetails } = useGetUserDetailsQuery();
  const [searchFilter] = useQueryState("searchFilter", parseAsString.withDefault(""));
  const { itemCategories, isPending, isError } = useGetAllItemCategoryQuery();

  const filteredItems = (itemCategories || []).filter((item: any) =>
    item.categoryName.toLowerCase().includes(searchFilter.toLowerCase())
    || item.categoryCode?.toLowerCase().includes(searchFilter.toLowerCase())
    || item.description?.toLowerCase().includes(searchFilter.toLowerCase()),
  );

  return (
    <section className="space-y-4">
      <div className="rounded-md border overflow-hidden">
        {isPending
          ? (
              <InventoryCategoryTableLoader />
            )
          : (
              <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
                <Table>
                  <TableHeader className="sticky top-0 z-10 bg-white">
                    <TableRow>
                      <TableHead className="min-w-[180px] whitespace-nowrap">Category Code</TableHead>
                      <TableHead className="min-w-[180px] whitespace-nowrap">Category Name</TableHead>
                      <TableHead className="min-w-[180px] whitespace-nowrap">Description</TableHead>
                      <TableHead className="min-w-[120px] whitespace-nowrap">Status</TableHead>
                      <TableHead className="sticky right-0 z-20 min-w-[100px] bg-white shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.1)]">
                        <span className="font-semibold">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isError && <InventoryCategoryTableError />}
                    {!isError && filteredItems.length === 0 && <InventoryCategoryTableEmpty />}
                    {!isError && filteredItems.length > 0 && filteredItems.map((item: ItemCategory) => (
                      <InventoryCategoryTableRow key={item.itemCategoryId} item={item} userDetails={userDetails} />
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
      </div>
    </section>
  );
}
