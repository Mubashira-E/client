import { useQuery } from "@tanstack/react-query";
import { generalEndpoints } from "@/endpoints";
import { api } from "@/lib/axios";

export type LanguageResponse = {
  languageId: string;
  languageName: string;
  languageCode: string;
  isActive: boolean;
};

type LanguageApiResponse = {
  page: number;
  pageSize: number;
  pageCount: number;
  totalCount: number;
  items: LanguageResponse[];
};

export function useGetAllLanguageQuery(params: {
  pageSize?: number;
  pageNumber?: number;
  searchTerms?: string;
  sortOrderBy?: boolean;
}) {
  const query = useQuery({
    queryKey: [
      generalEndpoints.getLanguage,
      params.pageNumber,
      params.searchTerms,
      params.sortOrderBy,
    ],
    queryFn: () =>
      api.get<LanguageApiResponse>(generalEndpoints.getLanguage, {
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
    languages: query.data?.data.items || [],
    totalPages: query.data?.data.pageCount || 1,
    totalItems: query.data?.data.totalCount || 0,
  };
}
