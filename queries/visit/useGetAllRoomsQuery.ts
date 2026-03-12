import { useQuery } from "@tanstack/react-query";
import { roomEndpoints } from "@/endpoints";
import { api } from "@/lib/axios"; // adjust to your lib export
import type { RoomGetAllResponse } from "@/types/appointment";

interface PagedResult<T> {
  items:      T[];
  totalCount: number;
  pageNumber: number;
  pageSize:   number;
  totalPages: number;
}

export const useGetAllRoomsQuery = () => {
  return useQuery<PagedResult<RoomGetAllResponse>>({
    queryKey: ["rooms"],
    queryFn:  async () => {
      const { data } = await api.get(roomEndpoints.getRoom, {
        params: { pageNumber: 1, pageSize: 100 },
      });
      return data;
    },
    staleTime: 5 * 60 * 1000, // cache for 5 mins — rooms rarely change
  });
};
