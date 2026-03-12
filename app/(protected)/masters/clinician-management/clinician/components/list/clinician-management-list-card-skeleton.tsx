export function ClinicianManagementListCardSkeleton() {
  return (
    <div className="grid grid-cols-3 justify-between rounded-md border border-gray-300 bg-white p-4">
      <div className="flex min-w-[200px] items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-full border border-primary-100 bg-primary-100">
          <div className="size-12 bg-gray-200 rounded-full animate-pulse" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="h-6 w-32 animate-pulse rounded-md bg-gray-200" />
          <div className="h-4 w-24 animate-pulse rounded-md bg-gray-200" />
        </div>
      </div>
      <div className="mx-4 flex items-center">
        <div className="h-4 w-48 animate-pulse rounded-md bg-gray-200" />
      </div>
      <div className="flex items-center gap-4">
        <div className="h-8 w-32 animate-pulse rounded-md bg-gray-200" />
        <div className="h-8 w-28 animate-pulse rounded-md bg-gray-200" />
      </div>
    </div>
  );
}
