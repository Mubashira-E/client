import { Skeleton } from "@/components/ui/skeleton";
import { AddPackageFormLoader } from "./components/add-package-form-loader";

export default function PackagePlanCreateLoading() {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2 text-primary">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-44" />
      </div>
      <section className="flex flex-col gap-4 rounded-md border bg-white px-4 py-6">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-80" />
        </div>
        <AddPackageFormLoader />
      </section>
    </section>
  );
}
