import { BadgePercent, LayoutGrid } from "lucide-react";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { useGetAllItemCategoryQuery } from "@/queries/masters/inventory/item-category/useGetAllItemCategoryQuery";

function StatBlock({
  label,
  value,
  colorClass,
}: {
  label: string;
  value: number;
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

export function InventoryCategoryHeader() {
  const { itemCategories = [], isPending } = useGetAllItemCategoryQuery();

  const stats = useMemo(() => {
    if (isPending) {
      return {
        total: 0,
        withDescription: 0,
        withoutDescription: 0,
        highlightedCategories: [] as string[],
      };
    }

    const withDescription = itemCategories.filter((ic: any) => ic.description?.trim()).length;
    const withoutDescription = itemCategories.length - withDescription;
    const highlightedCategories = itemCategories
      .slice(0, 3)
      .map((ic: any) => ic.categoryName);

    return {
      total: itemCategories.length,
      withDescription,
      withoutDescription,
      highlightedCategories,
    };
  }, [isPending, itemCategories]);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col">
        <h1 className="text-xl font-medium text-gray-800">Inventory Category Directory</h1>
        <p className="text-sm text-gray-600 -mt-1">
          Maintain the catalogue of inventory categories available across the facility
        </p>
      </div>

      <div className="flex gap-4 w-full overflow-x-auto">
        <div className="hidden lg:flex bg-white rounded-md p-4 border flex-1 relative min-w-[280px]">
          <LayoutGrid className="absolute top-6 right-8 size-14 text-blue-800 opacity-40" strokeWidth={1} />

          <div className="flex flex-col gap-2 w-full">
            <h2 className="text-sm font-medium text-gray-800">Catalogue Overview</h2>

            {isPending
              ? (
                  <div className="flex gap-6">
                    <div className="flex flex-col gap-2">
                      <div className="h-8 w-16 rounded-md bg-gray-200 animate-pulse" />
                      <div className="h-3 w-20 rounded-md bg-gray-200 animate-pulse" />
                    </div>
                    <Divider />
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
                    <StatBlock label="Total Categories" value={stats.total} colorClass="text-primary" />
                    <Divider />
                    <StatBlock label="With Details" value={stats.withDescription} colorClass="text-green-600" />
                    <Divider />
                    <StatBlock label="Missing Details" value={stats.withoutDescription} colorClass="text-orange-500" />
                  </div>
                )}
          </div>
        </div>

        <div className="hidden xl:flex bg-white rounded-md p-4 border flex-1 relative min-w-[280px]">
          <BadgePercent className="absolute top-6 right-8 size-14 text-purple-600 opacity-40" strokeWidth={1} />
          <div className="flex flex-col gap-2 w-full">
            <h2 className="text-sm font-medium text-gray-800">Highlighted Categories</h2>
            <p className="text-xs text-gray-600">Recently used or commonly referenced inventory classifications</p>

            <div className="flex flex-col gap-2">
              {isPending && (
                <>
                  <div className="h-7 w-48 rounded-md bg-gray-200 animate-pulse" />
                  <div className="h-7 w-40 rounded-md bg-gray-200 animate-pulse" />
                  <div className="h-7 w-32 rounded-md bg-gray-200 animate-pulse" />
                </>
              )}

              {!isPending && stats.highlightedCategories.length === 0 && (
                <p className="text-xs text-gray-500 italic">No categories available yet</p>
              )}

              {!isPending && stats.highlightedCategories.length > 0 && (
                stats.highlightedCategories.map((categoryName: string) => (
                  <div key={categoryName} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700 font-medium">{categoryName}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
