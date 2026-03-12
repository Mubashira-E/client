"use client";

import type { Treatment } from "../data";
import { Clock, Edit, Heart, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockTreatments } from "../data";

export function TreatmentManagementListCardContainer() {
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
        return <Heart className="h-5 w-5 text-red-500" />;
      default:
        return <Heart className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-3 p-4">
      {mockTreatments.map(treatment => (
        <div
          key={treatment.id}
          className="flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4 flex-1">
            <div className="flex-shrink-0">
              {getCategoryIcon(treatment.category)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-gray-900 truncate">
                  {treatment.treatmentName}
                </h3>
                <Badge variant={treatment.status === "Active" ? "default" : "destructive"}>
                  {treatment.status}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {treatment.category}
                </Badge>
              </div>

              <p className="text-sm text-gray-800 line-clamp-1 mb-2">
                {treatment.description}
              </p>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-gray-800" />
                  <span className="text-gray-600">{treatment.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-green-800">{treatment.price}</span>
                </div>
                <span className="text-gray-800">
                  Created:
                  {" "}
                  {new Date(treatment.createdDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4">
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
      ))}
    </div>
  );
}
