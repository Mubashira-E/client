import { Skeleton } from "@/components/ui/skeleton";

export default function SubServiceClassificationFormLoader() {
  return (
    <div className="space-y-8 max-w-2xl">
      <div className="space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-4 w-60" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-4 w-60" />
      </div>

      <div className="flex items-start space-x-3">
        <Skeleton className="h-5 w-5" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-4 w-60" />
      </div>

      <div className="flex justify-between">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  );
}
