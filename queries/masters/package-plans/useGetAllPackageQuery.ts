import { useQuery } from "@tanstack/react-query";
import { generalEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export function useGetAllPackageQuery(params: {
  PageSize?: number;
  SortOrderBy?: boolean;
  SearchTerms?: string;
  PageNumber?: number;
  Status?: number;
}) {
  const query = useQuery({
    queryKey: [
      generalEndpoints.getPackage,
      params.PageNumber,
      params.SearchTerms,
      params.SortOrderBy,
      params.Status,
    ],
    queryFn: () =>
      api.get(generalEndpoints.getPackage, {
        params: {
          PageSize: params.PageSize || 10,
          PageNumber: params.PageNumber,
          SearchTerms: params.SearchTerms?.trim(),
          SortOrderBy: params.SortOrderBy,
          Status: params.Status,
        },
      }),
  });

  return {
    ...query,
    packages: query.data?.data.items || [],
    totalPages: query.data?.data.pageCount || 1,
    totalItems: query.data?.data.totalCount || 0,
    currentPage: query.data?.data.page || 1,
  };
}
