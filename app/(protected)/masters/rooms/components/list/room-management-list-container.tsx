"use client";

import { Bed, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetAllRoomsQuery } from "@/queries/masters/rooms/useGetAllRoomsQuery";

export function RoomManagementListContainer() {
  const router = useRouter();
  const { rooms, isLoading } = useGetAllRoomsQuery();

  const handleEdit = (roomId: string) => {
    router.push(`/masters/rooms/edit/${roomId}`);
  };

  const handleDelete = (roomId: string) => {
    void roomId;
    toast.success("Room deleted successfully");
  };

  return (
    <div className="space-y-4 p-4">
      {isLoading && (
        <div className="text-center py-8 text-muted-foreground">Loading...</div>
      )}
      {!isLoading && rooms.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">No rooms found</div>
      )}
      {!isLoading && rooms.length > 0 && (
        rooms.map(room => (
          <Card key={room.roomId}>
            <CardContent className="p-6 text-gray-800 py-0">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Bed className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">
                      {room.roomName}
                      {" - "}
                      {room.roomLocation}
                    </h3>
                    <Badge variant="outline">{room.roomType}</Badge>
                  </div>
                  <p className="text-sm text-gray-800 mb-3">{room.remarks || "No remarks"}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <Button variant="ghost" className="text-primary" size="sm" onClick={() => handleEdit(room.roomId)}>
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="ghost" className="text-red-700 hover:text-red-700" size="sm" onClick={() => handleDelete(room.roomId)}>
                    <Trash2 className="h-4 w-4 text-red-600" />
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
