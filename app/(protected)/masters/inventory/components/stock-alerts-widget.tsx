"use client";

import { AlertTriangle, Clock, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockStockAlerts } from "@/lib/mock-inventory";

export function StockAlertsWidget() {
  const stockAlerts = mockStockAlerts;

  const getAlertIcon = (alertType: string) => {
    switch (alertType) {
      case "Low Stock":
        return <AlertTriangle className="size-4 text-orange-500" />;
      case "Expiring Soon":
        return <Clock className="size-4 text-yellow-500" />;
      case "Expired":
        return <XCircle className="size-4 text-red-500" />;
      default:
        return <AlertTriangle className="size-4 text-gray-500" />;
    }
  };

  const getAlertBadge = (severity: string) => {
    switch (severity) {
      case "High":
        return <Badge variant="destructive" className="text-xs">High</Badge>;
      case "Medium":
        return <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">Medium</Badge>;
      case "Low":
        return <Badge variant="outline" className="text-xs">Low</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">Low</Badge>;
    }
  };

  const getDaysAgo = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (stockAlerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-green-600" />
            Stock Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="text-green-600 font-semibold">All Good!</div>
            <div className="text-sm text-gray-600">No stock alerts at this time</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="size-5 text-orange-600" />
          Stock Alerts (
          {stockAlerts.length}
          )
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {stockAlerts.map(alert => (
            <div key={alert.id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
              <div className="flex-shrink-0 mt-0.5">
                {getAlertIcon(alert.alertType)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900 text-sm">{alert.itemName}</span>
                      {getAlertBadge(alert.severity)}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{alert.alertType}</span>
                      <span>•</span>
                      <span>
                        {getDaysAgo(alert.createdAt)}
                        {" days ago"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {stockAlerts.length > 3 && (
          <div className="mt-4 pt-3 border-t">
            <div className="text-center">
              <button type="button" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                View All Alerts (
                {stockAlerts.length}
                )
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
