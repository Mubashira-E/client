import { Card, CardContent } from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

export function PatientSearchSkeleton() {
  return (
    <div className="p-4 space-y-4">
      <Card className="overflow-hidden">
        <CardContent className="p-4 lg:p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div className="w-full">
              <Skeleton className="h-6 w-2/3 mb-4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 md:gap-x-8 gap-y-2">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-4 w-40 mb-2" />
                <Skeleton className="h-4 w-36 mb-2" />
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-4 w-28 mb-2" />
                <Skeleton className="h-4 w-36 mb-2" />
                <Skeleton className="h-4 w-full col-span-1 sm:col-span-2" />
              </div>
            </div>
            <Skeleton className="h-9 w-20 self-end md:self-start" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
