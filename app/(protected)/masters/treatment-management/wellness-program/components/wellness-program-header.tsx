"use client";

import { Heart, Sparkles } from "lucide-react";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { useGetAllWellnessProgramQuery } from "@/queries/masters/wellness-program/useGetAllWellnessProgramQuery";

function StatItem({
  value,
  label,
  colorClass,
}: {
  value: number;
  label: string;
  colorClass: string;
}) {
  return (
    <div className="flex flex-col">
      <p className="text-3xl font-bold text-gray-800">{value}</p>
      <p className={cn("text-xs uppercase", colorClass)}>{label}</p>
    </div>
  );
}

function Divider() {
  return <div className="w-px h-full bg-gray-200" />;
}

export function WellnessProgramHeader() {
  const { wellnessPrograms, totalItems, isPending }
    = useGetAllWellnessProgramQuery({
      pageNumber: 1,
      pageSize: 100,
    });

  const stats = useMemo(() => {
    if (isPending) {
      return {
        total: 0,
        active: 0,
        featured: null as { name: string; code: string; price: number; duration: string } | null,
      };
    }

    const active = wellnessPrograms.filter(wp => wp.status === "Active").length;
    const featured = wellnessPrograms.length > 0
      ? {
          name: wellnessPrograms[0].wellnessProgramName,
          code: wellnessPrograms[0].wellnessProgramCode,
          price: wellnessPrograms[0].price,
          duration: wellnessPrograms[0].duration && wellnessPrograms[0].durationUnit
            ? `${wellnessPrograms[0].duration} ${wellnessPrograms[0].durationUnit}`
            : "N/A",
        }
      : null;

    return {
      total: totalItems || wellnessPrograms.length,
      active,
      featured,
    };
  }, [isPending, wellnessPrograms, totalItems]);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col">
        <h1 className="text-xl font-medium text-gray-800">Wellness Program Management</h1>
        <p className="text-sm text-gray-600 -mt-1">Create and manage comprehensive wellness programs combining packages and treatments</p>
      </div>

      <div className="flex gap-4 w-full overflow-x-auto">
        <div className="hidden lg:flex bg-white rounded-md p-4 border flex-1 relative min-w-[300px]">
          <Heart className="absolute top-6 right-8 size-14 text-pink-600 opacity-50" strokeWidth={1} />

          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-medium text-gray-800">Program Statistics</h2>

            {isPending
              ? (
                  <div className="flex gap-6">
                    <div className="flex flex-col gap-2">
                      <div className="h-8 w-16 rounded-md bg-gray-200 animate-pulse" />
                      <div className="h-3 w-24 rounded-md bg-gray-200 animate-pulse" />
                    </div>
                    <Divider />
                    <div className="flex flex-col gap-2">
                      <div className="h-8 w-16 rounded-md bg-gray-200 animate-pulse" />
                      <div className="h-3 w-24 rounded-md bg-gray-200 animate-pulse" />
                    </div>
                  </div>
                )
              : (
                  <div className="flex gap-6">
                    <StatItem
                      colorClass="text-primary"
                      label="Total Programs"
                      value={stats.total}
                    />

                    <Divider />

                    <StatItem
                      colorClass="text-green-600"
                      label="Active Programs"
                      value={stats.active}
                    />
                  </div>
                )}
          </div>
        </div>

        <div className="hidden xl:flex bg-white rounded-md p-4 border flex-1 relative min-w-[300px]">
          <Sparkles className="absolute top-6 right-8 size-14 text-purple-600 opacity-50" strokeWidth={1} />
          <div className="flex flex-col gap-2 w-full">
            <h2 className="text-sm font-medium text-gray-800">Featured Program</h2>

            {isPending && (
              <div className="flex flex-col gap-2">
                <div className="h-5 w-48 rounded-md bg-gray-200 animate-pulse" />
                <div className="h-5 w-40 rounded-md bg-gray-200 animate-pulse" />
                <div className="h-5 w-32 rounded-md bg-gray-200 animate-pulse" />
              </div>
            )}

            {!isPending && !stats.featured && (
              <p className="text-xs text-gray-500 italic">No wellness programs configured yet</p>
            )}

            {!isPending && stats.featured && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-medium text-gray-800">Program Name</p>
                  <p className="text-xs text-gray-600">{stats.featured.name}</p>
                </div>

                <div className="flex items-center gap-2">
                  <p className="text-xs font-medium text-gray-800">Code</p>
                  <p className="text-xs text-gray-600">{stats.featured.code}</p>
                </div>

                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium text-gray-800">Duration</p>
                    <p className="text-xs text-blue-600">{stats.featured.duration}</p>
                  </div>

                  <div className="text-xs text-gray-600">
                    AED
                    {" "}
                    {stats.featured.price.toLocaleString()}
                    {" "}
                    total price
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
