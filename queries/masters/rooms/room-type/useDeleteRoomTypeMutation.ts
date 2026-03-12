import { useMutation, useQueryClient } from "@tanstack/react-query";
import { roomEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export function useDeleteRoomTypeMutation(roomTypeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.delete(`${roomEndpoints.deleteRoomType}/${roomTypeId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [roomEndpoints.getRoomType],
      });
      queryClient.invalidateQueries({
        queryKey: [roomEndpoints.getRoomTypeById, roomTypeId],
      });
    },
  });
}
