import type { User } from "@/types/user";
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

type UsersHeaderProps = {
  users: User[];
  isPending?: boolean;
};

export function UsersHeader({ users, isPending = false }: UsersHeaderProps) {
  const stats = useMemo(() => {
    if (isPending) {
      return {
        total: 0,
        active: 0,
        pending: 0,
        highlightedUsers: [] as string[],
      };
    }

    const active = users.filter(u => u.status === "active").length;
    const pending = users.filter(u => u.status === "pending").length;
    const highlightedUsers = users
      .slice(0, 3)
      .map(u => `${u.firstName} ${u.lastName}`);

    return {
      total: users.length,
      active,
      pending,
      highlightedUsers,
    };
  }, [isPending, users]);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col">
        <h1 className="text-xl font-medium text-gray-800">User Management</h1>
        <p className="text-sm text-gray-600 -mt-1">
          Manage user accounts and role assignments across the system
        </p>
      </div>

      <div className="flex gap-4 w-full overflow-x-auto">
        <div className="hidden lg:flex bg-white rounded-md p-4 border flex-1 relative min-w-[280px]">
          <Users
            className="absolute top-6 right-8 size-14 text-blue-800 opacity-40"
            strokeWidth={1}
          />

          <div className="flex flex-col gap-2 w-full">
            <h2 className="text-sm font-medium text-gray-800">User Overview</h2>

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
                      label="Total Users"
                      value={stats.total}
                      colorClass="text-primary"
                    />
                    <Divider />
                    <StatBlock
                      label="Active Users"
                      value={stats.active}
                      colorClass="text-green-600"
                    />
                    <Divider />
                    <StatBlock
                      label="Pending Users"
                      value={stats.pending}
                      colorClass="text-orange-500"
                    />
                  </div>
                )}
          </div>
        </div>

        <div className="hidden xl:flex bg-white rounded-md p-4 border flex-1 relative min-w-[280px]">
          <Shield
            className="absolute top-6 right-8 size-14 text-purple-600 opacity-40"
            strokeWidth={1}
          />
          <div className="flex flex-col gap-2 w-full">
            <h2 className="text-sm font-medium text-gray-800">Recent Users</h2>
            <p className="text-xs text-gray-600">
              Recently added or active user accounts
            </p>

            <div className="flex flex-col gap-2">
              {isPending && (
                <>
                  <div className="h-7 w-48 rounded-md bg-gray-200 animate-pulse" />
                  <div className="h-7 w-40 rounded-md bg-gray-200 animate-pulse" />
                  <div className="h-7 w-32 rounded-md bg-gray-200 animate-pulse" />
                </>
              )}

              {!isPending && stats.highlightedUsers.length === 0 && (
                <p className="text-xs text-gray-500 italic">
                  No users available yet
                </p>
              )}

              {!isPending
                && stats.highlightedUsers.length > 0
                && stats.highlightedUsers.map(userName => (
                  <div
                    key={userName}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-gray-700 font-medium">
                      {userName}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
