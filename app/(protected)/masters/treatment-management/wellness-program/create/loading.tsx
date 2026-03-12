import { Skeleton } from "@/components/ui/skeleton";
import { AddWellnessProgramFormLoader } from "./components/add-wellness-program-form-loader";

export default function WellnessProgramCreateLoading() {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2 text-primary">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-48" />
      </div>
      <section className="flex flex-col gap-4 rounded-md border bg-white px-4 py-6">
        <div className="space-y-2">
          <Skeleton className="h-6 w-60" />
          <Skeleton className="h-4 w-96" />
        </div>
        <AddWellnessProgramFormLoader />
      </section>
    </section>
  );
}
