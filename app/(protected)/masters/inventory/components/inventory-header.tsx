import { AlertTriangle, Package, TrendingUp } from "lucide-react";

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

export function InventoryHeader() {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col">
        <h1 className="text-xl font-medium text-gray-800">Inventory Management</h1>
        <p className="text-sm text-gray-600 -mt-1">Track and manage treatment items, oils, equipment, and consumables</p>
      </div>

      <div className="flex gap-4 w-full overflow-x-auto">
        <div className="hidden lg:flex bg-white rounded-md p-4 border flex-1 relative min-w-[300px]">
          <Package className="absolute top-6 right-8 size-14 text-blue-800 opacity-50" strokeWidth={1} />

          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-medium text-gray-800">Inventory Statistics</h2>

            <div className="flex gap-6">
              <StatItem
                colorClass="text-primary"
                label="Total Items"
                value={127}
              />

              <Divider />

              <StatItem
                colorClass="text-green-600"
                label="Active Items"
                value={98}
              />
            </div>
          </div>
        </div>

        <div className="hidden xl:flex bg-white rounded-md p-4 border flex-1 relative min-w-[300px]">
          <AlertTriangle className="absolute top-6 right-8 size-14 text-orange-600 opacity-50" strokeWidth={1} />
          <div className="flex flex-col gap-2 w-full">
            <h2 className="text-sm font-medium text-gray-800">Stock Alerts</h2>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <p className="text-xs font-medium text-gray-800">Low Stock Items</p>
                <p className="text-xs text-orange-600 font-semibold">3 items</p>
              </div>

              <div className="flex items-center gap-2">
                <p className="text-xs font-medium text-gray-800">Expiring Soon</p>
                <p className="text-xs text-red-600 font-semibold">1 item</p>
              </div>

              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-medium text-gray-800">Expired Items</p>
                  <p className="text-xs text-red-600 font-semibold">1 item</p>
                </div>

                <div className="text-xs text-gray-600">
                  Last updated 2 hours ago
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden 2xl:flex bg-white rounded-md p-4 border flex-1 relative min-w-[300px]">
          <TrendingUp className="absolute top-6 right-8 size-14 text-green-600 opacity-50" strokeWidth={1} />
          <div className="flex flex-col gap-2 w-full">
            <h2 className="text-sm font-medium text-gray-800">Recent Activity</h2>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <p className="text-xs font-medium text-gray-800">Recently Added</p>
                <p className="text-xs text-gray-600">Ashwagandha Powder</p>
              </div>

              <div className="flex items-center gap-2">
                <p className="text-xs font-medium text-gray-800">Last Restock</p>
                <p className="text-xs text-gray-600">Coconut Oil - 5 lit</p>
              </div>

              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-medium text-gray-800">Next Expiry</p>
                  <p className="text-xs text-gray-600">Ghee - 15 days</p>
                </div>

                <div className="text-xs text-gray-600">
                  Updated 1 hour ago
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Alerts Widget
      <div className="mt-4">
        <StockAlertsWidget />
      </div> */}
    </section>
  );
}
