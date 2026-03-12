import { useMutation, useQueryClient } from "@tanstack/react-query";
import { roomEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export type PatchRoomStatusRequest = {
  isActive: boolean;
};

export function usePatchRoomStatusMutation(roomId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PatchRoomStatusRequest) =>
      api.patch(`${roomEndpoints.patchRoom}/${roomId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [roomEndpoints.getRoom] });
      queryClient.invalidateQueries({ queryKey: [roomEndpoints.getRoomById, roomId] });
    },
  });
}
