import { ChevronLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function CreateRoleLoading() {
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
            {/* Left Column - Role Details */}
            <div className="lg:col-span-1 space-y-4">
              <div className="rounded-lg border border-border p-6 space-y-4">
                <Skeleton className="h-6 w-32" />
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <Skeleton className="h-6 w-11 rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Permissions */}
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-lg border border-border p-6 space-y-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-96" />

                {/* Permission Categories */}
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, categoryIndex) => (
                    <div key={`permission-category-${categoryIndex}`} className="space-y-3">
                      <div className="flex items-center justify-between p-4 rounded-lg bg-secondary border border-border">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-4 rounded" />
                          <Skeleton className="h-5 w-32" />
                        </div>
                        <Skeleton className="h-5 w-16" />
                      </div>

                      <div className="ml-8 space-y-2">
                        {Array.from({ length: 3 }).map((_, permIndex) => (
                          <div key={`permission-${categoryIndex}-${permIndex}`} className="flex items-center gap-3 p-3">
                            <Skeleton className="h-4 w-4 rounded" />
                            <div className="flex-1 space-y-1">
                              <Skeleton className="h-4 w-40" />
                              <Skeleton className="h-3 w-56" />
                            </div>
                          </div>
                        ))}
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
