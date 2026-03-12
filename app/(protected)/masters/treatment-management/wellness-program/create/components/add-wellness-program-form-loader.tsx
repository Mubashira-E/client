import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function AddWellnessProgramFormLoader() {
  const renderField = (key: string | number, labelWidth = "w-32") => (
    <div key={key} className="space-y-2">
      <Skeleton className={`h-4 ${labelWidth}`} />
      <Skeleton className="h-10 w-full" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Wellness Program Information Card */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-4 w-80" />
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Code and Name */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {renderField("wellnessProgramCode", "w-48")}
            {renderField("wellnessProgramName", "w-48")}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Package & Treatment Selection Card */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-4 w-96" />
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Packages Multi-Select */}
          {renderField("packages", "w-56")}

          {/* Treatments Multi-Select */}
          {renderField("treatments", "w-64")}

          {/* Warning Note */}
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <Skeleton className="h-4 w-full" />
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Duration & Sessions Card */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-80" />
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Duration and Duration Unit */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {renderField("duration", "w-32")}
            {renderField("durationUnit", "w-32")}
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Pricing Card */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-80" />
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Price */}
          {renderField("price", "w-32")}
        </CardContent>
      </Card>

      <Separator />

      {/* Additional Information Card */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Notes */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4 pt-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-56" />
      </div>
    </div>
  );
}
