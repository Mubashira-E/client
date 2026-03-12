"use client";

import { Clock, Edit, Package, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetAllPackageQuery } from "@/queries/masters/package-plans/useGetAllPackageQuery";

export function PackageManagementListCardContainer() {
  const router = useRouter();
  const [searchFilter] = useQueryState("searchFilter", parseAsString.withDefault(""));
  const [_currentPage] = useQueryState("currentPage", parseAsInteger.withDefault(1));

  const { packages, isPending } = useGetAllPackageQuery({
    PageSize: 100, // Show all for list view
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
    <div className="space-y-4 p-4">
      {packages.length === 0
        ? (
            <div className="text-center py-8 text-muted-foreground">
              No packages found
            </div>
          )
        : (
            packages.map((pkg: any) => (
              <Card key={pkg.packageId} className="p-0">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold">{pkg.packageName}</h3>
                        <Badge
                          variant={pkg.status === "Active" ? "default" : "secondary"}
                          className={pkg.status === "Active" ? "text-white" : "text-white bg-red-700"}
                        >
                          {pkg.status || "N/A"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-800 mb-3">{pkg.description || "No description"}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" className="text-primary" size="sm" onClick={() => handleEdit(pkg.packageId)}>
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </Button>
                      <Button variant="ghost" className="text-red-700 hover:text-red-700" size="sm" onClick={() => handleDelete(pkg.packageId)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                        <span>Delete</span>
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-800">Treatments:</span>
                      <div className="mt-1">
                        <span className="text-primary font-medium">
                          {pkg.packageTreatmentCount || 0}
                          {" "}
                          treatment
                          {(pkg.packageTreatmentCount || 0) !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="font-medium text-gray-800 flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Duration:
                      </span>
                      <div className="mt-1 text-primary font-medium">
                        {pkg.durationPerSession}
                        {" "}
                        {pkg.durationUnit || ""}
                      </div>
                    </div>

                    <div>
                      <span className="font-medium text-gray-800">Pricing:</span>
                      <div className="mt-1 space-y-1">
                        <div className="text-lg font-bold text-primary">
                          AED
                          {" "}
                          {(pkg.price || 0).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="font-medium text-gray-800">Details:</span>
                      <div className="mt-1 space-y-1 text-xs">
                        <div>
                          Total Duration:
                          {" "}
                          {pkg.totalDuration || 0}
                          {" "}
                          {pkg.durationUnit || ""}
                        </div>
                        <div>
                          Status:
                          {" "}
                          {pkg.status || "N/A"}
                        </div>
                        <div className="text-gray-800">
                          Package Code:
                          {" "}
                          {pkg.packageCode || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
    </div>
  );
}
