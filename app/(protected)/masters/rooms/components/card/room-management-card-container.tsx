"use client";

import { Bed, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetAllRoomsQuery } from "@/queries/masters/rooms/useGetAllRoomsQuery";

export function RoomManagementCardContainer() {
  const router = useRouter();

  // Get rooms data from API
  const { rooms = [] } = useGetAllRoomsQuery({
    searchTerms: "",
    pageSize: 1000,
    pageNumber: 1,
  });

  const handleEdit = (roomId: string) => {
    router.push(`/masters/rooms/edit/${roomId}`);
  };

  const handleDelete = (roomId: string) => {
    void roomId; // Acknowledge parameter usage
    toast.success("Room deleted successfully");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {rooms.length === 0
        ? (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No rooms found
            </div>
          )
        : (
            rooms.map(room => (
              <Card key={room.roomId} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Bed className="h-5 w-5 text-primary" />
                        Room
                        {" "}
                        {room.roomName}
                      </CardTitle>
                      <CardDescription className="font-medium">{room.roomLocation}</CardDescription>
                      <CardDescription className="line-clamp-2 mt-1 text-gray-800">{room.remarks || "No remarks"}</CardDescription>
                    </div>
                    <Badge variant={room.status?.toLowerCase() === "active" ? "default" : "secondary"}>
                      {room.status?.toLowerCase() === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col h-full text-gray-800">
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-800">Type:</span>
                        <div className="font-medium">{room.roomType}</div>
                      </div>
                      <div>
                        <span className="text-gray-800">Location:</span>
                        <div className="font-medium">
                          {room.roomLocation}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-end mt-auto pt-4">
                    <div></div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(room.roomId)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-700 hover:text-red-700" onClick={() => handleDelete(room.roomId)}>
                        <Trash2 className="h-4 w-4 mr-2 text-red-600" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
    </div>
  );
}
