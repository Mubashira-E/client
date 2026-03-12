"use client";

import type { InventoryItem } from "@/types/inventory";
import { AlertTriangle, Calendar, MapPin, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockInventoryItems } from "@/lib/mock-inventory";

export function InventoryManagementCardContainer() {
  const inventoryItems = mockInventoryItems;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "border-green-200 bg-green-50";
      case "Low Stock":
        return "border-orange-200 bg-orange-50";
      case "Expiring Soon":
        return "border-yellow-200 bg-yellow-50";
      case "Expired":
        return "border-red-200 bg-red-50";
      case "Inactive":
        return "border-gray-200 bg-gray-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge variant="default" className="text-white bg-green-600">Active</Badge>;
      case "Low Stock":
        return <Badge variant="secondary" className="text-white bg-orange-600">Low Stock</Badge>;
      case "Expiring Soon":
        return <Badge variant="secondary" className="text-white bg-yellow-600">Expiring Soon</Badge>;
      case "Expired":
        return <Badge variant="destructive" className="text-white bg-red-600">Expired</Badge>;
      case "Inactive":
        return <Badge variant="secondary" className="text-white bg-gray-600">Inactive</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {inventoryItems.map((item: InventoryItem) => {
        const daysUntilExpiry = getDaysUntilExpiry(item.expiryDate);

        return (
          <Card key={item.id} className={`border-2 ${getStatusColor(item.status)} hover:shadow-md transition-shadow`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-sm font-semibold text-gray-900 line-clamp-2">
                    {item.itemName}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {item.itemCategory}
                    </Badge>
                    {getStatusBadge(item.status)}
                  </div>
                </div>
                {item.status === "Low Stock" && (
                  <AlertTriangle className="size-5 text-orange-500 flex-shrink-0" />
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Batch No:</span>
                  <span className="font-mono text-xs text-gray-900">{item.batchNo}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-semibold text-gray-900">
                    {item.quantity}
                    {item.unit}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="size-4 text-gray-400" />
                  <span className="text-gray-600">Expires:</span>
                  <span className={`text-sm font-medium ${
                    daysUntilExpiry < 0
                      ? "text-red-600"
                      : daysUntilExpiry <= 30
                        ? "text-orange-600"
                        : "text-gray-900"
                  }`}
                  >
                    {new Date(item.expiryDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Package className="size-4 text-gray-400" />
                  <span className="text-gray-600">Storage:</span>
                  <span className="text-sm text-gray-900 truncate">{item.storageCondition}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="size-4 text-gray-400" />
                  <span className="text-gray-600">Location:</span>
                  <span className="text-sm text-gray-900 truncate">{item.storageLocation}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Supplier:</span>
                  <span className="text-sm text-gray-900 truncate">{item.supplierName}</span>
                </div>

                {item.remarks && (
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-600 italic line-clamp-2">{item.remarks}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
