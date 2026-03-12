"use client";

import type { Role } from "../../roles/components/roles-management";
import type { User } from "@/types/user";
import {
  Check,
  CheckCircle,
  Edit,
  MoreHorizontal,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { parseAsString, useQueryState } from "nuqs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { hasPermission } from "@/lib/utils/auth";
import { useGetUserDetailsQuery } from "@/queries/auth/useGetUserDetailsQuery";
import { UsersTableEmpty } from "./users-table-empty";
import { UsersTableError } from "./users-table-error";
import { UsersTableLoader } from "./users-table-loader";

type UsersTableProps = {
  users: User[];
  roles: Role[];
  onUpdateUserRoles: (userId: string, roles: string[]) => void;
  onUpdateUserStatus: (userId: string, isActive: boolean) => void;
  isPending?: boolean;
  isError?: boolean;
};

export function UsersTable({
  users,
  roles,
  onUpdateUserRoles,
  onUpdateUserStatus,
  isPending = false,
  isError = false,
}: UsersTableProps) {
  const { data: userDetails } = useGetUserDetailsQuery();
  const [searchFilter] = useQueryState(
    "searchFilter",
    parseAsString.withDefault(""),
  );

  const canUpdate = hasPermission(userDetails, "Users.Update");

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`;
    const matchesSearch
      = fullName.toLowerCase().includes(searchFilter.toLowerCase())
        || user.email.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesSearch;
  });

  const getRoleName = (roleId: string) => {
    return roles.find(r => r.id === roleId)?.name || roleId;
  };

  const toggleUserRole = (
    userId: string,
    roleId: string,
    currentRoles: string[],
  ) => {
    const newRoles = currentRoles.includes(roleId)
      ? currentRoles.filter(r => r !== roleId)
      : [...currentRoles, roleId];
    onUpdateUserRoles(userId, newRoles);
  };

  return (
    <section className="space-y-4">
      <div className="rounded-md border overflow-hidden">
        {isPending
          ? (
              <UsersTableLoader />
            )
          : (
              <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
                <Table>
                  <TableHeader className="sticky top-0 z-10 bg-white">
                    <TableRow>
                      <TableHead className="pl-4 min-w-[180px] whitespace-nowrap">
                        User
                      </TableHead>
                      <TableHead className="min-w-[180px] whitespace-nowrap">
                        Roles
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
                    {isError && <UsersTableError />}
                    {!isError && filteredUsers.length === 0 && <UsersTableEmpty />}
                    {!isError
                      && filteredUsers.length > 0
                      && filteredUsers.map((user: User) => (
                        <TableRow key={user.id}>
                          <TableCell className="pl-4 min-w-[180px] whitespace-nowrap">
                            <div className="flex items-center gap-3 overflow-hidden text-ellipsis max-w-[250px]">
                              <Avatar className="size-10 shrink-0">
                                <AvatarImage
                                  src="/placeholder.svg"
                                  alt={`${user.firstName} ${user.lastName}`}
                                />
                                <AvatarFallback className="bg-primary text-white text-sm">
                                  {user.firstName[0]}
                                  {user.lastName[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-foreground truncate">
                                  {user.firstName}
                                  {" "}
                                  {user.lastName}
                                </p>
                                <p className="text-sm text-muted-foreground truncate">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="min-w-[180px] whitespace-nowrap">
                            <div className="overflow-hidden text-ellipsis max-w-[250px]">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button
                                    type="button"
                                    className="flex flex-wrap gap-1.5 max-w-[230px] cursor-pointer hover:opacity-80 transition-opacity"
                                  >
                                    {(user.roles || []).length > 0
                                      ? (
                                          (user.roles || []).map(roleId => (
                                            <Badge
                                              key={roleId}
                                              variant="secondary"
                                              className="text-xs"
                                            >
                                              {getRoleName(roleId)}
                                            </Badge>
                                          ))
                                        )
                                      : (
                                          <span className="text-sm text-muted-foreground">
                                            No roles assigned
                                          </span>
                                        )}
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-56">
                                  <DropdownMenuLabel>
                                    Assign Roles
                                  </DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  {roles.map((role) => {
                                    const isAssigned = (user.roles || []).includes(
                                      role.id,
                                    );
                                    return (
                                      <DropdownMenuItem
                                        key={role.id}
                                        onClick={() =>
                                          toggleUserRole(
                                            user.id,
                                            role.id,
                                            user.roles || [],
                                          )}
                                        className="flex items-center justify-between"
                                      >
                                        <div>
                                          <p className="font-medium">{role.name}</p>
                                          <p className="text-xs text-muted-foreground">
                                            {role.permissions.length}
                                            {" "}
                                            permissions
                                          </p>
                                        </div>
                                        {isAssigned && (
                                          <Check className="size-4 text-primary" />
                                        )}
                                      </DropdownMenuItem>
                                    );
                                  })}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                          <TableCell className="min-w-[180px] whitespace-nowrap">
                            <Badge
                              variant={
                                (user.status || "").toLowerCase() === "active"
                                  ? "default"
                                  : "secondary"
                              }
                              className={
                                (user.status || "").toLowerCase() === "active"
                                  ? "text-white"
                                  : "text-white bg-red-700"
                              }
                            >
                              {(user.status || "").toLowerCase() === "active"
                                ? "Active"
                                : "Inactive"}
                            </Badge>
                          </TableCell>
                          {canUpdate && (
                            <TableCell className="sticky right-0 z-20 min-w-[100px] bg-white shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.1)]">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <MoreHorizontal className="size-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <Link href={`/users/edit/${user.id}`}>
                                    <DropdownMenuItem>
                                      <Edit className="size-4 mr-2" />
                                      Edit User
                                    </DropdownMenuItem>
                                  </Link>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      onUpdateUserStatus(
                                        user.id,
                                        (user.status || "").toLowerCase()
                                        !== "active",
                                      )}
                                    className={
                                      (user.status || "").toLowerCase() === "active"
                                        ? "text-red-600 focus:text-red-600"
                                        : "text-green-600 focus:text-green-600"
                                    }
                                  >
                                    {(user.status || "").toLowerCase()
                                      === "active"
                                      ? (
                                          <>
                                            <XCircle className="size-4 mr-2 text-red-600" />
                                            Inactive
                                          </>
                                        )
                                      : (
                                          <>
                                            <CheckCircle className="size-4 mr-2 text-green-600" />
                                            Active
                                          </>
                                        )}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          )}
                          {!canUpdate && (
                            <TableCell className="sticky right-0 z-20 min-w-[100px] bg-white shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.1)]" />
                          )}
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            )}
      </div>
    </section>
  );
}
