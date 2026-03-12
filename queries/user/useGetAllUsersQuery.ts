import type { UserListApiResponse, UserParams } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { userEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export function useGetAllUsersQuery(params: UserParams = {}) {
  const query = useQuery({
    queryKey: [
      userEndpoints.getUsers,
      params?.pageNumber ?? null,
      params?.searchTerms ?? null,
      params?.orderBy ?? null,
      params?.sortDirection ?? null,
      params?.pageSize ?? null,
    ],
    queryFn: async () => {
      const response = await api.get<UserListApiResponse>(userEndpoints.getUsers, {
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
    users: items,
    totalPages,
    totalItems,
  };
}
