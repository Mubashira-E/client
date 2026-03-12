import type { Room } from "./useGetAllRoomsQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { roomEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export const updateRoomSchema = z.object({
  roomName: z.string().trim().min(1, { message: "Room Name is required" }),
  roomTypeId: z.string().uuid({ message: "Room Type is required" }),
  roomLocation: z.string().trim().optional().default(""),
  remarks: z.string().trim().optional().default(""),
});

export type UpdateRoomRequest = z.infer<typeof updateRoomSchema>;

export function useUpdateRoomMutation(roomId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateRoomRequest) => api.put<Room>(`${roomEndpoints.updateRoom}/${roomId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [roomEndpoints.getRoom] });
      queryClient.invalidateQueries({ queryKey: [roomEndpoints.getRoomById, roomId] });
    },
  });
}
