export function ClinicianManagementCardSkeleton() {
  return (
    <div className="relative flex flex-col rounded-lg border border-gray-300 bg-white px-3 pt-3">
      <section className="flex w-full flex-col gap-2">
        <div className="flex size-12 items-center justify-center rounded-full border border-gray-200 bg-gray-100 animate-pulse">
          <div className="size-6 bg-gray-300 rounded animate-pulse" />
        </div>
        <div className="flex flex-col items-start justify-center">
          <div className="mt-2 flex w-full justify-between">
            <div className="flex flex-col gap-1">
              <div className="h-7 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1">
                  <div className="h-4 w-14 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="flex w-full items-center justify-between">
        <div>
          <div className="flex items-center gap-4">
            <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </section>
    </div>
  );
}
