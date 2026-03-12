import type { RoleListApiResponse } from "@/types/role";
import { useQuery } from "@tanstack/react-query";
import { roleEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

type Params = {
  PageSize?: number;
  SortOrderBy?: boolean;
  SearchTerms?: string;
  PageNumber?: number;
  Status?: number;
};

export function useGetAllRoleQuery(params?: Params) {
  const query = useQuery({
    queryKey: [
      roleEndpoints.getRole,
      params?.PageNumber,
      params?.SearchTerms,
      params?.SortOrderBy,
      params?.Status,
    ],
    queryFn: () =>
      api.get<RoleListApiResponse>(roleEndpoints.getRole, {
        params: params
          ? {
              PageSize: params.PageSize || 10,
              PageNumber: params.PageNumber,
              SearchTerms: params.SearchTerms?.trim(),
              SortOrderBy: params.SortOrderBy,
              Status: params.Status,
            }
          : undefined,
      }),
  });

  const rawData = query.data?.data;
  const roles = rawData?.items || [];

  return {
    ...query,
    roles,
    pagination: {
      totalCount: rawData?.totalCount,
      page: rawData?.page,
      pageSize: rawData?.pageSize,
      pageCount: rawData?.pageCount,
    },
  };
}
