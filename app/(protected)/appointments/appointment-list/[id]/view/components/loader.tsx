import { Skeleton } from "@/components/ui/skeleton";
import { RemarkSkeleton } from "./view-appointment";

export function AppointmentDetailsSkeleton() {
  return (
    <div className="p-6">
      <Skeleton className="h-8 w-64 mb-6" />

      <div className="px-6 pt-6 rounded-md">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={`appointment-detail-field-${i + 1}`}>
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-5 w-24" />
            </div>
          ))}
        </div>

        <div className="mt-4">
          <Skeleton className="h-4 w-20 mb-2" />
          <RemarkSkeleton />
        </div>
      </div>

      <div className="p-6 rounded-md mt-4">
        <Skeleton className="h-6 w-48 mb-4" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={`patient-detail-field-${i + 1}`}>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-5 w-28" />
            </div>
          ))}
        </div>

        <div className="mt-4">
          <Skeleton className="h-4 w-28 mb-2" />
          <Skeleton className="h-5 w-full max-w-lg" />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-end mt-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={`action-button-${i + 1}`} className="h-10 w-28" />
        ))}
      </div>
    </div>
  );
}
