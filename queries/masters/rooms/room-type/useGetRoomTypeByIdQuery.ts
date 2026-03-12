import type { RoomType } from "./useGetAllRoomTypeQuery";
import { useQuery } from "@tanstack/react-query";
import { roomEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export function useGetRoomTypeByIdQuery(roomTypeId: string) {
  return useQuery({
    queryKey: [roomEndpoints.getRoomType, roomTypeId],
    queryFn: async () => {
      const response = await api.get<RoomType>(`${roomEndpoints.getRoomType}/${roomTypeId}`, {
        params: { id: roomTypeId },
      });
      return response.data;
    },
    enabled: !!roomTypeId,
  });
}
