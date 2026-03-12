import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function AddTreatmentFormLoader() {
  const renderField = (key: string | number, width = "w-full") => (
    <div key={key} className="space-y-2">
      <Skeleton className="h-4 w-32" />
      <Skeleton className={`h-10 ${width}`} />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Treatment Information Card */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-80" />
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Code and Name */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {renderField("code")}
            {renderField("name")}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-24 w-full" />
          </div>

          {/* Price */}
          <div className="grid grid-cols-1 gap-4">
            {renderField("price")}
          </div>

          {/* Duration and Duration Unit */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {renderField("duration")}
            {renderField("durationUnit")}
          </div>

          {/* Inventory Items */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4 pt-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-40" />
      </div>
    </div>
  );
}
