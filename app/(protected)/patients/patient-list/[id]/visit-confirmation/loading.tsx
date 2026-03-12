import { ArrowLeft } from "lucide-react";

export default function VisitConfirmationLoading() {
  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <div className="flex items-center gap-2">
        <ArrowLeft className="w-4 h-4 text-gray-300" />
        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl border p-6 space-y-6">
        {/* Page Header */}
        <div className="space-y-2">
          <div className="h-6 w-56 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Confirmation Content */}
        <div className="space-y-6 pt-4 border-t">
          {/* Info Section */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="h-3 w-28 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-4">
            <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
            <div className="space-y-3">
              {/* eslint-disable react/no-array-index-key */}
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={`detail-${i}`} className="border rounded-xl p-4 space-y-2">
                  <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {Array.from({ length: 2 }).map((_, j) => (
                      <div key={`badge-${j}`} className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
                    ))}
                  </div>
                </div>
              ))}
              {/* eslint-enable react/no-array-index-key */}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <div className="h-10 w-24 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-10 w-32 bg-gray-200 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
