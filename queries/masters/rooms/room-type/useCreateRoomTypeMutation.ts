import type { RoomType } from "./useGetAllRoomTypeQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { roomEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export const createRoomTypeSchema = z.object({
  typeName: z.string().trim().min(1, { message: "Type Name is required" }),
  description: z.string().trim().optional().default(""),
});

export type CreateRoomTypeRequest = z.infer<typeof createRoomTypeSchema>;

export function useCreateRoomTypeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRoomTypeRequest) => api.post<RoomType>(roomEndpoints.createRoomType, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [roomEndpoints.getRoomType] });
    },
  });
}
