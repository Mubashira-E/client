import { Bed, Building } from "lucide-react";

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

export function RoomHeader() {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col">
        <h1 className="text-xl font-medium text-gray-800">Room Management</h1>
        <p className="text-sm text-gray-600 -mt-1">Manage treatment rooms, their configurations, and availability</p>
      </div>

      <div className="flex gap-4 w-full overflow-x-auto">
        <div className="hidden lg:flex bg-white rounded-md p-4 border flex-1 relative min-w-[300px]">
          <Bed className="absolute top-6 right-8 size-14 text-blue-800 opacity-50" strokeWidth={1} />

          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-medium text-gray-800">Room Statistics</h2>

            <div className="flex gap-6">
              <StatItem
                colorClass="text-primary"
                label="Total Rooms"
                value={18}
              />

              <Divider />

              <StatItem
                colorClass="text-green-600"
                label="Available"
                value={12}
              />

              <Divider />

              <StatItem
                colorClass="text-red-600"
                label="Occupied"
                value={4}
              />
            </div>
          </div>
        </div>

        <div className="hidden xl:flex bg-white rounded-md p-4 border flex-1 relative min-w-[300px]">
          <Building className="absolute top-6 right-8 size-14 text-purple-600 opacity-50" strokeWidth={1} />
          <div className="flex flex-col gap-2 w-full">
            <h2 className="text-sm font-medium text-gray-800">Current Occupancy</h2>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <p className="text-xs font-medium text-gray-800">Room Number</p>
                <p className="text-xs text-gray-600">101 - Panchakarma Suite</p>
              </div>

              <div className="flex items-center gap-2">
                <p className="text-xs font-medium text-gray-800">Patient</p>
                <p className="text-xs text-gray-600">John Doe</p>
              </div>

              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-medium text-gray-800">Treatment</p>
                  <p className="text-xs text-gray-600">Panchakarma Detox</p>
                </div>

                <div className="text-xs text-gray-600">
                  Next available: 2:30 PM
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
