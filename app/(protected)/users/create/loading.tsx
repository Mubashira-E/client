import { ChevronLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function CreateUserLoading() {
  return (
    <section className="flex flex-col gap-4">
      {/* Back Button */}
      <div className="flex items-center gap-0.5 text-primary">
        <ChevronLeft className="w-4 h-4" />
        <Skeleton className="h-4 w-24" />
      </div>

      {/* Page Header */}
      <section className="flex flex-col gap-4 px-4 py-6 rounded-md border bg-white">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>

        {/* Form Content */}
        <section className="flex flex-col gap-4 bg-white p-4 border rounded-md">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - User Details */}
            <div className="lg:col-span-1 space-y-4">
              <div className="rounded-lg border border-border p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Role Assignment */}
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-lg border border-border p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-6 w-40" />
                </div>
                <Skeleton className="h-4 w-96" />

                {/* Roles */}
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, roleIndex) => (
                    <div key={`role-${roleIndex}`} className="flex items-start gap-4 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                      <Skeleton className="h-5 w-5 rounded mt-0.5" />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-5 w-20 rounded-full" />
                        </div>
                        <Skeleton className="h-4 w-full" />
                        <div className="flex flex-wrap gap-1 mt-2">
                          <Skeleton className="h-5 w-16 rounded-full" />
                          <Skeleton className="h-5 w-20 rounded-full" />
                          <Skeleton className="h-5 w-24 rounded-full" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </section>
      </section>
    </section>
  );
}
