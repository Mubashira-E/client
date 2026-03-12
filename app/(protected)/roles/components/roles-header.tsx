"use client";

import type { RoleResponse } from "@/types/role";
import { Shield, Users } from "lucide-react";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

function StatBlock({
  label,
  value,
  colorClass,
}: {
  label: string;
  value: number;
  colorClass: string;
}) {
  return (
    <div className="flex flex-col">
      <p className="text-3xl font-bold text-gray-800">{value}</p>
      <p className={cn("text-xs uppercase", colorClass)}>{label}</p>
    </div>
  );
}

function Divider() {
  return <div className="w-px h-full bg-gray-200" />;
}

type RolesHeaderProps = {
  roles: RoleResponse[];
  isPending?: boolean;
};

export function RolesHeader({ roles, isPending = false }: RolesHeaderProps) {
  const stats = useMemo(() => {
    if (isPending) {
      return {
        total: 0,
        systemRoles: 0,
        customRoles: 0,
        totalUsers: 0,
        highlightedRoles: [] as string[],
      };
    }

    const systemRoles = roles.filter(
      r => r.roleType === "System Role",
    ).length;
    const customRoles = roles.length - systemRoles;
    const totalUsers = roles.reduce((sum, r) => sum + (r.userCount || 0), 0);
    const highlightedRoles = roles.slice(0, 3).map(r => r.name);

    return {
      total: roles.length,
      systemRoles,
      customRoles,
      totalUsers,
      highlightedRoles,
    };
  }, [isPending, roles]);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col">
        <h1 className="text-xl font-medium text-gray-800">
          Roles & Permissions
        </h1>
        <p className="text-sm text-gray-600 -mt-1">
          Manage roles and their permissions across the system
        </p>
      </div>

      <div className="flex gap-4 w-full overflow-x-auto">
        <div className="hidden lg:flex bg-white rounded-md p-4 border flex-1 relative min-w-[280px]">
          <Shield
            className="absolute top-6 right-8 size-14 text-blue-800 opacity-40"
            strokeWidth={1}
          />

          <div className="flex flex-col gap-2 w-full">
            <h2 className="text-sm font-medium text-gray-800">
              Roles Overview
            </h2>

            {isPending
              ? (
                  <div className="flex gap-6">
                    <div className="flex flex-col gap-2">
                      <div className="h-8 w-16 rounded-md bg-gray-200 animate-pulse" />
                      <div className="h-3 w-20 rounded-md bg-gray-200 animate-pulse" />
                    </div>
                    <Divider />
                    <div className="flex flex-col gap-2">
                      <div className="h-8 w-16 rounded-md bg-gray-200 animate-pulse" />
                      <div className="h-3 w-24 rounded-md bg-gray-200 animate-pulse" />
                    </div>
                    <Divider />
                    <div className="flex flex-col gap-2">
                      <div className="h-8 w-16 rounded-md bg-gray-200 animate-pulse" />
                      <div className="h-3 w-24 rounded-md bg-gray-200 animate-pulse" />
                    </div>
                  </div>
                )
              : (
                  <div className="flex gap-6">
                    <StatBlock
                      label="Total Roles"
                      value={stats.total}
                      colorClass="text-primary"
                    />
                    <Divider />
                    <StatBlock
                      label="System Roles"
                      value={stats.systemRoles}
                      colorClass="text-green-600"
                    />
                    <Divider />
                    <StatBlock
                      label="Custom Roles"
                      value={stats.customRoles}
                      colorClass="text-orange-500"
                    />
                  </div>
                )}
          </div>
        </div>

        <div className="hidden xl:flex bg-white rounded-md p-4 border flex-1 relative min-w-[280px]">
          <Users
            className="absolute top-6 right-8 size-14 text-purple-600 opacity-40"
            strokeWidth={1}
          />
          <div className="flex flex-col gap-2 w-full">
            <h2 className="text-sm font-medium text-gray-800">
              User Assignment
            </h2>
            <p className="text-xs text-gray-600">
              Total users assigned to roles
            </p>

            <div className="flex flex-col gap-2">
              {isPending && (
                <>
                  <div className="h-7 w-48 rounded-md bg-gray-200 animate-pulse" />
                  <div className="h-7 w-40 rounded-md bg-gray-200 animate-pulse" />
                  <div className="h-7 w-32 rounded-md bg-gray-200 animate-pulse" />
                </>
              )}

              {!isPending && stats.highlightedRoles.length === 0 && (
                <p className="text-xs text-gray-500 italic">
                  No roles available yet
                </p>
              )}

              {!isPending && stats.highlightedRoles.length > 0 && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-800">
                      {stats.totalUsers}
                    </span>
                    <span className="text-xs text-gray-600">Total Users</span>
                  </div>
                  <div className="flex flex-col gap-1 mt-2">
                    {stats.highlightedRoles.map((roleName) => {
                      const role = roles.find(r => r.name === roleName);
                      return (
                        <div
                          key={roleName}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-gray-700 font-medium">
                            {roleName}
                          </span>
                          <span className="text-gray-600">
                            {role?.userCount || 0}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
