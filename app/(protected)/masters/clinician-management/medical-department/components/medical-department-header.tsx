import { Hospital, Stethoscope } from "lucide-react";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { useGetAllMedicalDepartmentQuery } from "@/queries/general/medical-department/useGetAllMedicalDepartmentQuery";

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

export function MedicalDepartmentHeader() {
  const { medicalDepartments, totalItems, isPending }
    = useGetAllMedicalDepartmentQuery({
      pageNumber: 1,
      pageSize: 100,
    });

  const stats = useMemo(() => {
    if (isPending) {
      return {
        total: 0,
        active: 0,
        inactive: 0,
        highlighted: [] as string[],
      };
    }

    const active = medicalDepartments.filter(dep => dep.status?.toLowerCase() === "active").length;
    const inactive = medicalDepartments.length - active;
    const highlighted = medicalDepartments
      .slice(0, 3)
      .map(dep => dep.medicalDepartmentName);

    return {
      total: totalItems || medicalDepartments.length,
      active,
      inactive,
      highlighted,
    };
  }, [isPending, medicalDepartments, totalItems]);

  return (
    <section className="flex flex-col gap-4 bg-white">
      <div className="flex flex-col">
        <h1 className="text-xl font-medium text-gray-800">Medical Departments Overview</h1>
        <p className="text-sm text-gray-600 -mt-1">
          Track key clinical departments and their operational readiness
        </p>
      </div>

      <div className="flex gap-4 w-full overflow-x-auto">
        <div className="hidden lg:flex bg-white rounded-md p-4 border flex-1 relative min-w-[280px]">
          <Hospital className="absolute top-6 right-8 size-14 text-blue-700 opacity-40" strokeWidth={1} />

          <div className="flex flex-col gap-2 w-full">
            <h2 className="text-sm font-medium text-gray-800">Department Health</h2>

            {isPending
              ? (
                  <div className="flex gap-6">
                    <div className="flex flex-col gap-2">
                      <div className="h-8 w-16 rounded-md bg-gray-200 animate-pulse" />
                      <div className="h-3 w-24 rounded-md bg-gray-200 animate-pulse" />
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
                    <StatBlock label="Total" value={stats.total} colorClass="text-primary" />
                    <Divider />
                    <StatBlock label="Active" value={stats.active} colorClass="text-green-600" />
                    <Divider />
                    <StatBlock label="Inactive" value={stats.inactive} colorClass="text-red-500" />
                  </div>
                )}
          </div>
        </div>

        <div className="hidden xl:flex bg-white rounded-md p-4 border flex-1 relative min-w-[280px]">
          <Stethoscope className="absolute top-6 right-8 size-14 text-purple-600 opacity-40" strokeWidth={1} />
          <div className="flex flex-col gap-2 w-full">
            <h2 className="text-sm font-medium text-gray-800">Featured Departments</h2>
            <p className="text-xs text-gray-600">Recently accessed or commonly assigned teams</p>

            <div className="flex flex-col gap-2">
              {isPending && (
                <>
                  <div className="h-7 w-48 rounded-md bg-gray-200 animate-pulse" />
                  <div className="h-7 w-40 rounded-md bg-gray-200 animate-pulse" />
                  <div className="h-7 w-32 rounded-md bg-gray-200 animate-pulse" />
                </>
              )}

              {!isPending && stats.highlighted.length === 0 && (
                <p className="text-xs text-gray-500 italic">No departments configured yet</p>
              )}

              {!isPending && stats.highlighted.length > 0 && (
                stats.highlighted.map(name => (
                  <div key={name} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700 font-medium">{name}</span>
                    <span className="text-xs text-gray-500">Active</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
