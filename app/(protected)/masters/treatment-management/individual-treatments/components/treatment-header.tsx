import { Heart, Stethoscope } from "lucide-react";

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

export function TreatmentHeader() {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex gap-4 w-full overflow-x-auto">
        <div className="hidden lg:flex bg-white rounded-md p-4 border flex-1 relative min-w-[300px]">
          <Stethoscope className="absolute top-6 right-8 size-14 text-blue-800 opacity-50" strokeWidth={1} />

          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-medium text-gray-800">Treatment Statistics</h2>

            <div className="flex gap-6">
              <StatItem
                colorClass="text-primary"
                label="Total Treatments"
                value={45}
              />

              <Divider />

              <StatItem
                colorClass="text-green-600"
                label="Active Categories"
                value={8}
              />
            </div>
          </div>
        </div>

        <div className="hidden xl:flex bg-white rounded-md p-4 border flex-1 relative min-w-[300px]">
          <Heart className="absolute top-6 right-8 size-14 text-red-600 opacity-50" strokeWidth={1} />
          <div className="flex flex-col gap-2 w-full">
            <h2 className="text-sm font-medium text-gray-800">Recently Added Treatment</h2>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <p className="text-xs font-medium text-gray-800">Treatment Name</p>
                <p className="text-xs text-gray-600">Panchakarma Therapy</p>
              </div>

              <div className="flex items-center gap-2">
                <p className="text-xs font-medium text-gray-800">Category</p>
                <p className="text-xs text-gray-600">Detoxification</p>
              </div>

              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-medium text-gray-800">Duration</p>
                  <p className="text-xs text-gray-600">90 minutes</p>
                </div>

                <div className="text-xs text-gray-600">
                  Created 2 days ago
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
