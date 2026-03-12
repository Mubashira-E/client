import { Skeleton } from "@/components/ui/skeleton";

export default function ClinicianManagementLoading() {
  return (
    <section className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-32 mt-1" />
      </div>

      {/* Statistics Cards */}
      <div className="flex gap-4 w-full">
        <div className="bg-white rounded-md p-4 flex border flex-1">
          <div className="flex flex-col gap-2 w-full">
            <Skeleton className="h-5 w-32" />
            <div className="flex gap-6">
              <div className="flex flex-col">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-24 mt-1" />
              </div>
              <div className="w-px h-full bg-gray-200" />
              <div className="flex flex-col">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-24 mt-1" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-md p-4 flex border flex-1">
          <div className="flex flex-col gap-2 w-full">
            <Skeleton className="h-5 w-40" />
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Controls */}
      <div className="flex items-center gap-2 justify-between">
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <div className="p-4">
          <div className="space-y-3">
            {/* Table Header */}
            <div className="flex gap-4">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-8 w-32" />
            </div>

            {/* Table Rows */}
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={`clinician-table-row-skeleton-${index + 1}`} className="flex gap-4">
                <Skeleton className="h-12 w-32" />
                <Skeleton className="h-12 w-32" />
                <Skeleton className="h-12 w-32" />
                <Skeleton className="h-12 w-32" />
                <Skeleton className="h-12 w-32" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
        </div>
      </div>
    </section>
  );
}
