import { useQuery } from "@tanstack/react-query";
import { generalEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export type NationalityResponse = {
  nationalityId: string;
  nationalityName: string;
  nationalityCode: string;
  isActive: boolean;
};

type NationalityApiResponse = {
  items: NationalityResponse[];
  totalCount: number;
  page: number;
  pageSize: number;
  pageCount: number;
};

export function useGetAllNationalityQuery(params: {
  pageSize?: number;
  sortOrderBy?: boolean;
  searchTerms?: string;
  pageNumber?: number;
}) {
  const query = useQuery({
    queryKey: [
      generalEndpoints.getNationality,
      params.pageNumber,
      params.searchTerms,
      params.sortOrderBy,
    ],
    queryFn: () =>
      api.get<NationalityApiResponse>(generalEndpoints.getNationality, {
        params: {
          PageSize: params.pageSize || 10,
          PageNumber: params.pageNumber,
          SearchTerms: params.searchTerms?.trim(),
          SortOrderBy: params.sortOrderBy,
        },
      }),
  });

  return {
    ...query,
    nationalities: query.data?.data.items || [],
    totalPages: query.data?.data.pageCount || 1,
    totalItems: query.data?.data.totalCount || 0,
  };
}
