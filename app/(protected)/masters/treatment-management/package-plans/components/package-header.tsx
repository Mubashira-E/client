import { Gift, Package } from "lucide-react";

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
      <p className={`text-xs ${colorClass} uppercase`}>{label}</p>
    </div>
  );
}

function Divider() {
  return <div className="w-px h-full bg-gray-200" />;
}

export function PackageHeader() {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col">
        <h1 className="text-xl font-medium text-gray-800">Package Management</h1>
        <p className="text-sm text-gray-600 -mt-1">Create and manage treatment packages with special pricing and discounts</p>
      </div>

      <div className="flex gap-4 w-full overflow-x-auto">
        <div className="hidden lg:flex bg-white rounded-md p-4 border flex-1 relative min-w-[300px]">
          <Package className="absolute top-6 right-8 size-14 text-blue-800 opacity-50" strokeWidth={1} />

          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-medium text-gray-800">Package Statistics</h2>

            <div className="flex gap-6">
              <StatItem
                colorClass="text-primary"
                label="Total Packages"
                value={12}
              />

              <Divider />

              <StatItem
                colorClass="text-green-600"
                label="Active Packages"
                value={9}
              />
            </div>
          </div>
        </div>

        <div className="hidden xl:flex bg-white rounded-md p-4 border flex-1 relative min-w-[300px]">
          <Gift className="absolute top-6 right-8 size-14 text-purple-600 opacity-50" strokeWidth={1} />
          <div className="flex flex-col gap-2 w-full">
            <h2 className="text-sm font-medium text-gray-800">Popular Package</h2>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <p className="text-xs font-medium text-gray-800">Package Name</p>
                <p className="text-xs text-gray-600">Complete Wellness Package</p>
              </div>

              <div className="flex items-center gap-2">
                <p className="text-xs font-medium text-gray-800">Bookings</p>
                <p className="text-xs text-gray-600">12 / 50</p>
              </div>

              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-medium text-gray-800">Discount</p>
                  <p className="text-xs text-green-600">20% off</p>
                </div>

                <div className="text-xs text-gray-600">
                  ₹12,720 final price
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
