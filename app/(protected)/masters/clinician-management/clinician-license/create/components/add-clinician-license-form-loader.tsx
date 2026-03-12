import { Skeleton } from "@/components/ui/skeleton";

export function ClinicianLicenseFormLoader() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 8 }, (_, fieldIndex) => (
          <div key={`clinician-license-form-field-${fieldIndex}`} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10" />
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {Array.from({ length: 2 }, (_, checkboxIndex) => (
          <div key={`clinician-license-checkbox-${checkboxIndex}`} className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-20" />
      </div>

      <div className="flex justify-between">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  );
}
