import type { RoomType } from "./useGetAllRoomTypeQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { roomEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export const updateRoomTypeSchema = z.object({
  typeName: z.string().trim().min(1, { message: "Type Name is required" }),
  description: z.string().trim().optional().default(""),
});

export type UpdateRoomTypeRequest = z.infer<typeof updateRoomTypeSchema>;

export function useUpdateRoomTypeMutation(roomTypeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateRoomTypeRequest) =>
      api.put<RoomType>(`${roomEndpoints.updateRoomType}/${roomTypeId}`, { ...data }, { params: { id: roomTypeId } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [roomEndpoints.getRoomType] });
    },
  });
}
