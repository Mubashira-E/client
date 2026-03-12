import { Package } from "lucide-react";

export default function InventoryLoading() {
  return (
    <div className="flex flex-col gap-4">
      {/* Header Skeleton */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col">
          <div className="h-6 w-64 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-96 bg-gray-200 rounded animate-pulse mt-2" />
        </div>

        <div className="flex gap-4 w-full overflow-x-auto">
          <div className="hidden lg:flex bg-white rounded-md p-4 border flex-1 relative min-w-[300px]">
            <Package className="absolute top-6 right-8 size-14 text-gray-300" strokeWidth={1} />
            <div className="flex flex-col gap-2">
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="flex gap-6">
                <div className="flex flex-col gap-1">
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="w-px h-full bg-gray-200" />
                <div className="flex flex-col gap-1">
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          <div className="hidden xl:flex bg-white rounded-md p-4 border flex-1 relative min-w-[300px]">
            <div className="flex flex-col gap-2 w-full">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="flex flex-col gap-2">
                <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-28 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-36 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Table Skeleton */}
      <div className="flex flex-col bg-white rounded-lg">
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-lg">
          <div className="flex justify-end gap-2 sm:w-auto ml-auto">
            <div className="h-9 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-9 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-9 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-9 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        <div className="border rounded-lg">
          <div className="border-b">
            <div className="h-12 flex items-center px-4">
              <div className="flex gap-4 w-full">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>

          {/* Table rows skeleton */}
          {Array.from({ length: 5 }, (_, rowIndex) => (
            <div key={`inventory-table-row-${rowIndex}`} className="border-b last:border-b-0">
              <div className="h-16 flex items-center px-4">
                <div className="flex gap-4 w-full">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
