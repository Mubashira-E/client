import { Activity, RefreshCw, UsersRound } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetClinicianWidgetQuery } from "@/queries/masters/clinician-management/useGetClinicianWidgetQuery";

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
              <p className="text-3xl font-bold text-gray-800">{value || 0}</p>
              <p className={`text-xs ${colorClass} uppercase`}>{label}</p>
            </>
          )}
    </div>
  );
}

function Divider({ isLoading }: { isLoading: boolean }) {
  return <div className={`w-px h-full ${isLoading ? "bg-gray-100" : "bg-gray-200"}`} />;
}

export function ClinicianManagementHeader() {
  const [_departmentId] = useQueryState("medicalDepartmentId", parseAsInteger.withDefault(0));

  const { data, isPending, isError, refetch } = useGetClinicianWidgetQuery();
  const totalClinicianCount = data?.data?.totalClinicians || 0;
  const totalDepartmentCount = 0; // Not available in widget data

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col">
        <h1 className="text-xl font-medium text-gray-800">Clinician Management</h1>
        <p className="text-sm text-gray-600 -mt-1">Manage your clinicians</p>
      </div>

      <div className="flex gap-4 w-full overflow-x-auto">
        <div className="hidden lg:flex bg-white rounded-md p-4 border flex-1 relative min-w-[300px]">
          <UsersRound className="absolute top-6 right-8 size-14 text-red-800 opacity-50" strokeWidth={1} />

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
            <h2 className="text-sm font-medium text-gray-800">Clinician Statistics</h2>

            <div className="flex gap-6">
              <StatItem
                isLoading={isPending}
                colorClass="text-primary"
                label="Total Clinicians"
                value={totalClinicianCount}
              />

              <Divider isLoading={isPending} />

              <StatItem
                isLoading={isPending}
                colorClass="text-green-600"
                label="Total Departments"
                value={totalDepartmentCount}
              />
            </div>
          </div>
        </div>

        <div className="hidden xl:flex bg-white rounded-md p-4 border flex-1 relative min-w-[300px]">
          <Activity className="absolute top-6 right-8 size-14 text-green-600 opacity-50" strokeWidth={1} />
          <div className="flex flex-col gap-2 w-full">
            <h2 className="text-sm font-medium text-gray-800">Recently Added Clinicians</h2>

            <div className="flex flex-col gap-2">
              {isPending
                ? (
                    <>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </>
                  )
                : (
                    <div className="text-xs text-gray-600">
                      Recent clinician details not available
                    </div>
                  )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
