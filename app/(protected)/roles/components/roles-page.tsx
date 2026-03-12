"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { parseAsString, useQueryState } from "nuqs";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { hasPermission } from "@/lib/utils/auth";
import { useGetUserDetailsQuery } from "@/queries/auth/useGetUserDetailsQuery";
import { useGetAllRoleQuery } from "@/queries/general/roles/useGetAllRoleQuery";
import { RolesHeader } from "./roles-header";
import { RolesTable } from "./roles-table";

export function RolesPage() {
  const { data: userDetails } = useGetUserDetailsQuery();
  const [searchFilter, setSearchFilter] = useQueryState(
    "searchFilter",
    parseAsString.withDefault(""),
  );

  const canCreate = hasPermission(userDetails, "Roles.Create");
  const {
    roles: apiRoles,
    isLoading,
    isError,
  } = useGetAllRoleQuery({
    SearchTerms: searchFilter || undefined,
  });

  const roles = apiRoles || [];

  return (
    <section className="flex flex-col gap-4 bg-white p-4 border rounded-md mt-4">
      <RolesHeader roles={roles} />
      <Suspense>
        <div className="flex items-end justify-end gap-2">
          <Input
            value={searchFilter}
            className="w-36"
            placeholder="Filter Roles"
            onChange={e => setSearchFilter(e.target.value)}
          />
          {canCreate && (
            <Link href="/roles/create">
              <Button variant="default">
                Add Role
                <Plus className="size-4" />
              </Button>
            </Link>
          )}
        </div>
        <RolesTable roles={roles} isPending={isLoading} isError={isError} />
      </Suspense>
    </section>
  );
}
