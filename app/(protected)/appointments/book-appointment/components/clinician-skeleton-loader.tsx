import { Skeleton } from "@/components/ui/skeleton";
/* eslint-disable react/no-array-index-key */

export function ClinicianSkeletonLoader() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
      { }
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={`clinician-skeleton-${index}`}
          className="border rounded-lg p-4 flex gap-4"
        >
          <Skeleton className="rounded-full h-20 w-20" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
