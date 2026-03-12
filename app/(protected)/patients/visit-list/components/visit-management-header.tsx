"use client";

import { Activity, Calendar, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllVisitQuery } from "@/queries/visit/useGetAllVisitQuery";

function StatItem({
  value,
  label,
  colorClass,
  isLoading,
}: {
  value: number | undefined;
  label: string;
  colorClass: string;
  isLoading: boolean;
}) {
  return (
    <div className="flex flex-col">
      {isLoading
        ? (
            <>
              <Skeleton className="h-9 w-16 mb-2" />
              <Skeleton className="h-3 w-24" />
            </>
          )
        : (
            <>
              <p className="text-3xl font-bold text-gray-800">{value ?? 0}</p>
              <p className={`text-xs ${colorClass} uppercase`}>{label}</p>
            </>
          )}
    </div>
  );
}

export function VisitManagementHeader() {
  const { visits, totalItems, isPending, isError, refetch } = useGetAllVisitQuery({
    pageNumber: 1,
    pageSize: 1,
    sortOrderBy: false, // false = descending → most recent first
  });

  const recentVisit = visits?.[0];

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col">
        <h1 className="text-xl font-medium text-gray-800">Visit Management</h1>
        <p className="text-sm text-gray-600 -mt-1">Manage patients visit</p>
      </div>

      <div className="flex gap-4 w-full overflow-x-auto">
        {/* Statistics */}
        <div className="hidden lg:flex bg-white rounded-md p-4 border flex-1 relative min-w-[300px]">
          <Calendar className="absolute top-6 right-8 size-14 text-green-800 opacity-50" strokeWidth={1} />

          {isError && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              className="absolute top-1 right-2 h-8 px-2 text-red-500"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          )}

          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-medium text-gray-800">Visit Statistics</h2>
            <div className="flex gap-6">
              <StatItem
                isLoading={isPending}
                colorClass="text-primary"
                label="Total Visits"
                value={totalItems}
              />
            </div>
          </div>
        </div>

        {/* Recent Visit */}
        <div className="hidden xl:flex bg-white rounded-md p-4 border flex-1 relative min-w-[300px]">
          <Activity className="absolute top-6 right-8 size-14 text-blue-600 opacity-50" strokeWidth={1} />
          <div className="flex flex-col gap-2 w-full">
            <h2 className="text-sm font-medium text-gray-800">Recent Visits</h2>

            <div className="flex flex-col gap-2">
              {isPending
                ? (
                    <>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </>
                  )
                : recentVisit
                  ? (
                      <>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-medium text-gray-800">Patient Name</p>
                          <p className="text-xs text-gray-600">{recentVisit.patientName}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-medium text-gray-800">Visit ID</p>
                          <p className="text-xs text-gray-600">V{String(recentVisit.visitNo).padStart(3, "0")}</p>
                        </div>
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-medium text-gray-800">Department</p>
                            <p className="text-xs text-gray-600">{recentVisit.medicalDepartmentName}</p>
                          </div>
                          <div className="text-xs text-gray-600">
                            {recentVisit.visitDate}
                          </div>
                        </div>
                      </>
                    )
                  : (
                      <p className="text-xs text-gray-400 italic">No visits found</p>
                    )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}