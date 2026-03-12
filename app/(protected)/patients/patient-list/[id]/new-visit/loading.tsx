import { ArrowLeft } from "lucide-react";

export default function NewVisitLoading() {
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
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-80 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Form Fields */}
        <div className="space-y-6 pt-4 border-t">
          {/* Row 1 - 2 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 w-full bg-gray-200 rounded-xl animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 w-full bg-gray-200 rounded-xl animate-pulse" />
            </div>
          </div>

          {/* Row 2 - 2 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 w-full bg-gray-200 rounded-xl animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 w-full bg-gray-200 rounded-xl animate-pulse" />
            </div>
          </div>

          {/* Row 3 - Full width */}
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-full bg-gray-200 rounded-xl animate-pulse" />
          </div>

          {/* Row 4 - 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 w-full bg-gray-200 rounded-xl animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 w-full bg-gray-200 rounded-xl animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 w-full bg-gray-200 rounded-xl animate-pulse" />
            </div>
          </div>

          {/* Row 5 - Textarea */}
          <div className="space-y-2">
            <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
            <div className="h-24 w-full bg-gray-200 rounded-xl animate-pulse" />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4 border-t">
            <div className="h-10 w-32 bg-gray-200 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
