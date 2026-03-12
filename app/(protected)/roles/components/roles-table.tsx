"use client";

import type { UserDetails } from "@/queries/auth/useGetUserDetailsQuery";
import type { RoleResponse } from "@/types/role";

import {
  CheckCircle,
  Edit,
  MoreHorizontal,
  Trash2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { parseAsString, useQueryState } from "nuqs";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteConfirmationModal } from "@/lib/components/delete-confirmation-modal";
import { hasPermission } from "@/lib/utils/auth";
import { useGetUserDetailsQuery } from "@/queries/auth/useGetUserDetailsQuery";
import { useDeleteRoleMutation } from "@/queries/general/roles/useDeleteRoleMutation";
import { usePatchRoleStatusMutation } from "@/queries/general/roles/usePatchRoleStatusMutation";
import { RolesTableEmpty } from "./roles-table-empty";
import { RolesTableError } from "./roles-table-error";
import { RolesTableLoader } from "./roles-table-loader";

type RolesTableRowProps = {
  role: RoleResponse;
  userDetails: UserDetails | undefined;
};

function RolesTableRow({ role, userDetails }: RolesTableRowProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const isActive = role.status === "Active";
  const patchMutation = usePatchRoleStatusMutation(role.roleId);

  const canUpdate = hasPermission(userDetails, "Roles.Update");
  const canDelete = hasPermission(userDetails, "Roles.Delete");
  const hasAnyAction = canUpdate || canDelete;
  const deleteMutation = useDeleteRoleMutation(role.roleId, {
    onSuccess: () => {
      toast.success("Role deleted successfully");
      setShowDeleteModal(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete role");
    },
  });

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate();
  };

  return (
    <>
      <TableRow key={role.roleId}>
        <TableCell className="pl-4 font-medium min-w-[180px] whitespace-nowrap">
          <div
            className="overflow-hidden text-ellipsis max-w-[250px]"
            title={role.name}
          >
            {role.name}
          </div>
        </TableCell>
        <TableCell className="min-w-[180px] whitespace-nowrap">
          <div
            className="overflow-hidden text-ellipsis max-w-[250px]"
            title={role.description}
          >
            {role.description}
          </div>
        </TableCell>
        <TableCell className="min-w-[180px] whitespace-nowrap">
          <div
            className="overflow-hidden text-ellipsis max-w-[250px]"
            title={role.roleType || ""}
          >
            {role.roleType || "-"}
          </div>
        </TableCell>
        <TableCell className="min-w-[180px] whitespace-nowrap">
          <Badge
            variant="outline"
            className={
              isActive
                ? "bg-primary text-primary-foreground"
                : "bg-red-500 text-white border-border"
            }
          >
            {isActive ? "Active" : "Inactive"}
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
                  <Link href={`/roles/edit/${role.roleId}`}>
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                  </Link>
                )}
                {canUpdate && (
                  <DropdownMenuItem
                    onClick={() => {
                      patchMutation.mutate(
                        { isActive: !isActive },
                        {
                          onSuccess: () => {
                            toast.success(
                              `Role ${
                                !isActive ? "activated" : "deactivated"
                              } successfully`,
                            );
                          },
                          onError: () => {
                            toast.error("Failed to update role status");
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
                  <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-red-600 focus:text-red-600"
                    disabled={deleteMutation.isPending}
                  >
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
        title="Delete Role"
        description="This action cannot be undone and will remove this role from all assigned users."
        itemName={role.name}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
}

type RolesTableProps = {
  roles: RoleResponse[];
  isPending?: boolean;
  isError?: boolean;
};

export function RolesTable({
  roles,
  isPending = false,
  isError = false,
}: RolesTableProps) {
  const { data: userDetails } = useGetUserDetailsQuery();
  const [searchFilter] = useQueryState(
    "searchFilter",
    parseAsString.withDefault(""),
  );

  const filteredItems = (roles || []).filter(
    item =>
      item.name.toLowerCase().includes(searchFilter.toLowerCase())
      || item.description?.toLowerCase().includes(searchFilter.toLowerCase()),
  );

  return (
    <section className="space-y-4">
      <div className="rounded-md border overflow-hidden">
        {isPending
          ? (
              <RolesTableLoader />
            )
          : (
              <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
                <Table>
                  <TableHeader className="sticky top-0 z-10 bg-white">
                    <TableRow>
                      <TableHead className="pl-4 min-w-[180px] whitespace-nowrap">
                        Role Name
                      </TableHead>
                      <TableHead className="min-w-[180px] whitespace-nowrap">
                        Description
                      </TableHead>
                      <TableHead className="min-w-[180px] whitespace-nowrap">
                        Role Type
                      </TableHead>
                      <TableHead className="min-w-[180px] whitespace-nowrap">
                        Status
                      </TableHead>
                      <TableHead className="sticky right-0 z-20 min-w-[100px] bg-white shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.1)]">
                        <span className="font-semibold">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isError && <RolesTableError />}
                    {!isError && filteredItems.length === 0 && <RolesTableEmpty />}
                    {!isError
                      && filteredItems.length > 0
                      && filteredItems.map((role: RoleResponse) => (
                        <RolesTableRow key={role.roleId} role={role} userDetails={userDetails} />
                      ))}
                  </TableBody>
                </Table>
              </div>
            )}
      </div>
    </section>
  );
}
