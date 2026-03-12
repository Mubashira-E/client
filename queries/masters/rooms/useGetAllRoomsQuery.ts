import { useQuery } from "@tanstack/react-query";
import { roomEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export type Room = {
  roomId: string;
  roomName: string;
  roomTypeId: string;
  roomType: string;
  roomLocation: string;
  remarks: string;
  status?: string;
};

type RoomListApiResponse = {
  items: Room[];
  totalCount?: number;
  page?: number;
  pageSize?: number;
  pageCount?: number;
};

type Params = {
  pageSize?: number;
  orderBy?: string;
  sortDirection?: string;
  searchTerms?: string;
  pageNumber?: number;
};

export function useGetAllRoomsQuery(params: Params = {}) {
  const query = useQuery({
    queryKey: [
      roomEndpoints.getRoom,
      params?.pageNumber ?? null,
      params?.searchTerms ?? null,
      params?.orderBy ?? null,
      params?.sortDirection ?? null,
      params?.pageSize ?? null,
    ],
    queryFn: async () => {
      const response = await api.get<RoomListApiResponse>(roomEndpoints.getRoom, {
        params: {
          PageNumber: params?.pageNumber,
          PageSize: params?.pageSize,
          SearchTerms: params?.searchTerms,
          OrderBy: params?.orderBy,
          SortDirection: params?.sortDirection,
        },
      });
      return response.data;
    },
  });

  const data = query.data;
  const items = data?.items ?? [];
  const totalPages = data?.pageCount ?? 1;
  const totalItems = data?.totalCount ?? items.length;

  return {
    ...query,
    rooms: items,
    totalPages,
    totalItems,
  };
}
