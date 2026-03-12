import type { Room } from "./useGetAllRoomsQuery";
import { useQuery } from "@tanstack/react-query";
import { roomEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export function useGetRoomByIdQuery(roomId: string | undefined) {
  return useQuery({
    queryKey: [roomEndpoints.getRoomById, roomId],
    enabled: !!roomId,
    queryFn: async () => {
      const response = await api.get<Room>(`${roomEndpoints.getRoomById}/${roomId}`);
      return response.data;
    },
  });
}
