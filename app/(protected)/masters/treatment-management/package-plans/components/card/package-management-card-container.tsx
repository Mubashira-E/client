"use client";

import { Clock, Edit, Package, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetAllPackageQuery } from "@/queries/masters/package-plans/useGetAllPackageQuery";

export function PackageManagementCardContainer() {
  const router = useRouter();
  const [searchFilter] = useQueryState("searchFilter", parseAsString.withDefault(""));
  const [_currentPage] = useQueryState("currentPage", parseAsInteger.withDefault(1));

  const { packages, isPending } = useGetAllPackageQuery({
    PageSize: 100, // Show all for card view
    PageNumber: _currentPage,
    SearchTerms: searchFilter,
    SortOrderBy: true,
  });

  const handleEdit = (packageId: string) => {
    router.push(`/masters/treatment-management/package-plans/edit/${packageId}`);
  };

  const handleDelete = (packageId: string) => {
    void packageId; // Acknowledge parameter usage
  };

  if (isPending) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading packages...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {packages.length === 0
        ? (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No packages found
            </div>
          )
        : (
            packages.map((pkg: any) => (
              <Card key={pkg.packageId} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" />
                        {pkg.packageName}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 text-gray-800">{pkg.description || "No description"}</CardDescription>
                    </div>
                    <Badge
                      variant={pkg.status === "Active" ? "default" : "secondary"}
                      className={pkg.status === "Active" ? "text-white" : "text-white bg-red-700"}
                    >
                      {pkg.status || "N/A"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 text-gray-800">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Treatments:</span>
                      <span className="font-medium">
                        {pkg.packageTreatmentCount || 0}
                        {" "}
                        treatment
                        {(pkg.packageTreatmentCount || 0) !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Package Code:
                      {" "}
                      {pkg.packageCode || "N/A"}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Duration:
                    </span>
                    <span className="font-medium">
                      {pkg.durationPerSession}
                      {" "}
                      {pkg.durationUnit || ""}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-lg font-bold text-primary">
                      AED
                      {" "}
                      {(pkg.price || 0).toFixed(2)}
                    </div>
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-800">Total Duration:</span>
                      <span>
                        {pkg.totalDuration || 0}
                        {" "}
                        {pkg.durationUnit || ""}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-800">Status:</span>
                      <span>
                        {pkg.status || "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 mt-auto">
                    <Button variant="ghost" size="sm" className="text-primary" onClick={() => handleEdit(pkg.packageId)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-700 hover:text-red-700" onClick={() => handleDelete(pkg.packageId)}>
                      <Trash2 className="h-4 w-4 mr-2 text-red-600" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
    </div>
  );
}
