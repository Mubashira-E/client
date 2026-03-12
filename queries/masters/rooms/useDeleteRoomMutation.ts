import { useMutation, useQueryClient } from "@tanstack/react-query";
import { roomEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export function useDeleteRoomMutation(roomId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.delete(`${roomEndpoints.deleteRoom}/${roomId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [roomEndpoints.getRoom],
      });
      queryClient.invalidateQueries({
        queryKey: [roomEndpoints.getRoomById, roomId],
      });
    },
  });
}
