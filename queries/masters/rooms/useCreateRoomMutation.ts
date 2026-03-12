import type { Room } from "./useGetAllRoomsQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { roomEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export const createRoomSchema = z.object({
  roomName: z.string().trim().min(1, { message: "Room Name is required" }),
  roomTypeId: z.string().optional().default(""),
  roomLocation: z.string().trim().optional().default(""),
  remarks: z.string().trim().optional().default(""),
});

export type CreateRoomRequest = z.infer<typeof createRoomSchema>;

export function useCreateRoomMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRoomRequest) => api.post<Room>(roomEndpoints.createRoom, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [roomEndpoints.getRoom] });
    },
  });
}
