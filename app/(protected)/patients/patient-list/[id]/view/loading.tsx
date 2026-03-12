import { ArrowLeft } from "lucide-react";

export default function PatientViewLoading() {
  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <div className="flex items-center gap-2">
        <ArrowLeft className="w-4 h-4 text-gray-300" />
        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Patient Header */}
      <div className="bg-white rounded-2xl border p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 space-y-3">
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
            <div className="h-5 w-24 bg-gray-200 rounded-full animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="h-3 w-12 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Demographics Card */}
        <div className="bg-white rounded-2xl border p-6 space-y-4">
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="space-y-3">
            {Array.from({ length: 5 }, (_, i) => `demo-${i}`).map(key => (
              <div key={key} className="space-y-1">
                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Latest Visit Card */}
        <div className="bg-white rounded-2xl border p-6 space-y-4">
          <div className="h-5 w-28 bg-gray-200 rounded animate-pulse" />
          <div className="space-y-3">
            {Array.from({ length: 6 }, (_, i) => `visit-${i}`).map(key => (
              <div key={key} className="space-y-1">
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Visit Summary Card */}
        <div className="bg-white rounded-2xl border p-6 space-y-4">
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="space-y-3">
            {Array.from({ length: 4 }, (_, i) => `summary-${i}`).map(key => (
              <div key={key} className="flex items-center justify-between">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 w-12 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Latest Visit Details Card */}
      <div className="bg-white rounded-2xl border p-6 space-y-4">
        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />

        {/* Diagnoses Section */}
        <div className="space-y-2">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 3 }, (_, i) => `diag-${i}`).map(key => (
              <div key={key} className="h-7 w-32 bg-gray-200 rounded-full animate-pulse" />
            ))}
          </div>
        </div>

        {/* Procedures Section */}
        <div className="space-y-2">
          <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 2 }, (_, i) => `proc-${i}`).map(key => (
              <div key={key} className="h-7 w-36 bg-gray-200 rounded-full animate-pulse" />
            ))}
          </div>
        </div>

        {/* Treatments Section */}
        <div className="space-y-2">
          <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 4 }, (_, i) => `treat-${i}`).map(key => (
              <div key={key} className="h-7 w-28 bg-gray-200 rounded-full animate-pulse" />
            ))}
          </div>
        </div>
      </div>

      {/* Visit History Card */}
      <div className="bg-white rounded-2xl border p-6 space-y-4">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="space-y-3">
          {Array.from({ length: 3 }, (_, i) => `history-${i}`).map(key => (
            <div key={key} className="border rounded-xl p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="h-5 w-20 bg-gray-200 rounded-full animate-pulse" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
