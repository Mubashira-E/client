import { Skeleton } from "@/components/ui/skeleton";

export function UpdateAppointmentSkeleton() {
  return (
    <div className="w-full p-4 space-y-8">
      {/* Appointment Information Skeleton */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="px-4 pt-4">
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array.from({ length: 9 })].map((_, i) => (
              <div key={`appointment-info-field-${i + 1}`} className="flex flex-col space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-32" />
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="px-4">
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array.from({ length: 8 })].map((_, i) => (
                <div key={`patient-info-field-${i + 1}`} className="flex flex-col space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-32" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Update Appointment Details Skeleton */}
      <div className="bg-white border rounded-lg overflow-hidden p-4">
        <Skeleton className="h-8 w-64 mb-4" />
        <div className="border rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array.from({ length: 5 })].map((_, i) => (
              <div key={`update-form-field-${i + 1}`} className="space-y-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-10 w-full mt-1" />
              </div>
            ))}
            <div className="space-y-2 md:col-span-2 lg:col-span-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-24 w-full mt-1" />
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </div>
  );
}
