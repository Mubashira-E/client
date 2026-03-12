import { useQuery } from "@tanstack/react-query";
import { roomEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export type RoomType = {
  roomTypeId: string;
  typeName: string;
  description: string;
  status: string;
};

// Some APIs in this project are paginated; the provided spec for roomtype
// doesn't show pagination, so we support both transparently.
type RoomTypeListApiResponse =
  | RoomType[]
  | {
    items: RoomType[];
    totalCount?: number;
    page?: number;
    pageSize?: number;
    pageCount?: number;
  };

export function useGetAllRoomTypeQuery(params: {
  pageSize?: number;
  orderBy?: string;
  sortDirection?: string;
  searchTerms?: string;
  pageNumber?: number;
  Status?: number;
}) {
  const query = useQuery({
    queryKey: [roomEndpoints.getRoomType, params.pageNumber, params.searchTerms, params.orderBy, params.sortDirection, params.Status],
    queryFn: async () => {
      const response = await api.get<RoomTypeListApiResponse>(roomEndpoints.getRoomType, {
        params: {
          PageSize: params.pageSize,
          PageNumber: params.pageNumber,
          SearchTerms: params.searchTerms,
          OrderBy: params.orderBy,
          SortDirection: params.sortDirection,
          Status: params.Status,
        },
      });
      return response.data;
    },
  });

  const data = query.data;
  const items = Array.isArray(data) ? data : data?.items ?? [];
  const totalPages = Array.isArray(data) ? 1 : data?.pageCount ?? 1;
  const totalItems = Array.isArray(data) ? items.length : data?.totalCount ?? items.length;

  return {
    ...query,
    roomTypes: items,
    totalPages,
    totalItems,
  };
}
