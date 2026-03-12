import { ArrowLeft } from "lucide-react";

export default function VisitViewLoading() {
  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <div className="flex items-center gap-2">
        <ArrowLeft className="w-4 h-4 text-gray-300" />
        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl border p-6 space-y-6">
        {/* Visit Header */}
        <div className="flex items-start justify-between pb-4 border-b">
          <div className="space-y-2">
            <div className="h-7 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse" />
        </div>

        {/* Visit Info Grid */}
        {/* eslint-disable react/no-array-index-key */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={`info-${i}`} className="space-y-1">
              <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
          {[
            { label: "Diagnoses", count: 2 },
            { label: "Procedures", count: 3 },
            { label: "Treatments", count: 4 },
          ].map(stat => (
            <div key={stat.label} className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 w-12 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Diagnoses Section */}
        <div className="space-y-3 pt-4 border-t">
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="space-y-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={`diag-card-${i}`} className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
                <div className="flex flex-wrap gap-2 mt-2">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={`diag-badge-${j}`} className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* eslint-enable react/no-array-index-key */}

        {/* Procedures Section */}
        {/* eslint-disable react/no-array-index-key */}
        <div className="space-y-3 pt-4 border-t">
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="space-y-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={`proc-card-${i}`} className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="h-4 w-56 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
                <div className="flex flex-wrap gap-2 mt-2">
                  {Array.from({ length: 2 }).map((_, j) => (
                    <div key={`proc-badge-${j}`} className="h-6 w-24 bg-gray-200 rounded-full animate-pulse" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Treatments Section */}
        <div className="space-y-3 pt-4 border-t">
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={`treat-card-${i}`} className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
                <div className="flex flex-wrap gap-2 mt-2">
                  {Array.from({ length: 2 }).map((_, j) => (
                    <div key={`treat-badge-${j}`} className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Billing Section */}
        <div className="space-y-3 pt-4 border-t">
          <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="space-y-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={`bill-card-${i}`} className="border rounded-xl p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* eslint-enable react/no-array-index-key */}
      </div>
    </div>
  );
}
