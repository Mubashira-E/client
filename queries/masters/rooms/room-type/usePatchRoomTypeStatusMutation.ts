import { useMutation, useQueryClient } from "@tanstack/react-query";
import { roomEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export type PatchRoomTypeStatusRequest = {
  isActive: boolean;
};

export function usePatchRoomTypeStatusMutation(roomTypeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PatchRoomTypeStatusRequest) =>
      api.patch(`${roomEndpoints.patchRoomType}/${roomTypeId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [roomEndpoints.getRoomType] });
      queryClient.invalidateQueries({ queryKey: [roomEndpoints.getRoomTypeById, roomTypeId] });
    },
  });
}
