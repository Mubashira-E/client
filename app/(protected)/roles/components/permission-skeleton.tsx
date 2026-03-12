import { Skeleton } from "@/components/ui/skeleton";

export function PermissionSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-32" />
            </div>
            <Skeleton className="h-5 w-10" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[1, 2, 3, 4].map(j => (
              <div
                key={j}
                className="flex items-center justify-between p-3 rounded-lg border border-border bg-white"
              >
                <div className="space-y-0.5">
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-5 w-9" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
