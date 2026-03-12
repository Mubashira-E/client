import { Skeleton } from "@/components/ui/skeleton";

export default function MedicalDepartmentFormLoader() {
  return (
    <div className="space-y-8 max-w-2xl">
      {/* Department Name Field Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-32" />
        {" "}
        {/* Form Label */}
        <Skeleton className="h-10 w-full" />
        {" "}
        {/* Input Field */}
        <Skeleton className="h-4 w-64" />
        {" "}
        {/* Form Description */}
      </div>

      {/* Buttons Skeleton */}
      <div className="flex justify-between">
        <Skeleton className="h-10 w-32" />
        {" "}
        {/* Cancel Button */}
        <Skeleton className="h-10 w-48" />
        {" "}
        {/* Create Button */}
      </div>
    </div>
  );
}
