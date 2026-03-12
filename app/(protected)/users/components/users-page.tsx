"use client";

import type { Role } from "../../roles/components/roles-management";

import { Plus } from "lucide-react";
import Link from "next/link";
import { parseAsString, useQueryState } from "nuqs";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetAllUsersQuery } from "@/queries/user/useGetAllUsersQuery";
import { useUpdateUserStatusMutation } from "@/queries/user/useUpdateUserStatusMutation";
import { defaultRoles } from "../../roles/components/roles-management";
import { UsersHeader } from "./users-header";
import { UsersTable } from "./users-table";

export function UsersPage() {
  const [searchFilter, setSearchFilter] = useQueryState(
    "searchFilter",
    parseAsString.withDefault(""),
  );

  const { users, isLoading, isError, isFetching } = useGetAllUsersQuery({
    searchTerms: searchFilter,
  });

  const { mutate: updateUserStatus } = useUpdateUserStatusMutation();

  const roles: Role[] = defaultRoles;

  const handleUpdateUserStatus = (userId: string, isActive: boolean) => {
    updateUserStatus({ id: userId, data: { isActive } });
  };

  return (
    <section className="flex flex-col gap-4 bg-white p-4 border rounded-md mt-4">
      <UsersHeader users={users} />
      <Suspense>
        <div className="flex items-end justify-end gap-2">
          <Input
            value={searchFilter}
            className="w-36"
            placeholder="Filter Users"
            onChange={e => setSearchFilter(e.target.value)}
          />
          <Link href="/users/create">
            <Button variant="default">
              Add User
              <Plus className="size-4" />
            </Button>
          </Link>
        </div>
        <UsersTable
          users={users}
          roles={roles}
          onUpdateUserRoles={() => {}}
          onUpdateUserStatus={handleUpdateUserStatus}
          isPending={isLoading || isFetching}
          isError={isError}
        />
      </Suspense>
    </section>
  );
}
