"use client";

import type { InventoryItem } from "@/types/inventory";
import { AlertTriangle, Calendar, Edit, MapPin, Package, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { mockInventoryItems } from "@/lib/mock-inventory";

export function InventoryManagementListCardContainer() {
  const inventoryItems = mockInventoryItems;

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
    <div className="space-y-4 p-4">
      {inventoryItems.map((item: InventoryItem) => {
        const daysUntilExpiry = getDaysUntilExpiry(item.expiryDate);

        return (
          <Card key={item.id} className="border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  {/* Header Row */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">{item.itemName}</h3>
                      <p className="text-sm text-gray-600 mt-1">{item.remarks || "No remarks"}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Badge variant="outline">{item.itemCategory}</Badge>
                      {getStatusBadge(item.status)}
                      {item.status === "Low Stock" && (
                        <AlertTriangle className="size-5 text-orange-500" />
                      )}
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Package className="size-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-600">Batch & Quantity</span>
                      </div>
                      <div className="ml-6 space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Batch:</span>
                          <span className="font-mono text-gray-900">{item.batchNo}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Quantity:</span>
                          <span className="font-semibold text-gray-900">
                            {item.quantity}
                            {item.unit}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-600">Dates</span>
                      </div>
                      <div className="ml-6 space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Manufacturing:</span>
                          <span className="text-gray-900">{new Date(item.manufacturingDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Expiry:</span>
                          <span className={`font-medium ${
                            daysUntilExpiry < 0
                              ? "text-red-600"
                              : daysUntilExpiry <= 30
                                ? "text-orange-600"
                                : "text-gray-900"
                          }`}
                          >
                            {new Date(item.expiryDate).toLocaleDateString()}
                            {daysUntilExpiry < 0 && " (Expired)"}
                            {daysUntilExpiry >= 0 && daysUntilExpiry <= 30 && ` (${daysUntilExpiry} days left)`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="size-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-600">Storage & Supplier</span>
                      </div>
                      <div className="ml-6 space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Condition:</span>
                          <span className="text-gray-900">{item.storageCondition}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Location:</span>
                          <span className="text-gray-900">{item.storageLocation}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Supplier:</span>
                          <span className="text-gray-900">{item.supplierName}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 ml-4">
                  <Button variant="outline" size="sm">
                    <Edit className="size-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="size-4 mr-2 text-red-600" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
