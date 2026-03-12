export function SlotsSkeletonLoader() {
  return (
    <div className="space-y-6">
      {[1, 2].map(rotaIndex => (
        <div key={rotaIndex}>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[1, 2, 3].map(slotIndex => (
              <div
                key={slotIndex}
                className="border rounded-lg p-3"
              >
                <div className="flex items-center">
                  <div className="bg-gray-100 p-2 rounded-full mr-3">
                    <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
