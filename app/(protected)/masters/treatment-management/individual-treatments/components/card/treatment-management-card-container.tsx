"use client";

import type { Treatment } from "../data";
import { Clock, Edit, Heart, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { mockTreatments } from "../data";

export function TreatmentManagementCardContainer() {
  const handleEdit = (treatment: Treatment) => {
    void treatment; // Acknowledge parameter usage
  };

  const handleDelete = (treatment: Treatment) => {
    void treatment; // Acknowledge parameter usage
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "detoxification":
      case "panchakarma":
        return <Heart className="h-4 w-4 text-red-500" />;
      default:
        return <Heart className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {mockTreatments.map(treatment => (
        <Card key={treatment.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {getCategoryIcon(treatment.category)}
                <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                  {treatment.treatmentName}
                </h3>
              </div>
              <Badge
                variant={treatment.status === "Active" ? "default" : "secondary"}
                className={treatment.status === "Active" ? "text-white" : "text-white bg-red-700"}
              >
                {treatment.status}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-sm text-gray-800 line-clamp-2">
              {treatment.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-gray-800" />
                  <span className="text-sm text-gray-800">{treatment.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold text-green-800">{treatment.price}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <Badge variant="secondary" className="text-xs text-gray-800">
                {treatment.category}
              </Badge>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(treatment)}
                  className="h-8 px-2 gap-1 text-primary"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(treatment)}
                  className="h-8 px-2 gap-1 text-red-800 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                  <span>Delete</span>
                </Button>
              </div>
            </div>

            <div className="text-xs text-gray-800">
              Created:
              {" "}
              {new Date(treatment.createdDate).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
