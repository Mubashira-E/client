import { Shield, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function RolesLoading() {
  return (
    <section className="flex flex-col gap-4 bg-white p-4 border rounded-md mt-4">
      {/* Header Section */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-4 w-96 mt-1" />
        </div>

        <div className="flex gap-4 w-full overflow-x-auto">
          {/* Roles Overview Card */}
          <div className="hidden lg:flex bg-white rounded-md p-4 border flex-1 relative min-w-[280px]">
            <Shield className="absolute top-6 right-8 size-14 text-gray-300 opacity-40" strokeWidth={1} />

            <div className="flex flex-col gap-2 w-full">
              <Skeleton className="h-4 w-32" />

              <div className="flex gap-6">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <div className="w-px h-full bg-gray-200" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <div className="w-px h-full bg-gray-200" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </div>
          </div>

          {/* User Assignment Card */}
          <div className="hidden xl:flex bg-white rounded-md p-4 border flex-1 relative min-w-[280px]">
            <Users className="absolute top-6 right-8 size-14 text-gray-300 opacity-40" strokeWidth={1} />
            <div className="flex flex-col gap-2 w-full">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />

              <div className="flex flex-col gap-2 mt-2">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-7 w-40" />
                <Skeleton className="h-7 w-32" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Add Button */}
      <div className="flex items-end justify-end gap-2">
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <div className="border-b bg-muted/50">
          <div className="h-12 flex items-center px-4">
            <div className="flex gap-4 w-full">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>

        {/* Table Rows */}
        {Array.from({ length: 6 }).map((_, rowIndex) => (
          <div key={`roles-table-row-${rowIndex}`} className="border-b last:border-b-0">
            <div className="h-16 flex items-center px-4">
              <div className="flex gap-4 w-full items-center">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
